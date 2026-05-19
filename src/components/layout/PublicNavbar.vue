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

      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navMenu">
        <ul class="navbar-nav ms-auto align-items-center gap-2">
          <li class="nav-item">
            <router-link class="nav-link fw-500" to="/">Rifas</router-link>
          </li>
          <li class="nav-item">
            <router-link class="btn btn-primary btn-sm px-3" to="/admin/login">
              <i class="bi bi-shield-lock me-1"></i> Admin
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
</script>
