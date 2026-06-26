<template>
  <div style="min-height: 100vh; background: var(--negro);">
    <PublicNavbar />

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" style="color: var(--rojo);"></div>
    </div>

    <div v-else-if="raffle" class="container py-5">
      <nav class="mb-4">
        <router-link to="/" style="color: var(--gris-light); text-decoration:none; font-size:0.9rem;">
          <i class="bi bi-arrow-left me-1"></i> Volver a rifas
        </router-link>
      </nav>

      <div class="row g-5">
        <div class="col-lg-7">
          <span class="badge-rojo mb-3 d-inline-block">{{ statusLabel }}</span>
          <h1 style="font-size: clamp(2rem, 5vw, 3.5rem);">{{ raffle.title }}</h1>
          <p class="mt-3" style="color: var(--gris-light); line-height: 1.7;">
            {{ raffle.description || 'Participa y gana este increíble premio.' }}
          </p>

          <hr class="divider-rojo" />

          <!-- Premio -->
          <div class="p-4 rounded-3 mb-4" style="background: rgba(204,0,0,0.1); border: 1px solid var(--rojo);">
            <div style="font-size: 0.75rem; color: var(--gris-light); text-transform: uppercase;">Premio principal</div>
            <div style="font-family: var(--font-display); font-size: 2rem; color: var(--rojo);">{{ raffle.prize }}</div>
          </div>

          <!-- Números bendecidos banner -->
          <div v-if="raffle.blessedCount > 0" class="p-4 rounded-3 mb-4"
               style="background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(255,165,0,0.05)); border: 1px solid #FFD700;">
            <div class="d-flex align-items-center gap-2 mb-2">
              <span style="font-size: 1.5rem;">⭐</span>
              <div>
                <div style="font-family: var(--font-display); font-size: 1.2rem; color: #FFD700;">NÚMEROS BENDECIDOS</div>
                <div style="font-size: 0.8rem; color: var(--gris-light);">
                  {{ raffle.blessedCount }} números especiales con premio adicional de
                  <strong style="color: #FFD700;">${{ Number(raffle.blessedPrize).toLocaleString('es-CO') }} COP</strong>
                </div>
              </div>
            </div>

            <!-- Lista de números bendecidos -->
            <div v-if="blessedNumbers.length > 0" class="mt-3">
              <div style="font-size: 0.75rem; color: var(--gris-light); margin-bottom: 8px;">Números bendecidos:</div>
              <div class="d-flex flex-wrap gap-2">
                <span v-for="b in blessedNumbers" :key="b.number"
                      :class="['px-2 py-1 rounded', b.taken ? 'opacity-50' : '']"
                      :style="b.taken
                        ? 'background: #333; color: #666; font-family: monospace; font-size: 0.9rem; text-decoration: line-through;'
                        : 'background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; font-family: monospace; font-size: 0.9rem; font-weight: 800;'">
                  ⭐ {{ b.number }}
                  <span v-if="b.taken" style="font-size: 0.65rem;"> (tomado)</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Detalles -->
          <div class="row g-3">
            <div class="col-6">
              <div class="p-3 rounded-3" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
                <div style="font-size: 0.7rem; color: var(--gris-light); text-transform: uppercase;">Precio por número</div>
                <div style="font-family: var(--font-display); font-size: 1.8rem; color: var(--rojo);">
                  ${{ Number(raffle.pricePerNumber).toLocaleString('es-CO') }}
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="p-3 rounded-3" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
                <div style="font-size: 0.7rem; color: var(--gris-light); text-transform: uppercase;">Fecha del sorteo</div>
                <div style="font-size: 1rem; font-weight: 600; margin-top: 4px;">{{ formatDate(raffle.drawDate) }}</div>
              </div>
            </div>
          </div>

          <!-- Progreso -->
          <div v-if="stats" class="mt-4">
            <div style="font-size: 0.8rem; color: var(--gris-light); margin-bottom: 8px;">
              {{ stats.sold }} vendidos de {{ stats.totalNumbers }}
            </div>
            <div class="progress" style="height: 8px; background: var(--gris-dark); border-radius: 4px;">
              <div class="progress-bar" :style="`width: ${stats.percentageSold}%; background: var(--rojo);`"></div>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <span style="font-size: 0.75rem; color: var(--gris-light);">{{ stats.percentageSold }}% vendido</span>
              <span style="font-size: 0.75rem; color: var(--gris-light);">{{ stats.available }} disponibles</span>
            </div>
          </div>
        </div>

        <!-- Panel de compra -->
        <div class="col-lg-5">
          <div class="p-4 rounded-3 sticky-top" style="background: var(--negro-soft); border: 2px solid var(--rojo); top: 80px;">
            <h3 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 20px;">
              <i class="bi bi-ticket-perforated me-2" style="color: var(--rojo);"></i>PARTICIPAR
            </h3>

            <div v-if="raffle.status === 'DRAWN'" class="text-center py-3">
              <div style="font-size: 3rem; line-height: 1;">🏆</div>
              <span class="badge mt-2 d-inline-block" style="background: rgba(255,215,0,0.15); color: #FFD700; border: 1px solid #FFD700; letter-spacing: 0.08em; font-size: 0.7rem; padding: 6px 14px;">
                EVENTO FINALIZADO
              </span>
              <p class="mt-3 mb-1" style="color: var(--gris-light); font-size: 0.9rem;">¿Ya participaste? Consulta tus números aquí:</p>
              <router-link to="/consultar-numeros" class="btn btn-primary w-100 mt-2">
                <i class="bi bi-search me-2"></i>Consultar mis números
              </router-link>
            </div>

            <div v-else-if="raffle.status !== 'OPEN'" class="text-center py-3" style="color: var(--gris-light);">
              <i class="bi bi-lock" style="font-size: 2rem;"></i>
              <p class="mt-2">Esta rifa ya no está disponible.</p>
            </div>

            <div v-else>
              <div v-if="raffle.blessedCount > 0" class="p-2 rounded-3 mb-3 text-center"
                   style="background: rgba(255,215,0,0.08); border: 1px solid rgba(255,215,0,0.3); font-size: 0.8rem; color: #FFD700;">
                ⭐ {{ raffle.blessedCount }} números bendecidos disponibles
              </div>

              <router-link :to="`/rifas/${raffle.id}/comprar`" class="btn btn-primary btn-lg w-100">
                <i class="bi bi-cart-plus me-2"></i>Comprar Números
              </router-link>
              <p class="text-center mt-3" style="font-size: 0.8rem; color: var(--gris-light);">
                Mínimo 25 números · ${{ (25 * Number(raffle.pricePerNumber)).toLocaleString('es-CO') }} COP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
import { rafflesApi } from '@/services/api'

const route = useRoute()
const raffle = ref(null)
const stats = ref(null)
const blessedNumbers = ref([])
const loading = ref(true)

const statusLabel = computed(() => ({ OPEN: 'ABIERTA', CLOSED: 'CERRADA', DRAWN: 'FINALIZADA' }[raffle.value?.status]))

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}

onMounted(async () => {
  const id = route.params.id
  try {
    const [r, s, b] = await Promise.all([
      rafflesApi.getOne(id),
      rafflesApi.getStats(id),
      rafflesApi.getBlessedNumbers(id),
    ])
    raffle.value = r.data
    stats.value = s.data
    blessedNumbers.value = b.data
  } catch {
    raffle.value = null
  } finally {
    loading.value = false
  }
})
</script>
