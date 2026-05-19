import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// ── Vistas públicas ────────────────────────────────────────────
import HomeView from '@/views/public/HomeView.vue'
import RaffleDetailView from '@/views/public/RaffleDetailView.vue'
import PurchaseView from '@/views/public/PurchaseView.vue'

// ── Vistas admin ───────────────────────────────────────────────
import AdminLogin from '@/views/admin/AdminLogin.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminRaffles from '@/views/admin/AdminRaffles.vue'
import AdminRaffleCreate from '@/views/admin/AdminRaffleCreate.vue'
import AdminPurchases from '@/views/admin/AdminPurchases.vue'

const routes = [
  // Públicas
  { path: '/', name: 'home', component: HomeView },
  { path: '/rifas/:id', name: 'raffle-detail', component: RaffleDetailView },
  { path: '/rifas/:id/comprar', name: 'purchase', component: PurchaseView },

  // Admin
  { path: '/admin/login', name: 'admin-login', component: AdminLogin },
  {
    path: '/admin',
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'admin-dashboard', component: AdminDashboard },
      { path: 'rifas', name: 'admin-raffles', component: AdminRaffles },
      { path: 'rifas/nueva', name: 'admin-raffle-create', component: AdminRaffleCreate },
      { path: 'rifas/:id/compras', name: 'admin-purchases', component: AdminPurchases },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// Guard de autenticación
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'admin-login' }
  }
  if (to.name === 'admin-login' && auth.isLoggedIn) {
    return { name: 'admin-dashboard' }
  }
})

export default router
