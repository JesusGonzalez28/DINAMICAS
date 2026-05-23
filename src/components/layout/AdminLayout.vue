<template>
  <div class="admin-layout d-flex" style="min-height: 100vh; background: var(--negro);">
    <!-- Sidebar -->
    <aside class="sidebar d-flex flex-column"
           :style="collapsed ? 'width:64px;' : 'width:240px;'"
           style="min-height:100vh; background: var(--negro-soft); border-right: 2px solid var(--gris-dark); flex-shrink:0; transition: width 0.25s ease; overflow:hidden;">

      <!-- Logo -->
      <div class="p-3 border-bottom d-flex align-items-center justify-content-between" style="border-color: var(--rojo) !important; min-height:72px;">
        <div v-if="!collapsed" style="font-family: var(--font-display); font-size: 1.1rem; letter-spacing: 0.08em; white-space:nowrap; overflow:hidden;">
          <i class="bi bi-trophy-fill me-2" style="color: var(--rojo);"></i>DINÁMICAS
          <div style="font-size: 0.6rem; letter-spacing: 0.2em; color: var(--gris-light);">PANEL ADMIN</div>
        </div>
        <div v-else style="font-family: var(--font-display); font-size: 1.1rem; color: var(--rojo);">
          <i class="bi bi-trophy-fill"></i>
        </div>
        <button @click="collapsed = !collapsed"
                style="background:none; border:none; color:var(--gris-light); font-size:1.2rem; cursor:pointer; padding:4px; flex-shrink:0;"
                :title="collapsed ? 'Expandir menú' : 'Colapsar menú'">
          <i :class="collapsed ? 'bi bi-chevron-right' : 'bi bi-chevron-left'"></i>
        </button>
      </div>

      <!-- Nav -->
      <nav class="flex-grow-1 p-2">
        <ul class="list-unstyled d-flex flex-column gap-1">
          <li>
            <router-link to="/admin" class="sidebar-link" exact-active-class="active" :title="collapsed ? 'Dashboard' : ''">
              <i class="bi bi-speedometer2" style="flex-shrink:0; font-size:1.1rem;"></i>
              <span v-if="!collapsed">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/rifas" class="sidebar-link" active-class="active" :title="collapsed ? 'Rifas' : ''">
              <i class="bi bi-ticket-perforated" style="flex-shrink:0; font-size:1.1rem;"></i>
              <span v-if="!collapsed">Rifas</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- User -->
      <div class="p-2 border-top" style="border-color: var(--gris-dark) !important;">
        <div v-if="!collapsed" class="d-flex align-items-center gap-2 mb-2">
          <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
               style="width:36px; height:36px; background: var(--rojo); font-weight:700; font-size:0.85rem;">
            {{ userInitial }}
          </div>
          <div style="overflow:hidden;">
            <div style="font-size:0.8rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{{ user?.name }}</div>
            <div style="font-size:0.7rem; color: var(--gris-light);">{{ user?.role }}</div>
          </div>
        </div>
        <div v-else class="text-center mb-2">
          <div class="rounded-circle d-inline-flex align-items-center justify-content-center"
               style="width:36px; height:36px; background: var(--rojo); font-weight:700; font-size:0.85rem;">
            {{ userInitial }}
          </div>
        </div>
        <button @click="logout" class="btn btn-outline-danger btn-sm w-100" :title="collapsed ? 'Salir' : ''">
          <i class="bi bi-box-arrow-right"></i>
          <span v-if="!collapsed" class="ms-1">Salir</span>
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const collapsed = ref(false)

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
  padding: 10px 12px;
  border-radius: 8px;
  color: var(--gris-light);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
}
.sidebar-link:hover, .sidebar-link.active {
  background: rgba(204,0,0,0.15);
  color: var(--blanco);
}
.sidebar-link.active {
  border-left: 3px solid var(--rojo);
  padding-left: 9px;
}
</style>