<template>
  <div style="min-height: 100vh; background: var(--negro);">
    <PublicNavbar />

    <div class="container py-5" style="max-width: 680px;">
      <!-- Header -->
      <router-link to="/" style="color: var(--gris-light); text-decoration:none; font-size:0.9rem;" class="d-inline-block mb-4">
        <i class="bi bi-arrow-left me-1"></i> Volver al inicio
      </router-link>

      <h1 style="font-size: 2.5rem; margin-bottom: 4px;">MIS COMPRAS</h1>
      <p style="color: var(--gris-light);">Busca tus números usando tu teléfono o correo</p>
      <hr class="divider-rojo" />

      <!-- Search Form -->
      <div class="p-4 rounded-3 mb-4" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
        <div class="mb-3">
          <label class="form-label" style="font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Teléfono o Correo electrónico *</label>
          <input v-model="searchQuery" 
                 type="text" 
                 class="form-control"
                 @keyup.enter="search"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white;" 
                 placeholder="Ingresa tu teléfono (+573001234567) o correo (juan@email.com)" />
          <small style="color: var(--gris-light);">Ingresa exactamente como los registraste al comprar</small>
        </div>

        <div v-if="error" class="alert mb-3" style="background: rgba(204,0,0,0.15); border: 1px solid var(--rojo); color: var(--blanco);">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
        </div>

        <button @click="search" :disabled="loading || !searchQuery.trim()" class="btn btn-primary btn-lg w-100">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-search me-2"></i>
          {{ loading ? 'Buscando...' : 'Buscar mis números' }}
        </button>
      </div>

      <!-- No results yet -->
      <div v-if="searched && !loading && results.length === 0" class="text-center py-5">
        <i class="bi bi-inbox" style="font-size: 3rem; color: var(--gris-light);"></i>
        <p style="color: var(--gris-light); margin-top: 16px;">No encontramos compras con esos datos</p>
        <small style="color: var(--gris-light);">Asegúrate de ingresar correctamente tu teléfono o correo</small>
      </div>

      <!-- Results -->
      <div v-else-if="results.length > 0" class="fade-up">
        <!-- Summary -->
        <div class="p-3 rounded-3 mb-4" style="background: rgba(255, 0, 0, 0.05); border: 1px solid var(--rojo);">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div style="font-size: 0.75rem; color: var(--gris-light); text-transform: uppercase; letter-spacing: 0.1em;">Total encontrado</div>
              <div style="font-family: var(--font-display); font-size: 2rem; color: var(--rojo);">{{ totalNumbers }}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.75rem; color: var(--gris-light); text-transform: uppercase; letter-spacing: 0.1em;">Compras</div>
              <div style="font-family: var(--font-display); font-size: 2rem;">{{ results.length }}</div>
            </div>
          </div>
        </div>

        <!-- Purchases list -->
        <div class="d-flex flex-column gap-3">
          <div v-for="purchase in results" :key="purchase.id" 
               class="p-4 rounded-3"
               :style="purchase.hasBlessedNumber ? 'background: rgba(255,215,0,0.06); border: 2px solid rgba(255,215,0,0.3);' : 'background: var(--negro-soft); border: 1px solid var(--gris-dark);'">
            
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <div style="font-weight: 600; font-size: 1rem;">{{ purchase.raffleName }}</div>
                <div style="font-size: 0.8rem; color: var(--gris-light);">{{ formatDate(purchase.createdAt) }}</div>
              </div>
              <span class="badge" :style="statusStyle(purchase.status)" style="height: fit-content;">{{ statusLabel(purchase.status) }}</span>
            </div>

            <!-- Blessed number badge -->
            <div v-if="purchase.hasBlessedNumber" class="mb-3">
              <span class="blessed-badge">⭐ Tienes un número bendecido</span>
            </div>

            <!-- Details -->
            <div class="row g-3 mb-3" style="font-size: 0.9rem;">
              <div class="col-6">
                <div style="color: var(--gris-light); font-size: 0.75rem; text-transform: uppercase;">Números comprados</div>
                <div style="font-family: var(--font-display); font-size: 1.5rem; color: var(--rojo);">{{ purchase.quantity }}</div>
              </div>
              <div class="col-6">
                <div style="color: var(--gris-light); font-size: 0.75rem; text-transform: uppercase;">Valor</div>
                <div style="font-family: var(--font-display); font-size: 1.2rem;">${{ Number(purchase.totalAmount).toLocaleString('es-CO') }}</div>
              </div>
            </div>

            <!-- Status message -->
            <div class="p-3 rounded-2 mb-3" :style="getStatusMessage(purchase.status).style">
              <i :class="`bi ${getStatusMessage(purchase.status).icon} me-2`"></i>
              {{ getStatusMessage(purchase.status).text }}
            </div>

            <!-- Numbers list (if approved) -->
            <div v-if="purchase.status === 'APPROVED' && purchase.numbers" class="mb-3">
              <div style="font-size: 0.75rem; color: var(--gris-light); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Tus números</div>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="num in purchase.numbers" :key="num"
                      class="number-badge"
                      :class="{ 'blessed': isBlessedNumber(purchase, num) }">
                  {{ num }}
                </span>
              </div>
            </div>

            <!-- Voucher link -->
            <div v-if="purchase.voucherPath">
              <a :href="`http://localhost:3000/${purchase.voucherPath}`" target="_blank" class="btn btn-sm btn-outline-light">
                <i class="bi bi-image me-1"></i>Ver comprobante de pago
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
import { purchasesApi } from '@/services/api'

