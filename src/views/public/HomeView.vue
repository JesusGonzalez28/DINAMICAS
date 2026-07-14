<template>
  <div style="min-height: 100vh; background: var(--negro);">
    <PublicNavbar />

    <div v-if="loading" class="text-center py-5 mt-5">
      <div class="spinner-border" style="color: var(--rojo); width: 3rem; height: 3rem;"></div>
    </div>

    <div v-else-if="!raffle" class="text-center py-5 mt-5">
      <i class="bi bi-ticket-perforated" style="font-size: 5rem; color: var(--gris-dark);"></i>
      <h2 class="mt-3" style="color: var(--gris-light);">No hay rifas activas</h2>
    </div>

    <div v-else>
      <!-- HERO -->
      <section class="position-relative" style="min-height: 60vh; display:flex; align-items:center; overflow:hidden;">
        <div class="position-absolute top-0 start-0 w-100 h-100"
             :style="raffle.prizeImage
               ? `background:url('${fileUrl(raffle.prizeImage)}') center/cover no-repeat; filter:brightness(0.3);`
               : 'background: radial-gradient(ellipse at center, rgba(204,0,0,0.2) 0%, transparent 70%);'"></div>
        <div class="position-absolute top-0 start-0 w-100 h-100"
             style="background:linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, rgba(10,10,10,1) 100%);"></div>

        <div class="container position-relative py-5">
          <div class="row align-items-center g-4">
            <div v-if="raffle.prizeImage" class="col-lg-5 text-center fade-up">
              <div style="border-radius:20px; overflow:hidden; border:3px solid var(--rojo); box-shadow:var(--shadow-rojo);">
                <img :src="fileUrl(raffle.prizeImage)" :alt="raffle.prize"
                     style="width:100%; max-height:380px; object-fit:cover;" />
              </div>
            </div>
            <div :class="raffle.prizeImage ? 'col-lg-7' : 'col-12 text-center'">
              <div class="badge-rojo mb-3 d-inline-block">🎰 RIFA ACTIVA</div>
              <h1 style="font-size:clamp(2.5rem,7vw,5rem); line-height:0.95;">{{ raffle.title }}</h1>
              <div style="font-size:clamp(1.3rem,3vw,2rem); color:var(--rojo); font-family:var(--font-display); margin-top:8px;">
                PREMIO: {{ raffle.prize }}
              </div>
              <p v-if="raffle.description" class="mt-3" style="color:var(--gris-light); max-width:520px;">{{ raffle.description }}</p>

              <div class="d-flex flex-wrap gap-3 mt-4">
                <div class="p-3 rounded-3" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);">
                  <div style="font-size:0.7rem; color:var(--gris-light); text-transform:uppercase;">Por número</div>
                  <div style="font-family:var(--font-display); font-size:1.8rem; color:var(--rojo);">
                    ${{ Number(raffle.pricePerNumber).toLocaleString('es-CO') }}
                  </div>
                </div>
                <div v-if="raffle.blessedCount > 0" class="p-3 rounded-3"
                     style="background:rgba(255,215,0,0.08); border:1px solid rgba(255,215,0,0.3);">
                  <div style="font-size:0.7rem; color:#FFD700; text-transform:uppercase;">Números bendecidos</div>
                  <div style="font-family:var(--font-display); font-size:1.5rem; color:#FFD700;">⭐ {{ raffle.blessedCount }}</div>
                </div>
              </div>

              <div v-if="stats" class="mt-4" style="max-width:480px;">
                <div class="d-flex justify-content-between mb-1">
                  <span style="font-size:0.8rem; color:var(--gris-light);">{{ stats.sold }} vendidos de {{ stats.totalNumbers }}</span>
                  <span style="font-size:0.8rem; color:var(--rojo); font-weight:700;">{{ stats.percentageSold }}%</span>
                </div>
                <div class="progress" style="height:10px; background:var(--gris-dark); border-radius:5px;">
                  <div class="progress-bar" :style="`width:${stats.percentageSold}%; background:var(--rojo);`"></div>
                </div>
              </div>

              <a href="#comprar" class="btn btn-primary btn-lg px-5 mt-4">
                <i class="bi bi-ticket-perforated me-2"></i>¡PARTICIPAR AHORA!
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- NÚMEROS BENDECIDOS -->
      <section v-if="raffle.blessedCount > 0" style="padding:40px 0; background:var(--negro-soft); border-top:1px solid var(--gris-dark);">
        <div class="container">
          <div class="text-center mb-3">
            <h2 style="font-family:var(--font-display); font-size:1.8rem; color:#FFD700;">⭐ NÚMEROS BENDECIDOS</h2>
            <p style="color:var(--gris-light); font-size:0.85rem;">
              Premio adicional de <strong style="color:#FFD700;">${{ Number(raffle.blessedPrize).toLocaleString('es-CO') }} COP</strong> por número
            </p>
          </div>
          <div class="d-flex flex-wrap justify-content-center" style="gap: 10px 12px;">
            <span v-for="b in blessedNumbers" :key="b.number">
              <span v-if="!b.taken" class="blessed-number rounded" style="display:inline-block; padding:8px 16px; font-family:monospace; font-size:1rem; font-weight:800; letter-spacing:0.05em; background:linear-gradient(135deg,#FFD700,#FFA500); color:#000; box-shadow:0 2px 8px rgba(255,215,0,0.3);">
                ⭐ {{ b.number }}
              </span>
              <span v-else style="display:inline-block; background:#1a1a1a; color:#333; padding:8px 12px; border-radius:6px; font-family:monospace; font-size:0.9rem; text-decoration:line-through;">
                {{ b.number }}
              </span>
            </span>
          </div>
        </div>
      </section>

      <!-- FORMULARIO DE COMPRA -->
      <section id="comprar" style="padding:48px 0;">
        <div class="container">
          <div class="row g-4">

            <!-- COLUMNA IZQUIERDA -->
            <div class="col-lg-5">
              <div class="step-header mb-3">
                <span class="step-num">1</span>
                <span class="step-title">SELECCIONA TU PAQUETE</span>
              </div>

              <div class="row g-2 mb-4">
                <div v-for="pkg in computedPackages" :key="pkg.quantity" class="col-6">
                  <div @click="selectPackage(pkg.quantity)"
                       class="pkg-box p-3 rounded-3 text-center"
                       :class="{ 'pkg-selected': form.quantity === pkg.quantity }">
                    <div style="font-size:0.65rem; color:var(--gris-light); text-transform:uppercase; letter-spacing:0.1em;">
                      {{ pkg.quantity }} TICKETS
                    </div>
                    <div class="d-flex align-items-end justify-content-center gap-1 my-1">
                      <span style="font-family:var(--font-display); font-size:2.5rem; line-height:1; opacity:0.15; color:white;">{{ pkg.quantity }}</span>
                    </div>
                    <div style="font-weight:700; font-size:1rem; margin-top:4px;">
                      ${{ pkg.total.toLocaleString('es-CO') }}
                    </div>
                    <div style="font-size:0.7rem; color:var(--gris-light);">{{ pkg.label }}</div>
                  </div>
                </div>
              </div>

              <!-- Cantidad personalizada -->
              <div class="p-3 rounded-3 mb-3" style="background:var(--negro-soft); border:1px solid var(--gris-dark);">
                <div style="font-size:0.8rem; color:var(--gris-light); margin-bottom:10px;">¿QUIERES UNA CANTIDAD DIFERENTE?</div>
                <div class="d-flex align-items-center gap-2">
                  <button @click="form.quantity = Math.max(minQuantity, form.quantity - 1)" class="qty-btn">−</button>
                  <input v-model.number="form.quantity" type="number" :min="minQuantity" step="1" class="form-control text-center"
                         style="background:var(--gris-dark); border-color:var(--gris); color:white; font-weight:700; font-size:1.1rem; width:80px;" />
                  <button @click="form.quantity += 1" class="qty-btn">+</button>
                  <span style="font-size:0.75rem; color:var(--rojo);">Mínimo {{ minQuantity }} por paquete</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-3 pt-3" style="border-top:1px solid var(--gris-dark);">
                  <span style="font-size:0.8rem; color:var(--gris-light);">TOTAL A INVERTIR</span>
                  <span style="font-family:var(--font-display); font-size:1.8rem; color:var(--rojo);">
                    ${{ totalFormatted }}
                  </span>
                </div>
              </div>
            </div>

            <!-- COLUMNA DERECHA -->
            <div class="col-lg-7">
              <div class="p-4 rounded-3" style="background:rgba(255,255,255,0.03); border:1px solid var(--gris-dark);">

                <div class="step-header mb-3">
                  <span class="step-num">2</span>
                  <span class="step-title">DATOS DEL COMPRADOR</span>
                </div>

                <div class="mb-3">
                  <label class="form-label-sm">Correo electrónico *</label>
                  <div class="position-relative">
                    <input v-model="form.buyerEmail" type="email" class="form-control form-dark"
                           placeholder="ejemplo@gmail.com · ejemplo@hotmail.com"
                           @blur="autofillBuyer" />
                    <span v-if="lookingUpBuyer" class="position-absolute" style="right: 12px; top: 50%; transform: translateY(-50%);">
                      <span class="spinner-border spinner-border-sm" style="color: var(--gris-light);"></span>
                    </span>
                  </div>
                  <div v-if="autofillMsg" class="mt-1" style="font-size: 0.75rem; color: #4CAF50;">
                    <i class="bi bi-check-circle me-1"></i>{{ autofillMsg }}
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label-sm">Nombre completo *</label>
                  <input v-model="form.buyerName" type="text" class="form-control form-dark" placeholder="Escriba su nombre aquí" />
                </div>
                <div class="row g-2 mb-4">
                  <div class="col-6">
                    <label class="form-label-sm">Teléfono / WhatsApp *</label>
                    <input v-model="form.buyerPhone" type="tel" class="form-control form-dark" placeholder="300 000 0000" />
                  </div>
                  <div class="col-6">
                    <label class="form-label-sm">Ciudad *</label>
                    <input v-model="form.buyerCity" type="text" class="form-control form-dark" placeholder="Medellín" />
                  </div>
                </div>

                <div class="step-header mb-3">
                  <span class="step-num">3</span>
                  <span class="step-title">MÉTODO DE PAGO</span>
                </div>

                <div class="mb-3">
                  <div class="p-3 rounded-3 d-flex align-items-center gap-3"
                       style="background:rgba(204,0,0,0.1); border:2px solid var(--rojo);">
                    <i class="bi bi-phone-fill" style="font-size:1.5rem; color:var(--rojo);"></i>
                    <div>
                      <div style="font-weight:700; font-size:1rem;">Nequi</div>
                      <div style="font-size:0.75rem; color:var(--gris-light);">Seleccionado</div>
                    </div>
                  </div>
                </div>

                <div class="p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center"
                     style="background:rgba(0,200,0,0.08); border:1px solid rgba(0,200,0,0.2);">
                  <div style="font-size:0.85rem; color:var(--gris-light);">
                    <i class="bi bi-info-circle me-1"></i>TOTAL A TRANSFERIR A NEQUI
                  </div>
                  <div style="font-family:var(--font-display); font-size:1.8rem; color:#4caf50;">
                    ${{ totalFormatted }}
                  </div>
                </div>

                <div class="p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center"
                     style="background:var(--negro-soft); border:1px solid var(--gris-dark); border-radius:12px;">
                  <div>
                    <div style="font-size:0.7rem; color:var(--gris-light); margin-bottom:2px;">
                      <i class="bi bi-arrow-right-circle me-1" style="color:var(--rojo);"></i>CUENTA DE AHORRO BANCOLOMBIA
                    </div>
                    <div style="font-family:var(--font-display); font-size:1.4rem; letter-spacing:0.03em; color:white;">
                      {{ bancolombiaAccount }}
                    </div>
                  </div>
                  <button @click="copyBancolombia" class="btn" style="background:rgba(255,255,255,0.05); color:white; font-size:1.3rem; padding:8px 12px; border-radius:10px;">
                    <i class="bi bi-copy"></i>
                  </button>
                </div>
                <div v-if="copiedBancolombia" class="text-center mb-2" style="color:#4caf50; font-size:0.8rem;">
                  ✓ Número de cuenta copiado
                </div>

                <div class="p-3 rounded-3 mb-3 d-flex justify-content-between align-items-center"
                     style="background:#0a0a1a; border:2px solid #3a3a6a; border-radius:12px;">
                  <div>
                    <div style="font-size:0.7rem; color:var(--gris-light); margin-bottom:2px;">NÚMERO DE CUENTA</div>
                    <div style="font-family:var(--font-display); font-size:1.8rem; letter-spacing:0.05em; color:white;">
                      {{ nequiNumber }}
                    </div>
                    <div style="font-size:0.7rem; color:var(--gris-light);">
                      <i class="bi bi-hand-index me-1" style="color:var(--rojo);"></i>Haz clic en el icono para copiar al portapapeles
                    </div>
                  </div>
                  <button @click="copyNumber" class="btn" style="background:rgba(255,255,255,0.05); color:white; font-size:1.5rem; padding:10px 14px; border-radius:10px;">
                    <i class="bi bi-copy"></i>
                  </button>
                </div>
                <div v-if="copied" class="text-center mb-2" style="color:#4caf50; font-size:0.8rem;">
                  ✓ Número copiado
                </div>

                <div class="text-center mb-4">
                  <div style="font-size:0.75rem; color:var(--gris-light); margin-bottom:8px;">
                    <i class="bi bi-qr-code me-1" style="color:var(--rojo);"></i>Código QR Bre-B
                  </div>
                  <div @click="showQR = true" class="qr-thumb d-inline-block position-relative" style="cursor:zoom-in;">
                    <div style="background:white; padding:10px; border-radius:12px; display:inline-block; border:2px solid var(--gris-dark);">
                      <img src="@/assets/qr-nequi.jpeg" alt="QR Nequi" style="width:120px; height:120px;" />
                    </div>
                    <div class="qr-overlay">
                      <i class="bi bi-zoom-in" style="font-size:1.5rem; color:white;"></i>
                    </div>
                  </div>
                  <div style="font-size:0.7rem; color:var(--gris-light); margin-top:4px;">Haz clic para ampliar</div>
                </div>

                <div style="font-size:0.85rem; font-weight:600; margin-bottom:8px; color:var(--gris-light);">
                  4. COMPROBANTE DE PAGO
                </div>

                <div v-if="!purchaseId">
                  <div v-if="error" class="alert mb-3"
                       style="background:rgba(204,0,0,0.15); border:1px solid var(--rojo); color:white; font-size:0.85rem;">
                    <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
                  </div>
                  <button @click="reservar" :disabled="reserving || !isValid" class="btn btn-primary btn-lg w-100">
                    <span v-if="reserving" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-lock me-2"></i>
                    {{ reserving ? 'Reservando números...' : 'FINALIZAR COMPRA' }}
                  </button>
                  <p class="text-center mt-2" style="font-size:0.75rem; color:var(--gris-light);">
                    Al hacer clic se reservarán tus números y podrás subir el comprobante
                  </p>
                </div>

                <div v-else>
                  <div class="p-3 rounded-3 mb-3" style="background:rgba(0,200,0,0.05); border:1px solid rgba(0,200,0,0.2);">
                    <div style="font-size:0.8rem; color:#4caf50; margin-bottom:4px;">✓ Números reservados</div>
                    <div style="font-size:0.75rem; color:var(--gris-light);">
                      ID: <code style="color:var(--gris-light);">{{ purchaseId }}</code>
                    </div>
                  </div>

                  <label class="voucher-drop d-block text-center p-3 rounded-3 mb-3"
                         :class="{ active: voucherFile }"
                         style="cursor:pointer; border:2px dashed var(--gris); transition:all 0.2s;">
                    <input type="file" accept="image/*,.pdf" @change="onFileChange" style="display:none;" />
                    <div v-if="!voucherFile">
                      <i class="bi bi-upload" style="font-size:2rem; color:var(--gris-light);"></i>
                      <p style="margin:6px 0 0; color:var(--gris-light); font-size:0.85rem;">SUBE TU COMPROBANTE DE PAGO</p>
                    </div>
                    <div v-else>
                      <i class="bi bi-check-circle-fill" style="font-size:2rem; color:var(--rojo);"></i>
                      <p style="margin:6px 0 0; font-weight:600; font-size:0.85rem;">{{ voucherFile.name }}</p>
                    </div>
                  </label>

                  <div v-if="uploadError" class="alert mb-3"
                       style="background:rgba(204,0,0,0.15); border:1px solid var(--rojo); color:white; font-size:0.85rem;">
                    {{ uploadError }}
                  </div>

                  <button @click="subirComprobante" :disabled="!voucherFile || uploading" class="btn btn-primary btn-lg w-100">
                    <span v-if="uploading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-send me-2"></i>
                    {{ uploading ? 'Enviando...' : 'ENVIAR COMPROBANTE' }}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CONFIRMACIÓN FINAL -->
      <div v-if="done" class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
           style="background:rgba(0,0,0,0.85); z-index:9999;">
        <div class="text-center p-5 rounded-3" style="background:var(--negro-soft); border:2px solid var(--rojo); max-width:480px;">
          <i class="bi bi-envelope-check-fill" style="font-size:4rem; color:var(--rojo);"></i>
          <h2 style="font-family:var(--font-display); font-size:2rem; margin-top:16px;">¡COMPROBANTE ENVIADO!</h2>
          <p style="color:var(--gris-light); margin-top:8px;">
            Recibirás tus números en <strong style="color:white;">{{ form.buyerEmail }}</strong>
            cuando el administrador apruebe tu pago.
          </p>
          <button @click="done = false; resetForm()" class="btn btn-primary mt-3">Volver al inicio</button>
        </div>
      </div>

      <!-- QR MODAL -->
      <div v-if="showQR" @click="showQR = false"
           class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
           style="background:rgba(0,0,0,0.9); z-index:9999; cursor:zoom-out;">
        <div @click.stop style="background:white; padding:20px; border-radius:16px; text-align:center;">
          <img src="@/assets/qr-nequi.jpeg" alt="QR Nequi" style="width:300px; height:300px;" />
          <div style="color:#333; font-size:0.8rem; margin-top:8px;">Código QR Bre-B · Haz clic fuera para cerrar</div>
        </div>
      </div>

    </div>

    <footer class="py-4 text-center" style="background:var(--negro-soft); border-top:2px solid var(--gris-dark);">
      <div style="font-family:var(--font-display); font-size:1.1rem; color:var(--gris-light);">
        DINÁMICAS LOS HERMANOS © {{ new Date().getFullYear() }}
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
import { rafflesApi, purchasesApi } from '@/services/api'
import { fileUrl } from '@/services/files'

