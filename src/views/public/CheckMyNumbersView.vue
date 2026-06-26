<template>
  <div style="min-height: 100vh; background: var(--negro);">
    <PublicNavbar />

    <div class="container py-5" style="max-width: 640px;">
      <div class="text-center mb-4">
        <div style="font-size: 2.5rem;">🎟️</div>
        <h1 style="font-family: var(--font-display); font-size: 2rem; margin: 8px 0 4px;">CONSULTAR MIS NÚMEROS</h1>
        <p style="color: var(--gris-light);">Ingresa tu correo y teléfono para ver tus números comprados</p>
      </div>

      <div class="p-4 rounded-3 mb-4" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
        <div class="mb-3">
          <label class="form-label" style="font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Correo electrónico</label>
          <input v-model="email" type="email" class="form-control"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white;"
                 placeholder="tucorreo@email.com" @keyup.enter="search" />
        </div>
        <div class="mb-3">
          <label class="form-label" style="font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Teléfono</label>
          <input v-model="phone" type="text" class="form-control"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white;"
                 placeholder="+573001234567" @keyup.enter="search" />
        </div>

        <div v-if="error" class="alert mb-3" style="background: rgba(204,0,0,0.15); border: 1px solid var(--rojo); color: var(--blanco);">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
        </div>

        <button @click="search" :disabled="loading || !email.trim() || !phone.trim()" class="btn btn-primary btn-lg w-100">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-search me-2"></i>
          {{ loading ? 'Buscando...' : 'Consultar mis números' }}
        </button>
      </div>

      <!-- Sin resultados -->
      <div v-if="searched && !loading && !result?.found" class="text-center py-4" style="color: var(--gris-light);">
        <i class="bi bi-inbox" style="font-size: 2.5rem;"></i>
        <p class="mt-2">No encontramos compras aprobadas con esos datos.</p>
        <p style="font-size: 0.8rem;">Verifica que el correo y teléfono sean los mismos que usaste al comprar.</p>
      </div>

      <!-- Resultados -->
      <div v-if="result?.found" class="fade-up">
        <div v-for="purchase in result.purchases" :key="purchase.id" class="p-4 rounded-3 mb-3"
             style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
          <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <div>
              <div style="font-weight: 700; font-size: 1.1rem;">{{ purchase.raffleTitle }}</div>
              <div style="color: var(--rojo); font-size: 0.9rem;">{{ purchase.prize }}</div>
            </div>
            <span class="badge" :style="raffleStatusStyle(purchase.raffleStatus)">{{ raffleStatusLabel(purchase.raffleStatus) }}</span>
          </div>

          <div style="font-size: 0.75rem; color: var(--gris-light); margin-bottom: 8px;">
            TUS {{ purchase.numbers.length }} NÚMEROS
            <small style="color: #FFD700;" v-if="purchase.numbers.some(n => n.isBlessed)">⭐ = Número Bendecido</small>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <span v-for="n in purchase.numbers" :key="n.number"
                  :style="n.isBlessed
                    ? 'background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; padding: 6px 12px; border-radius: 6px; font-family: monospace; font-weight: 700;'
                    : 'background: var(--rojo); color: white; padding: 6px 12px; border-radius: 6px; font-family: monospace; font-weight: 700;'">
              <template v-if="n.isBlessed">⭐ </template>{{ n.number }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
import { purchasesApi } from '@/services/api'

const email = ref('')
const phone = ref('')
const loading = ref(false)
const searched = ref(false)
const error = ref('')
const result = ref(null)

async function search() {
  if (!email.value.trim() || !phone.value.trim()) return

  loading.value = true
  error.value = ''
  result.value = null
  searched.value = true

  try {
    const res = await purchasesApi.checkMyNumbers(email.value.trim(), phone.value.trim())
    result.value = res.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al consultar. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}

function raffleStatusLabel(s) {
  return { OPEN: 'ABIERTA', CLOSED: 'CERRADA', DRAWN: '🏆 FINALIZADA' }[s] || s
}

function raffleStatusStyle(s) {
  const map = {
    OPEN: 'background: rgba(76,175,80,0.2); color: #4CAF50;',
    CLOSED: 'background: rgba(158,158,158,0.2); color: #9E9E9E;',
    DRAWN: 'background: rgba(255,215,0,0.15); color: #FFD700;',
  }
  return map[s] || ''
}
</script>

<style scoped>
.fade-up {
  animation: fadeUp 0.4s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
