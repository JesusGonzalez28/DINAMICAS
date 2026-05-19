<template>
  <div class="admin-layout d-flex" style="min-height: 100vh; background: var(--negro);">
    <!-- Sidebar -->
    <aside class="sidebar d-flex flex-column" style="width:240px; min-height:100vh; background: var(--negro-soft); border-right: 2px solid var(--gris-dark); flex-shrink:0;">
      <!-- Logo -->
      <div class="p-4 border-bottom" style="border-color: var(--rojo) !important;">
        <div style="font-family: var(--font-display); font-size: 1.3rem; letter-spacing: 0.08em;">
          <i class="bi bi-trophy-fill me-2" style="color: var(--rojo);"></i>DINÁMICAS
        </div>
        <div style="font-size: 0.6rem; letter-spacing: 0.2em; color: var(--gris-light);">PANEL ADMIN</div>
      </div>

      <!-- Nav -->
      <nav class="flex-grow-1 p-3">
        <ul class="list-unstyled d-flex flex-column gap-1">
          <li>
            <router-link to="/admin" class="sidebar-link" exact-active-class="active">
              <i class="bi bi-speedometer2"></i> Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/admin/rifas" class="sidebar-link" active-class="active">
              <i class="bi bi-ticket-perforated"></i> Rifas
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- User -->
      <div class="p-3 border-top" style="border-color: var(--gris-dark) !important;">
        <div class="d-flex align-items-center gap-2 mb-3">
          <div class="rounded-circle d-flex align-items-center justify-content-center"
               style="width:36px; height:36px; background: var(--rojo); font-weight:700; font-size:0.85rem;">
            {{ userInitial }}
          </div>
          <div>
            <div style="font-size:0.8rem; font-weight:600;">{{ user?.name }}</div>
            <div style="font-size:0.7rem; color: var(--gris-light);">{{ user?.role }}</div>
          </div>
        </div>
        <button @click="logout" class="btn btn-outline-danger btn-sm w-100">
          <i class="bi bi-box-arrow-right me-1"></i> Salir
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-grow-1 p-4" style="overflow-y: auto;">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const user = computed(() => auth.user)
const userInitial = computed(() => auth.user?.name?.charAt(0).toUpperCase() || 'A')

function logout() {
  auth.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  color: var(--gris-light);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}
.sidebar-link:hover, .sidebar-link.active {
  background: rgba(204,0,0,0.15);
  color: var(--blanco);
}
.sidebar-link.active {
  border-left: 3px solid var(--rojo);
  padding-left: 11px;
}
</style>
