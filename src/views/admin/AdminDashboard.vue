<template>
  <AdminLayout>
    <div class="fade-up">
      <h1 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 4px;">DASHBOARD</h1>
      <p style="color: var(--gris-light); font-size: 0.9rem;">Bienvenido, {{ user?.name }}</p>
      <hr class="divider-rojo" />

      <!-- Stats cards -->
      <div class="row g-4 mb-5">
        <div class="col-sm-6 col-xl-3" v-for="stat in stats" :key="stat.label">
          <div class="p-4 rounded-3" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div style="font-size: 0.75rem; color: var(--gris-light); text-transform: uppercase; letter-spacing: 0.1em;">{{ stat.label }}</div>
                <div style="font-family: var(--font-display); font-size: 2rem; margin-top: 4px;">{{ stat.value }}</div>
              </div>
              <i :class="stat.icon" style="font-size: 1.8rem; color: var(--rojo); opacity: 0.7;"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Rifas recientes -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 style="font-family: var(--font-display); font-size: 1.5rem; margin: 0;">RIFAS RECIENTES</h2>
        <router-link to="/admin/rifas/nueva" class="btn btn-primary btn-sm">
          <i class="bi bi-plus me-1"></i>Nueva Rifa
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-4">
        <div class="spinner-border" style="color: var(--rojo);"></div>
      </div>

      <div v-else class="table-responsive">
        <table class="table" style="color: var(--blanco);">
          <thead style="border-bottom: 2px solid var(--rojo);">
            <tr style="color: var(--gris-light); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em;">
              <th>Rifa</th><th>Premio</th><th>Estado</th><th>Sorteo</th><th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in raffles" :key="r.id" style="border-bottom: 1px solid var(--gris-dark);">
              <td style="font-weight: 600;">{{ r.title }}</td>
              <td style="color: var(--gris-light);">{{ r.prize }}</td>
              <td>
                <span class="badge" :style="statusStyle(r.status)">{{ r.status }}</span>
              </td>
              <td style="color: var(--gris-light); font-size: 0.85rem;">{{ formatDate(r.drawDate) }}</td>
              <td>
                <router-link :to="`/admin/rifas/${r.id}/compras`" class="btn btn-sm btn-outline-light">
                  Ver compras
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { rafflesApi } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const user = computed(() => auth.user)
const raffles = ref([])
const loading = ref(true)

const stats = computed(() => [
  { label: 'Total rifas', value: raffles.value.length, icon: 'bi bi-ticket-perforated' },
  { label: 'Rifas abiertas', value: raffles.value.filter(r => r.status === 'OPEN').length, icon: 'bi bi-unlock' },
  { label: 'Sorteadas', value: raffles.value.filter(r => r.status === 'DRAWN').length, icon: 'bi bi-trophy' },
  { label: 'Cerradas', value: raffles.value.filter(r => r.status === 'CLOSED').length, icon: 'bi bi-lock' },
])

function statusStyle(s) {
  const map = { OPEN: 'background:#CC0000', CLOSED: 'background:#444', DRAWN: 'background:#1a6b1a' }
  return map[s] || 'background:#444'
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
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
