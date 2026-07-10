<template>
  <AdminLayout>
    <div class="fade-up">
      <router-link :to="`/admin/rifas/${raffleId}/compras`" style="color: var(--gris-light); text-decoration:none; font-size:0.9rem;" class="d-inline-block mb-4">
        <i class="bi bi-arrow-left me-1"></i>Volver a compras
      </router-link>

      <h1 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 4px;">ESTADÍSTICAS DE LA RIFA</h1>
      <p style="color: var(--gris-light); margin-bottom: 20px;">Top de compradores y búsqueda de números</p>
      <hr class="divider-rojo" />

      <!-- ── Buscar número específico ── -->
      <div class="p-4 rounded-3 mb-4" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
        <h2 style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 12px;">
          <i class="bi bi-search me-2"></i>Buscar a quién pertenece un número
        </h2>
        <div class="d-flex gap-2 flex-wrap">
          <input v-model="searchNumber"
                 type="text"
                 maxlength="4"
                 class="form-control"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white; max-width: 220px;"
                 placeholder="Ej: 0452"
                 @keyup.enter="findNumber" />
          <button @click="findNumber" :disabled="searchingNumber || !searchNumber.trim()" class="btn btn-primary">
            <span v-if="searchingNumber" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-search me-2"></i>Buscar
          </button>
        </div>

        <div v-if="numberError" class="alert mt-3 mb-0" style="background: rgba(204,0,0,0.15); border: 1px solid var(--rojo); color: var(--blanco);">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ numberError }}
        </div>

        <div v-if="numberResult && !numberError" class="mt-3 p-3 rounded-3" style="background: var(--gris-dark); border: 1px solid var(--gris);">
          <div class="d-flex align-items-center gap-2 mb-2">
            <span style="font-family: var(--font-display); font-size: 1.4rem; color: var(--rojo);">{{ numberResult.number }}</span>
            <span v-if="numberResult.isBlessed" style="color: #FFD700; font-size: 0.85rem;">⭐ Número bendecido</span>
          </div>

          <div v-if="!numberResult.found" style="color: var(--gris-light);">
            <i class="bi bi-info-circle me-2"></i>{{ numberResult.message }}
          </div>

          <div v-else>
            <div style="font-weight: 600; font-size: 1.1rem;">{{ numberResult.purchase.buyerName }}</div>
            <div style="font-size: 0.85rem; color: var(--gris-light);">
              <div><i class="bi bi-envelope me-2"></i>{{ numberResult.purchase.buyerEmail }}</div>
              <div><i class="bi bi-telephone me-2"></i>{{ numberResult.purchase.buyerPhone }}</div>
              <div v-if="numberResult.purchase.buyerCity"><i class="bi bi-geo-alt me-2"></i>{{ numberResult.purchase.buyerCity }}</div>
            </div>
            <div class="mt-2">
              <span class="badge" :style="statusStyle(numberResult.purchase.status)">{{ statusLabel(numberResult.purchase.status) }}</span>
              <span style="font-size: 0.8rem; color: var(--gris-light); margin-left: 8px;">
                Compró {{ numberResult.purchase.quantity }} números · ${{ Number(numberResult.purchase.totalAmount).toLocaleString('es-CO') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Top de compradores ── -->
      <div class="p-4 rounded-3 mb-4" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
        <h2 style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 12px;">
          <i class="bi bi-trophy me-2"></i>Top de compradores (general)
        </h2>

        <div v-if="loadingTop" class="text-center py-4">
          <div class="spinner-border" style="color: var(--rojo);"></div>
        </div>

        <div v-else-if="topBuyers.length === 0" class="text-center py-4" style="color: var(--gris-light);">
          Aún no hay compras registradas en esta rifa
        </div>

        <div v-else class="table-responsive">
          <table class="table" style="color: var(--blanco); font-size: 0.85rem;">
            <thead style="border-bottom: 2px solid var(--rojo);">
              <tr style="color: var(--gris-light); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem;">
                <th>#</th><th>Comprador</th><th>Compras</th><th>Números</th><th>Invertido</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="b in topBuyers" :key="b.buyerEmail" style="border-bottom: 1px solid var(--gris-dark);">
                <td>
                  <span v-if="b.rank === 1" style="font-size: 1.2rem;">🥇</span>
                  <span v-else-if="b.rank === 2" style="font-size: 1.2rem;">🥈</span>
                  <span v-else-if="b.rank === 3" style="font-size: 1.2rem;">🥉</span>
                  <span v-else style="color: var(--gris-light);">{{ b.rank }}</span>
                </td>
                <td>
                  <div style="font-weight: 600;">{{ b.buyerName }}</div>
                  <div style="font-size: 0.75rem; color: var(--gris-light);">{{ b.buyerEmail }}</div>
                  <div style="font-size: 0.75rem; color: var(--gris-light);">{{ b.buyerPhone }}</div>
                </td>
                <td style="color: var(--gris-light);">{{ b.purchasesCount }}</td>
                <td>
                  <span style="font-family: var(--font-display); color: var(--rojo); font-size: 1.3rem;">{{ b.totalNumbers }}</span>
                </td>
                <td style="font-weight: 600;">${{ b.totalSpent.toLocaleString('es-CO') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── Top por día ── -->
      <div class="p-4 rounded-3" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
        <h2 style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 12px;">
          <i class="bi bi-calendar-day me-2"></i>Top de compradores por día
        </h2>

        <div class="d-flex gap-2 flex-wrap mb-3">
          <input v-model="selectedDate" type="date" class="form-control"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white; max-width: 220px;" />
          <button @click="loadTopByDay" :disabled="loadingDay || !selectedDate" class="btn btn-primary">
            <span v-if="loadingDay" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-search me-2"></i>Consultar
          </button>
        </div>

        <div v-if="dayError" class="alert mb-3" style="background: rgba(204,0,0,0.15); border: 1px solid var(--rojo); color: var(--blanco);">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ dayError }}
        </div>

        <div v-if="dayResult && !loadingDay">
          <div v-if="dayResult.purchases.length === 0" class="text-center py-3" style="color: var(--gris-light);">
            No hay compras aprobadas para el día seleccionado
          </div>

          <div v-else>
            <div class="mb-3 p-3 rounded-3 d-flex justify-content-between align-items-center"
                 style="background: rgba(204,0,0,0.1); border: 1px solid rgba(204,0,0,0.3);">
              <span style="font-size: 0.85rem; color: var(--gris-light);">Total recaudado ese día</span>
              <span style="font-family: var(--font-display); font-size: 1.4rem; color: var(--rojo);">
                ${{ dayResult.grandTotal.toLocaleString('es-CO') }} COP
              </span>
            </div>

            <div v-for="b in dayResult.purchases" :key="b.buyerEmail"
                 class="p-3 rounded-3 mb-3"
                 style="background: var(--gris-dark); border: 1px solid var(--gris);">
              <div class="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                <div class="d-flex align-items-center gap-2">
                  <span style="font-size: 1.4rem;">
                    {{ b.rank === 1 ? '🥇' : b.rank === 2 ? '🥈' : b.rank === 3 ? '🥉' : `#${b.rank}` }}
                  </span>
                  <div>
                    <div style="font-weight: 700; font-size: 1rem;">{{ b.buyerName }}</div>
                    <div style="font-size: 0.75rem; color: var(--gris-light);">
                      <i class="bi bi-envelope me-1"></i>{{ b.buyerEmail }}
                      · <i class="bi bi-telephone me-1"></i>{{ b.buyerPhone }}
                      <span v-if="b.buyerCity"> · <i class="bi bi-geo-alt me-1"></i>{{ b.buyerCity }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-end">
                  <div style="font-family: var(--font-display); color: var(--rojo); font-size: 1.4rem;">{{ b.totalNumbers }} núm.</div>
                  <div style="font-size: 0.8rem; color: var(--gris-light);">${{ b.totalSpent.toLocaleString('es-CO') }} COP</div>
                </div>
              </div>

              <div style="font-size: 0.75rem; color: var(--gris-light); margin-bottom: 6px;">NÚMEROS COMPRADOS</div>
              <div class="d-flex flex-wrap gap-1">
                <span v-for="n in b.numbers" :key="n.number"
                      :style="n.isBlessed
                        ? 'background: linear-gradient(135deg,#FFD700,#FFA500); color:#000; padding:3px 8px; border-radius:4px; font-family:monospace; font-size:0.8rem; font-weight:700;'
                        : 'background: var(--rojo); color:white; padding:3px 8px; border-radius:4px; font-family:monospace; font-size:0.8rem; font-weight:700;'">
                  <template v-if="n.isBlessed">⭐</template>{{ n.number }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { purchasesApi } from '@/services/api'

const route = useRoute()
const raffleId = route.params.id

const topBuyers = ref([])
const loadingTop = ref(true)

const searchNumber = ref('')
const searchingNumber = ref(false)
const numberResult = ref(null)
const numberError = ref('')

const selectedDate = ref(new Date().toISOString().slice(0, 10))
const loadingDay = ref(false)
const dayResult = ref(null)
const dayError = ref('')

async function loadTopByDay() {
  if (!selectedDate.value) return
  loadingDay.value = true
  dayError.value = ''
  dayResult.value = null
  try {
    const res = await purchasesApi.getTopBuyersByDay(raffleId, selectedDate.value)
    dayResult.value = res.data
  } catch (e) {
    dayError.value = e.response?.data?.message || 'Error al cargar el top del día'
  } finally {
    loadingDay.value = false
  }
}

async function loadTopBuyers() {
  loadingTop.value = true
  try {
    const res = await purchasesApi.getTopBuyers(raffleId)
    topBuyers.value = res.data || []
  } catch (e) {
    console.error('Error cargando top de compradores', e)
  } finally {
    loadingTop.value = false
  }
}

async function findNumber() {
  const num = searchNumber.value.trim()
  if (!num) return

  searchingNumber.value = true
  numberError.value = ''
  numberResult.value = null

  try {
    const res = await purchasesApi.findTicketOwner(raffleId, num)
    numberResult.value = res.data
  } catch (e) {
    numberError.value = e.response?.data?.message || 'Error al buscar el número'
  } finally {
    searchingNumber.value = false
  }
}

function statusStyle(s) {
  const map = { PAID: 'background:#1a6b1a', PENDING: 'background:#444', REVIEW: 'background:#7a6500', FAILED: 'background:#5a0000' }
  return map[s] || 'background:#444'
}

function statusLabel(s) {
  const map = { PAID: '✓ Aprobado', PENDING: 'Pendiente', REVIEW: '⏳ Por revisar', FAILED: '✗ Rechazado' }
  return map[s] || s
}

onMounted(loadTopBuyers)
</script>

<style scoped>
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
