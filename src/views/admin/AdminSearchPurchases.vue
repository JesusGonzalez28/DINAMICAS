<template>
  <AdminLayout>
    <div class="fade-up">
      <router-link to="/admin/compras" style="color: var(--gris-light); text-decoration:none; font-size:0.9rem;" class="d-inline-block mb-4">
        <i class="bi bi-arrow-left me-1"></i>Volver a compras
      </router-link>

      <h1 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 4px;">BUSCAR COMPRAS DE CLIENTE</h1>
      <p style="color: var(--gris-light); margin-bottom: 20px;">Busca las compras de un cliente por teléfono o correo</p>
      <hr class="divider-rojo" />

      <!-- Search Form -->
      <div class="p-4 rounded-3 mb-4" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
        <div class="mb-3">
          <label class="form-label" style="font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Teléfono o Correo electrónico</label>
          <input v-model="searchQuery" 
                 type="text" 
                 class="form-control"
                 @keyup.enter="search"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white;" 
                 placeholder="Ej: +573001234567 o cliente@email.com" />
        </div>

        <div v-if="error" class="alert mb-3" style="background: rgba(204,0,0,0.15); border: 1px solid var(--rojo); color: var(--blanco);">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
        </div>

        <button @click="search" :disabled="loading || !searchQuery.trim()" class="btn btn-primary btn-lg w-100">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-search me-2"></i>
          {{ loading ? 'Buscando...' : 'Buscar compras' }}
        </button>
      </div>

      <!-- No results -->
      <div v-if="searched && !loading && results.length === 0" class="text-center py-5">
        <i class="bi bi-inbox" style="font-size: 3rem; color: var(--gris-light);"></i>
        <p style="color: var(--gris-light); margin-top: 16px;">No se encontraron compras</p>
      </div>

      <!-- Results -->
      <div v-else-if="results.length > 0" class="fade-up">
        <!-- Client Info Header -->
        <div class="p-4 rounded-3 mb-4" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
          <div style="font-size: 0.75rem; color: var(--gris-light); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Cliente</div>
          <div style="font-weight: 600; font-size: 1.2rem; margin-bottom: 4px;">{{ clientInfo.name }}</div>
          <div style="font-size: 0.85rem; color: var(--gris-light);">
            <div><i class="bi bi-envelope me-2"></i>{{ clientInfo.email }}</div>
            <div><i class="bi bi-telephone me-2"></i>{{ clientInfo.phone }}</div>
            <div v-if="clientInfo.city"><i class="bi bi-geo-alt me-2"></i>{{ clientInfo.city }}</div>
          </div>
        </div>

        <!-- Summary stats -->
        <div class="row g-3 mb-4">
          <div class="col-sm-3">
            <div class="p-3 rounded-3 text-center" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
              <div style="font-family: var(--font-display); font-size: 1.8rem;">{{ results.length }}</div>
              <div style="font-size: 0.75rem; color: var(--gris-light);">Compras</div>
            </div>
          </div>
          <div class="col-sm-3">
            <div class="p-3 rounded-3 text-center" style="background: var(--negro-soft); border: 1px solid #1a6b1a;">
              <div style="font-family: var(--font-display); font-size: 1.8rem; color: #4caf50;">{{ totalNumbers }}</div>
              <div style="font-size: 0.75rem; color: var(--gris-light);">Números</div>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="p-3 rounded-3 text-center" style="background: var(--negro-soft); border: 1px solid var(--rojo);">
              <div style="font-family: var(--font-display); font-size: 1.8rem; color: var(--rojo);">${{ totalSpent.toLocaleString('es-CO') }}</div>
              <div style="font-size: 0.75rem; color: var(--gris-light);">Invertido</div>
            </div>
          </div>
        </div>

        <!-- Purchases table -->
        <div class="table-responsive">
          <table class="table" style="color: var(--blanco); font-size: 0.85rem;">
            <thead style="border-bottom: 2px solid var(--rojo);">
              <tr style="color: var(--gris-light); text-transform: uppercase; letter-spacing: 0.05em; font-size: 0.75rem;">
                <th>Rifa</th><th>Números</th><th>Total</th><th>Estado</th><th>Comprobante</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="purchase in results" :key="purchase.id"
                  :style="purchase.hasBlessedNumber ? 'border-bottom:1px solid rgba(255,215,0,0.2); background:rgba(255,215,0,0.02);' : 'border-bottom:1px solid var(--gris-dark);'">
                <td>
                  <div style="font-weight:600;">{{ purchase.raffleName }}</div>
                  <div style="font-size:0.75rem; color:var(--gris-light);">{{ formatDate(purchase.createdAt) }}</div>
                </td>
                <td>
                  <span style="font-family:var(--font-display); color:var(--rojo); font-size:1.2rem;">{{ purchase.quantity }}</span>
                  <div v-if="purchase.hasBlessedNumber" style="font-size:0.7rem; color:#FFD700;">⭐ incluye bendecido</div>
                </td>
                <td style="font-weight:600;">${{ Number(purchase.totalAmount).toLocaleString('es-CO') }}</td>
                <td><span class="badge" :style="statusStyle(purchase.status)">{{ statusLabel(purchase.status) }}</span></td>
                <td>
                  <a v-if="purchase.voucherPath" :href="`http://localhost:3000/${purchase.voucherPath}`" target="_blank" class="btn btn-sm btn-outline-light">
                    <i class="bi bi-image me-1"></i>Ver
                  </a>
                  <span v-else style="color:var(--gris); font-size:0.75rem;">—</span>
                </td>
                <td>
                  <div class="d-flex flex-column gap-1">
                    <button v-if="purchase.status === 'REVIEW'" @click="approve(purchase)" class="btn btn-sm" style="background:#1a6b1a; color:white; font-size:0.75rem;">
                      <i class="bi bi-check-lg me-1"></i>Aprobar
                    </button>
                    <button v-if="purchase.status === 'REVIEW' || purchase.status === 'PENDING'" @click="reject(purchase)" class="btn btn-sm btn-outline-danger" style="font-size:0.75rem;">
                      <i class="bi bi-x-lg me-1"></i>Rechazar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { purchasesApi } from '@/services/api'

const searchQuery = ref('')
const loading = ref(false)
const searched = ref(false)
const error = ref('')
const results = ref([])

const clientInfo = computed(() => {
  if (results.value.length === 0) {
    return { name: '', email: '', phone: '', city: '' }
  }
  const first = results.value[0]
  return {
    name: first.buyerName,
    email: first.buyerEmail,
    phone: first.buyerPhone,
    city: first.buyerCity
  }
})

const totalNumbers = computed(() => {
  return results.value.reduce((sum, p) => sum + (p.quantity || 0), 0)
})

const totalSpent = computed(() => {
  return results.value.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0)
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
    error.value = err.response?.data?.message || 'Error al buscar las compras. Intenta nuevamente.'
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
    PENDING: 'Pendiente',
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

const approve = async (purchase) => {
  if (!confirm('¿Aprobar esta compra?')) return
  
  try {
    await purchasesApi.approve(purchase.raffleId, purchase.id)
    purchase.status = 'APPROVED'
    alert('Compra aprobada')
  } catch (err) {
    alert('Error al aprobar: ' + (err.response?.data?.message || err.message))
  }
}

const reject = async (purchase) => {
  if (!confirm('¿Rechazar esta compra?')) return
  
  try {
    await purchasesApi.reject(purchase.raffleId, purchase.id)
    purchase.status = 'REJECTED'
    alert('Compra rechazada')
  } catch (err) {
    alert('Error al rechazar: ' + (err.response?.data?.message || err.message))
  }
}
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