const raffle = ref(null)
const stats = ref(null)
const blessedNumbers = ref([])
const loading = ref(true)
const showQR = ref(false)
const copied = ref(false)
const done = ref(false)

const nequiNumber = '3126324715'
const bancolombiaAccount = ref('677-678822.78')
const copiedBancolombia = ref(false)

const defaultPackages = [
  { quantity: 25, label: 'Básico' },
  { quantity: 50, label: 'Bronce' },
  { quantity: 75, label: 'Plata' },
  { quantity: 100, label: 'Oro' },
  { quantity: 200, label: 'Diamante' },
]

const computedPackages = computed(() => {
  const price = Number(raffle.value?.pricePerNumber || 0)
  const source = (raffle.value?.packages && raffle.value.packages.length)
    ? raffle.value.packages
    : defaultPackages
  return source.map(pkg => ({
    ...pkg,
    total: pkg.quantity * price
  }))
})

const minQuantity = computed(() => {
  const list = computedPackages.value
  return list.length ? Math.min(...list.map(p => p.quantity)) : 25
})

const form = ref({ quantity: 25, buyerName: '', buyerPhone: '', buyerEmail: '', buyerCity: '' })
const reserving = ref(false)
const error = ref(null)
const purchaseId = ref(null)
const voucherFile = ref(null)
const uploading = ref(false)
const uploadError = ref(null)