const searchQuery = ref('')
const loading = ref(false)
const searched = ref(false)
const error = ref('')
const results = ref([])

const totalNumbers = computed(() => {
  return results.value.reduce((sum, p) => sum + (p.quantity || 0), 0)
})

const search = async () => {
  if (!searchQuery.value.trim()) return

  loading.value = true
  error.value = ''
  results.value = []
  searched.value = true

  try {
    const response = await purchasesApi.searchByContactInfo(searchQuery.value)
    results.value = response.data || []
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al buscar tus compras. Intenta nuevamente.'
    results.value = []
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

const statusLabel = (status) => {
  const labels = {
    PENDING: 'Pendiente pago',
    REVIEW: 'Por revisar',
    APPROVED: 'Aprobado',
    REJECTED: 'Rechazado',
    CANCELLED: 'Cancelado'
  }
  return labels[status] || status
}

const statusStyle = (status) => {
  const styles = {
    PENDING: 'background: rgba(255, 193, 7, 0.2); color: #FFC107;',
    REVIEW: 'background: rgba(33, 150, 243, 0.2); color: #2196F3;',
    APPROVED: 'background: rgba(76, 175, 80, 0.2); color: #4CAF50;',
    REJECTED: 'background: rgba(244, 67, 54, 0.2); color: #F44336;',
    CANCELLED: 'background: rgba(158, 158, 158, 0.2); color: #9E9E9E;'
  }
  return styles[status] || ''
}

const getStatusMessage = (status) => {
  const messages = {
    PENDING: {
      text: 'Espera tu confirmación de pago',
      icon: 'bi-hourglass-split',
      style: 'background: rgba(255, 193, 7, 0.1); color: #FFC107;'
    },
    REVIEW: {
      text: 'Tu comprobante de pago está siendo revisado',
      icon: 'bi-eye',
      style: 'background: rgba(33, 150, 243, 0.1); color: #2196F3;'
    },
    APPROVED: {
      text: '✓ Tu pago fue aprobado',
      icon: 'bi-check-circle-fill',
      style: 'background: rgba(76, 175, 80, 0.1); color: #4CAF50;'
    },
    REJECTED: {
      text: 'Tu compra fue rechazada. Contáctanos',
      icon: 'bi-x-circle-fill',
      style: 'background: rgba(244, 67, 54, 0.1); color: #F44336;'
    },
    CANCELLED: {
      text: 'Tu compra fue cancelada',
      icon: 'bi-dash-circle-fill',
      style: 'background: rgba(158, 158, 158, 0.1); color: #9E9E9E;'
    }
  }
  return messages[status] || messages.PENDING
}

const isBlessedNumber = (purchase, number) => {
  return purchase.blessedNumbers && purchase.blessedNumbers.includes(number)
}
</script>

<style scoped>
.number-badge {
  display: inline-block;
  padding: 8px 12px;
  background: var(--rojo);
  color: white;
  border-radius: 6px;
  font-weight: 600;
  font-family: var(--font-display);
  font-size: 0.9rem;
}

.number-badge.blessed {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: black;
}

.blessed-badge {
  display: inline-block;
  padding: 4px 8px;
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid rgba(255, 215, 0, 0.5);
  color: #FFD700;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.fade-up {
  animation: fadeUp 0.4s ease-out;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
