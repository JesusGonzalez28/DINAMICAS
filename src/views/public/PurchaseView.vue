<template>
  <div style="min-height: 100vh; background: var(--negro);">
    <PublicNavbar />

    <div class="container py-5" style="max-width: 680px;">
      <router-link :to="`/rifas/${raffleId}`" style="color: var(--gris-light); text-decoration:none; font-size:0.9rem;" class="d-inline-block mb-4">
        <i class="bi bi-arrow-left me-1"></i> Volver a la rifa
      </router-link>

      <!-- PASO 1: Formulario -->
      <div v-if="step === 1">
        <h1 style="font-size: 2.5rem; margin-bottom: 4px;">COMPRAR NÚMEROS</h1>
        <p style="color: var(--gris-light);">$400 por número · Mínimo 25 números</p>
        <hr class="divider-rojo" />

        <!-- Paquetes -->
        <div class="mb-4">
          <label class="form-label" style="font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Selecciona un paquete</label>
          <div class="row g-2">
            <div v-for="pkg in packages" :key="pkg.quantity" class="col-6 col-md-4">
              <div @click="form.quantity = pkg.quantity"
                   class="pkg-card p-3 text-center rounded-3"
                   :class="{ selected: form.quantity === pkg.quantity }"
                   style="cursor: pointer; border: 2px solid var(--gris-dark); transition: all 0.2s;">
                <div style="font-family: var(--font-display); font-size: 1.8rem; color: var(--rojo);">{{ pkg.quantity }}</div>
                <div style="font-size: 0.7rem; color: var(--gris-light);">números</div>
                <div style="font-weight: 700; font-size: 0.9rem; margin-top: 4px;">${{ pkg.total.toLocaleString('es-CO') }}</div>
                <div style="font-size: 0.65rem; color: var(--gris-light);">{{ pkg.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cantidad personalizada -->
        <div class="mb-4">
          <label class="form-label" style="font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">O cantidad personalizada (mínimo 25)</label>
          <div class="input-group">
            <input v-model.number="form.quantity" type="number" min="25" class="form-control"
                   style="background: var(--gris-dark); border-color: var(--gris); color: white;" placeholder="Ej: 150" />
            <span class="input-group-text" style="background: var(--rojo); border-color: var(--rojo); color: white; font-weight: 700;">
              ${{ totalFormatted }}
            </span>
          </div>
        </div>

        <hr class="divider-rojo" />
        <h5 style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 16px;">TUS DATOS</h5>

        <div class="mb-3">
          <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Correo electrónico * <small>(aquí recibirás tus números)</small></label>
          <div class="position-relative">
            <input v-model="form.buyerEmail" type="email" class="form-control"
                   style="background: var(--gris-dark); border-color: var(--gris); color: white;" placeholder="juan@email.com"
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
          <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Nombre completo *</label>
          <input v-model="form.buyerName" type="text" class="form-control"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white;" placeholder="Juan Pérez" />
        </div>
        <div class="mb-3">
          <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Teléfono / WhatsApp *</label>
          <input v-model="form.buyerPhone" type="tel" class="form-control"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white;" placeholder="+573001234567" />
        </div>
        <div class="mb-4">
          <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Ciudad *</label>
          <input v-model="form.buyerCity" type="text" class="form-control"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white;" placeholder="Bogotá" />
        </div>

        <div v-if="error" class="alert mb-3" style="background: rgba(204,0,0,0.15); border: 1px solid var(--rojo); color: var(--blanco);">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
        </div>

        <!-- Resumen -->
        <div class="p-3 rounded-3 mb-4" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
          <div class="d-flex justify-content-between">
            <span style="color: var(--gris-light);">{{ form.quantity || 0 }} números × $400</span>
            <span style="font-family: var(--font-display); font-size: 1.3rem; color: var(--rojo);">${{ totalFormatted }}</span>
          </div>
        </div>

        <button @click="reservar" :disabled="loading || !isValid" class="btn btn-primary btn-lg w-100">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-arrow-right-circle me-2"></i>
          {{ loading ? 'Reservando...' : 'Reservar y ver instrucciones de pago' }}
        </button>
      </div>

      <!-- PASO 2: Instrucciones de pago + subir comprobante -->
      <div v-if="step === 2" class="fade-up">
        <div class="text-center mb-4">
          <i class="bi bi-check-circle-fill" style="font-size: 3rem; color: var(--rojo);"></i>
          <h2 style="font-family: var(--font-display); font-size: 2rem; margin-top: 12px;">¡NÚMEROS RESERVADOS!</h2>
          <p style="color: var(--gris-light);">Tienes <strong style="color:white;">{{ purchase.quantity }}</strong> números reservados por <strong style="color: var(--rojo);">${{ Number(purchase.totalAmount).toLocaleString('es-CO') }} COP</strong></p>
        </div>

        <!-- Info de pago Nequi -->
        <div class="p-4 rounded-3 mb-4" style="background: var(--negro-soft); border: 2px solid var(--rojo);">
          <h5 style="font-family: var(--font-display); font-size: 1.2rem; color: var(--rojo); margin-bottom: 16px;">
            <i class="bi bi-phone me-2"></i>REALIZA TU PAGO POR NEQUI
          </h5>
          <div class="row g-3 align-items-center">
            <div class="col-md-7">
              <div class="mb-3">
                <div style="font-size: 0.75rem; color: var(--gris-light); text-transform: uppercase; letter-spacing: 0.1em;">Número Nequi</div>
                <div style="font-family: var(--font-display); font-size: 2rem; letter-spacing: 0.1em; color: var(--blanco);">
                  {{ paymentInfo.number }}
                  <button @click="copyNumber" class="btn btn-sm ms-2" style="background: var(--gris-dark); color: white; font-size: 0.7rem;">
                    <i class="bi bi-copy"></i>
                  </button>
                </div>
              </div>
              <div class="mb-3">
                <div style="font-size: 0.75rem; color: var(--gris-light); text-transform: uppercase; letter-spacing: 0.1em;">A nombre de</div>
                <div style="font-size: 1rem; font-weight: 600;">{{ paymentInfo.name }}</div>
              </div>
              <div>
                <div style="font-size: 0.75rem; color: var(--gris-light); text-transform: uppercase; letter-spacing: 0.1em;">Valor exacto a pagar</div>
                <div style="font-family: var(--font-display); font-size: 1.8rem; color: var(--rojo);">
                  ${{ Number(purchase.totalAmount).toLocaleString('es-CO') }} COP
                </div>
              </div>
            </div>
            <!-- QR placeholder -->
            <div class="col-md-5 text-center">
              <div style="background: white; padding: 16px; border-radius: 8px; display: inline-block;">
                <img v-if="qrImage" :src="qrImage" alt="QR Nequi" style="width: 140px; height: 140px;" />
                <div v-else style="width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 4px; color: #666; font-size: 0.75rem; text-align: center;">
                  <div><i class="bi bi-qr-code" style="font-size: 3rem; display:block; color: #333;"></i>QR próximamente</div>
                </div>
              </div>
              <div style="font-size: 0.7rem; color: var(--gris-light); margin-top: 8px;">Escanea con Nequi</div>
            </div>
          </div>
        </div>

        <!-- Subir comprobante -->
        <div class="p-4 rounded-3 mb-4" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
          <h5 style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 4px;">
            <i class="bi bi-upload me-2" style="color: var(--rojo);"></i>SUBE TU COMPROBANTE
          </h5>
          <p style="font-size: 0.85rem; color: var(--gris-light); margin-bottom: 16px;">
            Después de pagar, sube una captura de pantalla o foto del comprobante.
          </p>

          <div class="mb-3">
            <label class="voucher-dropzone d-block text-center p-4 rounded-3"
                   :class="{ 'has-file': voucherFile }"
                   style="border: 2px dashed var(--gris); cursor: pointer; transition: all 0.2s;">
              <input type="file" accept="image/*,.pdf" @change="onFileChange" style="display:none;" />
              <div v-if="!voucherFile">
                <i class="bi bi-image" style="font-size: 2.5rem; color: var(--gris-light);"></i>
                <p style="margin: 8px 0 0; color: var(--gris-light); font-size: 0.85rem;">Haz clic para seleccionar imagen</p>
                <p style="margin: 4px 0 0; color: var(--gris); font-size: 0.75rem;">JPG, PNG, WEBP o PDF · Máx 5MB</p>
              </div>
              <div v-else>
                <i class="bi bi-check-circle-fill" style="font-size: 2rem; color: var(--rojo);"></i>
                <p style="margin: 8px 0 0; font-weight: 600;">{{ voucherFile.name }}</p>
                <p style="margin: 4px 0 0; font-size: 0.75rem; color: var(--gris-light);">{{ (voucherFile.size / 1024).toFixed(0) }} KB</p>
              </div>
            </label>
          </div>

          <div v-if="uploadError" class="alert mb-3" style="background: rgba(204,0,0,0.15); border: 1px solid var(--rojo); color: white; font-size: 0.85rem;">
            <i class="bi bi-exclamation-triangle me-2"></i>{{ uploadError }}
          </div>

          <button @click="subirComprobante" :disabled="!voucherFile || uploading" class="btn btn-primary btn-lg w-100">
            <span v-if="uploading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-send me-2"></i>
            {{ uploading ? 'Enviando...' : 'Enviar comprobante' }}
          </button>
        </div>

        <div class="p-3 rounded-3" style="background: rgba(204,0,0,0.05); border: 1px solid var(--gris-dark); font-size: 0.8rem; color: var(--gris-light);">
          <i class="bi bi-info-circle me-1" style="color: var(--rojo);"></i>
          ID de reserva: <code style="color: var(--gris-light);">{{ purchase.id }}</code> — Guárdalo por si necesitas soporte.
        </div>
      </div>

      <!-- PASO 3: Comprobante enviado -->
      <div v-if="step === 3" class="text-center py-5 fade-up">
        <div style="width:90px; height:90px; background: rgba(204,0,0,0.15); border: 2px solid var(--rojo); border-radius: 50%; display:flex; align-items:center; justify-content:center; margin: 0 auto 24px;">
          <i class="bi bi-envelope-check-fill" style="font-size: 2.5rem; color: var(--rojo);"></i>
        </div>
        <h2 style="font-family: var(--font-display); font-size: 2.5rem;">¡COMPROBANTE ENVIADO!</h2>
        <p style="color: var(--gris-light); max-width: 420px; margin: 16px auto;">
          Tu comprobante fue recibido. El administrador lo revisará y cuando sea aprobado
          <strong style="color: white;">recibirás tus números en tu correo</strong>:
        </p>
        <div class="p-3 rounded-3 d-inline-block mb-4" style="background: var(--negro-soft); border: 1px solid var(--rojo);">
          <i class="bi bi-envelope me-2" style="color: var(--rojo);"></i>
          <strong>{{ purchase.buyerEmail }}</strong>
        </div>
        <br>
        <router-link to="/" class="btn btn-primary btn-lg">
          <i class="bi bi-house me-2"></i>Volver al inicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
import { purchasesApi } from '@/services/api'

const route = useRoute()
const raffleId = route.params.id

const step = ref(1)
const packages = ref([])
const loading = ref(false)
const error = ref(null)
const purchase = ref(null)
const paymentInfo = ref({ number: '3126324715', name: 'Jesus David Gonzalez Tapias' })
const qrImage = ref(null)
const voucherFile = ref(null)
const uploading = ref(false)
const uploadError = ref(null)

const form = ref({ quantity: 25, buyerName: '', buyerPhone: '', buyerEmail: '', buyerCity: '' })

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

const totalFormatted = computed(() => ((form.value.quantity || 0) * 400).toLocaleString('es-CO'))

const isValid = computed(() =>
  form.value.quantity >= 25 &&
  form.value.buyerName.trim() &&
  form.value.buyerPhone.trim() &&
  form.value.buyerEmail.includes('@') &&
  form.value.buyerCity.trim()
)

function onFileChange(e) {
  voucherFile.value = e.target.files[0] || null
  uploadError.value = null
}

function copyNumber() {
  navigator.clipboard.writeText(paymentInfo.value.number)
}

async function reservar() {
  error.value = null
  loading.value = true
  try {
    const { data } = await purchasesApi.create(raffleId, form.value)
    purchase.value = data.purchase
    if (data.payment) paymentInfo.value = data.payment
    step.value = 2
  } catch (err) {
    error.value = err.response?.data?.message || 'Ocurrió un error. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
}

async function subirComprobante() {
  if (!voucherFile.value) return
  uploading.value = true
  uploadError.value = null
  try {
    const formData = new FormData()
    formData.append('voucher', voucherFile.value)
    await purchasesApi.uploadVoucher(purchase.value.id, formData)
    step.value = 3
  } catch (err) {
    uploadError.value = err.response?.data?.message || 'Error al subir el comprobante. Intenta de nuevo.'
  } finally {
    uploading.value = false
  }
}

onMounted(async () => {
  try {
    const { data } = await purchasesApi.getPackages()
    packages.value = data.packages
    if (data.payment) {
      paymentInfo.value = data.payment
      if (data.payment.qrImage) {
        const base = import.meta.env.VITE_API_URL || ''
        qrImage.value = data.payment.qrImage.startsWith('http')
          ? data.payment.qrImage
          : `${base}/${data.payment.qrImage.replace(/^\.?\//, '')}`
      }
    }
  } catch {}
})
</script>

<style scoped>
.pkg-card:hover { border-color: var(--rojo) !important; }
.pkg-card.selected { border-color: var(--rojo) !important; background: rgba(204,0,0,0.1); }
.voucher-dropzone:hover { border-color: var(--rojo) !important; }
.voucher-dropzone.has-file { border-color: var(--rojo) !important; background: rgba(204,0,0,0.05); }
.form-control::placeholder { color: var(--gris) !important; }
</style>
