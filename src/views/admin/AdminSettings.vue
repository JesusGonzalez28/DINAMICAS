<template>
  <AdminLayout>
    <div class="fade-up" style="max-width: 560px;">
      <h1 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 4px;">CONFIGURACIÓN</h1>
      <p style="color: var(--gris-light); margin-bottom: 12px;">Datos de pago Nequi y código QR</p>
      <hr class="divider-rojo" />

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border" style="color: var(--rojo);"></div>
      </div>

      <form v-else @submit.prevent="save" class="p-4 rounded-3" style="background: var(--negro-soft); border: 1px solid var(--gris-dark);">
        <div class="mb-3">
          <label class="form-label" style="font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">
            <i class="bi bi-phone me-1"></i>Número Nequi
          </label>
          <input v-model="form.nequiNumber" type="text" class="form-control"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white;"
                 placeholder="3126324715" />
        </div>

        <div class="mb-4">
          <label class="form-label" style="font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">
            <i class="bi bi-person me-1"></i>Nombre del titular Nequi
          </label>
          <input v-model="form.nequiName" type="text" class="form-control"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white;"
                 placeholder="Jesus David Gonzalez Tapias" />
        </div>

        <div class="mb-4">
          <label class="form-label" style="font-weight: 600; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">
            <i class="bi bi-qr-code me-1"></i>Código QR de Nequi
          </label>

          <div class="d-flex align-items-center gap-3 flex-wrap">
            <div style="background: white; padding: 10px; border-radius: 8px; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center;">
              <img v-if="qrPreview" :src="qrPreview" alt="QR actual" style="max-width: 100%; max-height: 100%;" />
              <i v-else class="bi bi-qr-code" style="font-size: 2.5rem; color: #999;"></i>
            </div>

            <div>
              <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="onFileChange" />
              <button type="button" class="btn btn-outline-light btn-sm" @click="$refs.fileInput.click()">
                <i class="bi bi-upload me-1"></i>{{ qrFile ? 'Cambiar imagen' : 'Subir nuevo QR' }}
              </button>
              <div v-if="qrFile" style="font-size: 0.75rem; color: var(--gris-light); margin-top: 4px;">{{ qrFile.name }}</div>
            </div>
          </div>
        </div>

        <div v-if="message" class="alert mb-3" :style="messageIsError
            ? 'background: rgba(204,0,0,0.15); border: 1px solid var(--rojo); color: var(--blanco);'
            : 'background: rgba(76,175,80,0.15); border: 1px solid #4CAF50; color: var(--blanco);'">
          <i :class="messageIsError ? 'bi bi-exclamation-triangle' : 'bi bi-check-circle'" class="me-2"></i>{{ message }}
        </div>

        <button type="submit" class="btn btn-primary w-100" :disabled="saving">
          <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-save me-2"></i>
          {{ saving ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { settingsApi } from '@/services/api'

const loading = ref(true)
const saving = ref(false)
const message = ref('')
const messageIsError = ref(false)

const form = ref({ nequiNumber: '', nequiName: '' })
const qrFile = ref(null)
const qrPreview = ref(null)

async function load() {
  loading.value = true
  try {
    const res = await settingsApi.get()
    form.value.nequiNumber = res.data.nequiNumber
    form.value.nequiName = res.data.nequiName
    if (res.data.qrImage) {
      const base = import.meta.env.VITE_API_URL || ''
      qrPreview.value = res.data.qrImage.startsWith('http')
        ? res.data.qrImage
        : `${base}/${res.data.qrImage.replace(/^\.?\//, '')}`
    }
  } catch (e) {
    console.error('Error cargando configuración', e)
  } finally {
    loading.value = false
  }
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  qrFile.value = file
  qrPreview.value = URL.createObjectURL(file)
}

async function save() {
  saving.value = true
  message.value = ''
  try {
    const formData = new FormData()
    formData.append('nequiNumber', form.value.nequiNumber)
    formData.append('nequiName', form.value.nequiName)
    if (qrFile.value) formData.append('qrImage', qrFile.value)

    await settingsApi.update(formData)
    message.value = 'Configuración guardada correctamente'
    messageIsError.value = false
    qrFile.value = null
  } catch (e) {
    message.value = e.response?.data?.message || 'Error al guardar la configuración'
    messageIsError.value = true
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.fade-up {
  animation: fadeUp 0.4s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
