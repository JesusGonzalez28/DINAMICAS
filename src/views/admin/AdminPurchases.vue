<template>
  <AdminLayout>
    <div class="fade-up">
      <router-link to="/admin/rifas" style="color: var(--gris-light); text-decoration:none; font-size:0.9rem;" class="d-inline-block mb-4">
        <i class="bi bi-arrow-left me-1"></i>Volver a rifas
      </router-link>

      <h1 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 4px;">COMPRAS</h1>
      <hr class="divider-rojo" />

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border" style="color: var(--rojo);"></div>
      </div>

      <div v-else>
        <!-- Resumen -->
        <div class="row g-3 mb-4">
          <div class="col-sm-3">
            <div class="p-3 rounded-3 text-center" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
              <div style="font-family: var(--font-display); font-size: 1.8rem;">{{ purchases.length }}</div>
              <div style="font-size: 0.75rem; color: var(--gris-light);">Total</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="p-3 rounded-3 text-center" style="background: var(--negro-soft); border: 1px solid #7a6500;">
              <div style="font-family: var(--font-display); font-size: 1.8rem; color: #f0c000;">{{ reviewCount }}</div>
              <div style="font-size: 0.75rem; color: var(--gris-light);">Por revisar</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="p-3 rounded-3 text-center" style="background: var(--negro-soft); border: 1px solid #1a6b1a;">
              <div style="font-family: var(--font-display); font-size: 1.8rem; color: #4caf50;">{{ paidCount }}</div>
              <div style="font-size: 0.75rem; color: var(--gris-light);">Aprobadas</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="p-3 rounded-3 text-center" style="background: var(--negro-soft); border: 1px solid #FFD700;">
              <div style="font-family: var(--font-display); font-size: 1.8rem; color: #FFD700;">{{ blessedCount }}</div>
              <div style="font-size: 0.75rem; color: var(--gris-light);">⭐ Bendecidos</div>
            </div>
          </div>
        </div>

        <!-- Recaudo -->
        <div class="p-3 rounded-3 mb-4" style="background: rgba(204,0,0,0.08); border: 1px solid var(--rojo);">
          <span style="color: var(--gris-light); font-size: 0.85rem;">Total recaudado (aprobados): </span>
          <span style="font-family: var(--font-display); font-size: 1.4rem; color: var(--rojo);">${{ totalRecaudo.toLocaleString('es-CO') }} COP</span>
        </div>

        <!-- Tabla -->
        <div class="table-responsive">
          <table class="table" style="color: var(--blanco); font-size: 0.85rem;">
            <thead style="border-bottom: 2px solid var(--rojo);">
              <tr style="color: var(--gris-light); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem;">
                <th>Comprador</th><th>Ciudad</th><th>Números</th><th>Total</th><th>Estado</th><th>Comprobante</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in purchases" :key="p.id"
                  :style="p.hasBlessed ? 'border-bottom: 1px solid rgba(255,215,0,0.2); background: rgba(255,215,0,0.02);' : 'border-bottom: 1px solid var(--gris-dark);'">
                <td>
                  <div style="font-weight: 600;">{{ p.buyerName }}</div>
                  <div style="font-size: 0.75rem; color: var(--gris-light);">{{ p.buyerEmail }}</div>
                  <div style="font-size: 0.75rem; color: var(--gris-light);">{{ p.buyerPhone }}</div>
                  <!-- Indicador de número bendecido -->
                  <div v-if="p.hasBlessed" class="mt-1">
                    <span class="blessed-badge">⭐ Tiene número bendecido</span>
                  </div>
                </td>
                <td style="color: var(--gris-light);">{{ p.buyerCity || '—' }}</td>
                <td>
                  <span style="font-family: var(--font-display); color: var(--rojo); font-size: 1.2rem;">{{ p.quantity }}</span>
                  <div v-if="p.hasBlessed" style="font-size: 0.7rem; color: #FFD700;">⭐ incluye bendecido</div>
                </td>
                <td style="font-weight: 600;">${{ Number(p.totalAmount).toLocaleString('es-CO') }}</td>
                <td>
                  <span class="badge" :style="statusStyle(p.status)">{{ statusLabel(p.status) }}</span>
                </td>
                <td>
                  <a v-if="p.voucherPath"
                     :href="fileUrl(p.voucherPath)"
                     target="_blank"
                     class="btn btn-sm btn-outline-light">
                    <i class="bi bi-image me-1"></i>Ver
                  </a>
                  <span v-else style="color: var(--gris); font-size: 0.75rem;">Sin comprobante</span>
                </td>
                <td>
                  <div class="d-flex flex-column gap-1">
                    <button v-if="p.status === 'REVIEW'"
                            @click="approve(p)"
                            class="btn btn-sm"
                            style="background: #1a6b1a; color: white; font-size: 0.75rem;">
                      <i class="bi bi-check-lg me-1"></i>Aprobar
                    </button>
                    <button v-if="p.status === 'REVIEW' || p.status === 'PENDING'"
                            @click="reject(p)"
                            class="btn btn-sm btn-outline-danger"
                            style="font-size: 0.75rem;">
                      <i class="bi bi-x-lg me-1"></i>Rechazar
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="purchases.length === 0">
                <td colspan="7" class="text-center py-4" style="color: var(--gris-light);">No hay compras aún</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { purchasesApi, rafflesApi } from '@/services/api'