const lookingUpBuyer = ref(false)
const autofillMsg = ref('')

async function autofillBuyer() {
  const email = form.value.buyerEmail.trim()
  if (!email.includes('@')) return
  lookingUpBuyer.value = true
  autofillMsg.value = ''
  try {
    const res = await purchasesApi.lookupBuyer(email)
    if (res.data.found) {
      if (!form.value.buyerName) form.value.buyerName = res.data.buyerName
      if (!form.value.buyerPhone) form.value.buyerPhone = res.data.buyerPhone
      if (!form.value.buyerCity) form.value.buyerCity = res.data.buyerCity
      autofillMsg.value = '¡Datos completados automáticamente desde tu compra anterior!'
    }
  } catch { /* silencioso */ } finally {
    lookingUpBuyer.value = false
  }
}

const totalFormatted = computed(() =>
  ((form.value.quantity || 0) * Number(raffle.value?.pricePerNumber || 0)).toLocaleString('es-CO')
)

const isValid = computed(() =>
  form.value.quantity >= minQuantity.value &&
  form.value.buyerName.trim() &&
  form.value.buyerPhone.trim() &&
  form.value.buyerEmail.includes('@') &&
  form.value.buyerCity.trim()
)

function selectPackage(qty) { form.value.quantity = qty }

