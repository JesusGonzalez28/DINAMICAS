<template>
  <AdminLayout>
    <div class="fade-up">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h1 style="font-family: var(--font-display); font-size: 2rem; margin: 0;">RIFAS</h1>
        <router-link to="/admin/rifas/nueva" class="btn btn-primary">
          <i class="bi bi-plus-lg me-1"></i>Nueva Rifa
        </router-link>
      </div>
      <hr class="divider-rojo" />

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border" style="color: var(--rojo);"></div>
      </div>

      <div v-else class="row g-4">
        <div v-for="r in raffles" :key="r.id" class="col-md-6 col-xl-4">
          <div class="p-4 rounded-3 h-100" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h5 style="font-family: var(--font-display); font-size: 1.1rem; margin:0;">{{ r.title }}</h5>
              <span class="badge" :style="statusStyle(r.status)">{{ r.status }}</span>
            </div>
            <div style="color: var(--rojo); font-family: var(--font-display); font-size: 1.3rem; margin-bottom: 8px;">{{ r.prize }}</div>
            <div style="font-size: 0.8rem; color: var(--gris-light); margin-bottom: 16px;">
              Sorteo: {{ formatDate(r.drawDate) }}
            </div>

            <!-- Cambiar estado -->
            <div class="d-flex gap-2 mb-3">
              <select @change="changeStatus(r.id, $event.target.value)"
                      class="form-select form-select-sm"
                      style="background: var(--gris-dark); border-color: var(--gris); color: white; font-size: 0.8rem;">
                <option value="">Cambiar estado...</option>
                <option value="OPEN">OPEN</option>
                <option value="CLOSED">CLOSED</option>
                <option value="DRAWN">DRAWN</option>
              </select>
            </div>

            <router-link :to="`/admin/rifas/${r.id}/compras`" class="btn btn-outline-light btn-sm w-100">
              <i class="bi bi-people me-1"></i>Ver compras
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { rafflesApi } from '@/services/api'

const raffles = ref([])
const loading = ref(true)

function statusStyle(s) {
  const map = { OPEN: 'background:#CC0000', CLOSED: 'background:#444', DRAWN: 'background:#1a6b1a' }
  return map[s] || 'background:#444'
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

async function changeStatus(id, status) {
  if (!status) return
  try {
    await rafflesApi.updateStatus(id, status)
    const r = raffles.value.find(x => x.id === id)
    if (r) r.status = status
  } catch (e) {
    alert('Error al cambiar el estado')
  }
}

onMounted(async () => {
  try {
    const { data } = await rafflesApi.getAll()
    raffles.value = data
  } finally {
    loading.value = false
  }
})
</script>