import { fileUrl } from '@/services/files'

const route = useRoute()
const raffleId = route.params.id
const purchases = ref([])
const blessedNumbers = ref([])
const loading = ref(true)

const reviewCount = computed(() => purchases.value.filter(p => p.status === 'REVIEW').length)
const paidCount = computed(() => purchases.value.filter(p => p.status === 'PAID').length)
const blessedCount = computed(() => purchases.value.filter(p => p.hasBlessed).length)
const totalRecaudo = computed(() =>
  purchases.value.filter(p => p.status === 'PAID').reduce((s, p) => s + Number(p.totalAmount), 0)
)

function statusStyle(s) {
  const map = { PAID: 'background:#1a6b1a', PENDING: 'background:#444', REVIEW: 'background:#7a6500', FAILED: 'background:#5a0000' }
  return map[s] || 'background:#444'
}

function statusLabel(s) {
  const map = { PAID: '✓ Aprobado', PENDING: 'Pendiente', REVIEW: '⏳ Por revisar', FAILED: '✗ Rechazado' }
  return map[s] || s
}

// Marcar qué compras tienen números bendecidos
function markBlessed(purchaseList, blessed) {
  const blessedSet = new Set(blessed.map(b => b.number))
  return purchaseList.map(p => {
    // Verificamos si algún ticket de esta compra es bendecido
    // Como no tenemos los números individuales aquí, usamos una bandera del backend si existe
    return { ...p, hasBlessed: p.hasBlessedNumber || false }
  })
}

async function approve(purchase) {
  if (!confirm(`¿Aprobar la compra de ${purchase.buyerName}? Se enviarán los números a ${purchase.buyerEmail}`)) return
  try {
    await purchasesApi.approve(raffleId, purchase.id)
    purchase.status = 'PAID'
  } catch (e) {
    alert('Error al aprobar: ' + (e.response?.data?.message || e.message))
  }
}

async function reject(purchase) {
  if (!confirm(`¿Rechazar la compra de ${purchase.buyerName}? Los números serán liberados.`)) return
  try {
    await purchasesApi.reject(raffleId, purchase.id)
    purchase.status = 'FAILED'
  } catch (e) {
    alert('Error al rechazar')
  }
}

onMounted(async () => {
  try {
    const [p, b] = await Promise.all([
      purchasesApi.getByRaffle(raffleId),
      rafflesApi.getBlessedNumbers(raffleId),
    ])
    blessedNumbers.value = b.data
    purchases.value = markBlessed(p.data, b.data)
  } finally {
    loading.value = false
  }
})
</script>
