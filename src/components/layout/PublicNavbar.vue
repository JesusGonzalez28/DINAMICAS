<template>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top" style="background: var(--negro-soft); border-bottom: 2px solid var(--rojo);">
    <div class="container">
      <!-- Logo -->
      <router-link class="navbar-brand d-flex align-items-center gap-2" to="/">
        <div class="logo-icon">
          <i class="bi bi-trophy-fill" style="color: var(--rojo); font-size: 1.6rem;"></i>
        </div>
        <div>
          <div style="font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.08em; line-height: 1;">
            DINÁMICAS
          </div>
          <div style="font-size: 0.65rem; letter-spacing: 0.2em; color: var(--gris-light); text-transform: uppercase;">
            Los Hermanos
          </div>
        </div>
      </router-link>

      <div class="d-flex align-items-center gap-3">
        <router-link class="nav-link fw-500 d-none d-sm-inline" to="/">Rifas</router-link>
        <router-link class="nav-link fw-500" to="/consultar-numeros">
          <i class="bi bi-search me-1"></i><span class="d-none d-sm-inline">Consultar mis números</span><span class="d-inline d-sm-none">Mis números</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>
