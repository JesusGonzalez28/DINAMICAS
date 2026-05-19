<template>
  <div class="raffle-card h-100" style="background: var(--negro-soft); border: 1px solid var(--gris-dark); border-radius: var(--radius); overflow: hidden; transition: all 0.3s;">
    <!-- Header rojo -->
    <div style="background: var(--rojo); padding: 20px; position: relative;">
      <div class="d-flex justify-content-between align-items-start">
        <span style="font-size: 0.7rem; letter-spacing: 0.15em; opacity: 0.85; text-transform: uppercase;">Premio</span>
        <span class="badge" style="background: rgba(0,0,0,0.3); font-size: 0.7rem;">{{ statusLabel }}</span>
      </div>
      <div style="font-family: var(--font-display); font-size: 1.8rem; line-height: 1.1; margin-top: 4px;">
        {{ raffle.prize }}
      </div>
    </div>

    <!-- Body -->
    <div class="p-4">
      <h5 style="font-family: var(--font-display); font-size: 1.2rem; letter-spacing: 0.05em;">
        {{ raffle.title }}
      </h5>
      <p v-if="raffle.description" style="font-size: 0.85rem; color: var(--gris-light); margin-top: 6px;">
        {{ raffle.description }}
      </p>

      <hr class="divider-rojo" />

      <div class="row g-2 mb-4">
        <div class="col-6">
          <div style="font-size: 0.7rem; color: var(--gris-light); text-transform: uppercase; letter-spacing: 0.1em;">Precio</div>
          <div style="font-family: var(--font-display); font-size: 1.3rem; color: var(--rojo);">
            ${{ Number(raffle.pricePerNumber).toLocaleString('es-CO') }}
          </div>
        </div>
        <div class="col-6">
          <div style="font-size: 0.7rem; color: var(--gris-light); text-transform: uppercase; letter-spacing: 0.1em;">Sorteo</div>
          <div style="font-size: 0.9rem; font-weight: 600;">{{ formatDate(raffle.drawDate) }}</div>
        </div>
      </div>

      <router-link :to="`/rifas/${raffle.id}`" class="btn btn-primary w-100">
        <i class="bi bi-ticket-perforated me-2"></i>Ver y Participar
      </router-link>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ raffle: Object })

const statusLabel = { OPEN: 'ABIERTA', CLOSED: 'CERRADA', DRAWN: 'SORTEADA' }[props.raffle.status]

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.raffle-card:hover {
  border-color: var(--rojo) !important;
  transform: translateY(-4px);
  box-shadow: var(--shadow-rojo);
}
</style>
