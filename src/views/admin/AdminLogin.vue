<template>
  <div class="d-flex align-items-center justify-content-center" style="min-height: 100vh; background: var(--negro);">
    <!-- Fondo -->
    <div class="position-fixed top-0 start-0 w-100 h-100" style="background: radial-gradient(ellipse at 30% 70%, rgba(204,0,0,0.1) 0%, transparent 60%); pointer-events:none;"></div>

    <div class="position-relative" style="width: 100%; max-width: 420px; padding: 24px;">
      <!-- Logo -->
      <div class="text-center mb-5">
        <i class="bi bi-trophy-fill" style="font-size: 3rem; color: var(--rojo);"></i>
        <div style="font-family: var(--font-display); font-size: 2rem; letter-spacing: 0.08em; margin-top: 8px;">DINÁMICAS</div>
        <div style="font-size: 0.7rem; letter-spacing: 0.2em; color: var(--gris-light);">PANEL DE ADMINISTRACIÓN</div>
      </div>

      <div class="p-4 rounded-3" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
        <h2 style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 24px;">INICIAR SESIÓN</h2>

        <div class="mb-3">
          <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Correo electrónico</label>
          <input v-model="email" type="email" class="form-control"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white;"
                 placeholder="admin@rifas.com" @keyup.enter="login" />
        </div>

        <div class="mb-4">
          <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Contraseña</label>
          <input v-model="password" type="password" class="form-control"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white;"
                 placeholder="••••••••" @keyup.enter="login" />
        </div>

        <div v-if="auth.error" class="alert mb-3" style="background: rgba(204,0,0,0.15); border: 1px solid var(--rojo); color: white; font-size: 0.85rem;">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ auth.error }}
        </div>

        <button @click="login" :disabled="auth.loading" class="btn btn-primary w-100 btn-lg">
          <span v-if="auth.loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-shield-lock me-2"></i>
          {{ auth.loading ? 'Entrando...' : 'Entrar al panel' }}
        </button>
      </div>

      <div class="text-center mt-4">
        <router-link to="/" style="color: var(--gris-light); font-size: 0.85rem; text-decoration: none;">
          <i class="bi bi-arrow-left me-1"></i>Volver al sitio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')

async function login() {
  const ok = await auth.login(email.value, password.value)
  if (ok) router.push('/admin')
}
</script>