function copyNumber() {
  navigator.clipboard.writeText(nequiNumber)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

function copyBancolombia() {
  navigator.clipboard.writeText(bancolombiaAccount.value)
  copiedBancolombia.value = true
  setTimeout(() => copiedBancolombia.value = false, 2000)
}

function onFileChange(e) {
  voucherFile.value = e.target.files[0] || null
  uploadError.value = null
}

function resetForm() {
  form.value = { quantity: minQuantity.value, buyerName: '', buyerPhone: '', buyerEmail: '', buyerCity: '' }
  purchaseId.value = null
  voucherFile.value = null
  error.value = null
  uploadError.value = null
  autofillMsg.value = ''
}

async function reservar() {
  error.value = null
  reserving.value = true
  try {
    const { data } = await purchasesApi.create(raffle.value.id, form.value)
    purchaseId.value = data.purchase.id
  } catch (err) {
    error.value = err.response?.data?.message || 'Ocurrió un error. Intenta de nuevo.'
  } finally {
    reserving.value = false
  }
}

async function subirComprobante() {
  if (!voucherFile.value) return
  uploading.value = true
  uploadError.value = null
  try {
    const formData = new FormData()
    formData.append('voucher', voucherFile.value)
    await purchasesApi.uploadVoucher(purchaseId.value, formData)
    done.value = true
  } catch (err) {
    uploadError.value = err.response?.data?.message || 'Error al subir el comprobante.'
  } finally {
    uploading.value = false
  }
}

onMounted(async () => {
  try {
    const { data } = await rafflesApi.getActive()
    raffle.value = data
    const [s, b] = await Promise.all([
      rafflesApi.getStats(data.id),
      rafflesApi.getBlessedNumbers(data.id),
    ])
    stats.value = s.data
    blessedNumbers.value = b.data
    form.value.quantity = minQuantity.value
  } catch {
    raffle.value = null
  } finally {
    loading.value = false
  }

  try {
    const pkg = await purchasesApi.getPackages(raffle.value?.id)
    if (pkg.data?.payment?.bancolombiaAccount) {
      bancolombiaAccount.value = pkg.data.payment.bancolombiaAccount
    }
  } catch { /* usa el valor por defecto */ }
})
</script>

<style scoped>
.step-header { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
.step-num {
  width:28px; height:28px; border-radius:50%;
  background:var(--rojo); color:white;
  display:flex; align-items:center; justify-content:center;
  font-weight:800; font-size:0.85rem; flex-shrink:0;
}
.step-title { font-family:var(--font-display); font-size:1rem; letter-spacing:0.05em; }

.pkg-box {
  background: var(--negro-soft);
  border: 1px solid var(--gris-dark);
  cursor: pointer; transition: all 0.2s;
  position: relative; overflow: hidden;
}
.pkg-box:hover { border-color: var(--rojo); }
.pkg-selected { border-color: var(--rojo) !important; background: rgba(204,0,0,0.12) !important; }

.qty-btn {
  width:36px; height:36px; border-radius:8px;
  background:var(--gris-dark); color:white; border:none;
  font-size:1.2rem; font-weight:700; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  transition: background 0.2s;
}
.qty-btn:hover { background: var(--rojo); }

.form-label-sm { font-size:0.8rem; color:var(--gris-light); margin-bottom:4px; display:block; }
.form-dark {
  background: var(--gris-dark) !important;
  border-color: var(--gris) !important;
  color: white !important;
}
.form-dark::placeholder { color: var(--gris) !important; }

.qr-thumb { position:relative; }
.qr-overlay {
  position:absolute; top:0; left:0; right:0; bottom:0;
  background:rgba(0,0,0,0.4);
  display:flex; align-items:center; justify-content:center;
  border-radius:12px; opacity:0; transition:opacity 0.2s;
}
.qr-thumb:hover .qr-overlay { opacity:1; }

.voucher-drop:hover, .voucher-drop.active { border-color: var(--rojo) !important; }
</style>