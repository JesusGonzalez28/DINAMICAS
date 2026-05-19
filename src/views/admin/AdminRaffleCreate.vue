<template>
  <AdminLayout>
    <div class="fade-up" style="max-width: 680px;">
      <router-link to="/admin/rifas" style="color: var(--gris-light); text-decoration:none; font-size:0.9rem;" class="d-inline-block mb-4">
        <i class="bi bi-arrow-left me-1"></i>Volver a rifas
      </router-link>

      <h1 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 4px;">NUEVA RIFA</h1>
      <hr class="divider-rojo" />

      <div v-if="created" class="text-center py-5 fade-up">
        <i class="bi bi-check-circle-fill" style="font-size: 4rem; color: var(--rojo);"></i>
        <h2 style="font-family: var(--font-display); margin-top: 16px;">¡RIFA CREADA!</h2>
        <p style="color: var(--gris-light);">Se generaron 10.000 tickets automáticamente.</p>
        <div class="d-flex gap-3 justify-content-center mt-4">
          <router-link to="/admin/rifas" class="btn btn-primary">Ver todas las rifas</router-link>
          <button @click="resetForm" class="btn btn-outline-light">Crear otra</button>
        </div>
      </div>

      <form v-else @submit.prevent="submit">
        <!-- Imagen del premio -->
        <div class="mb-4">
          <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Imagen del premio</label>
          <label class="d-block text-center p-4 rounded-3"
                 :class="{ 'has-file': prizeImageFile }"
                 style="border: 2px dashed var(--gris); cursor: pointer; transition: all 0.2s;"
                 :style="prizeImageFile ? 'border-color: var(--rojo);' : ''">
            <input type="file" accept="image/*" @change="onImageChange" style="display:none;" />
            <div v-if="!prizeImagePreview">
              <i class="bi bi-image" style="font-size: 3rem; color: var(--gris-light);"></i>
              <p style="margin: 8px 0 0; color: var(--gris-light); font-size: 0.85rem;">Haz clic para subir la imagen del premio</p>
              <p style="margin: 4px 0 0; color: var(--gris); font-size: 0.75rem;">JPG, PNG o WEBP</p>
            </div>
            <div v-else>
              <img :src="prizeImagePreview" style="max-height: 200px; border-radius: 8px; object-fit: cover;" />
              <p style="margin: 8px 0 0; font-size: 0.8rem; color: var(--gris-light);">{{ prizeImageFile.name }}</p>
            </div>
          </label>
        </div>

        <!-- Info básica -->
        <div class="mb-3">
          <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Título de la rifa *</label>
          <input v-model="form.title" type="text" class="form-control"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white;"
                 placeholder="Gran Rifa Navideña 2025" required />
        </div>

        <div class="mb-3">
          <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Premio *</label>
          <input v-model="form.prize" type="text" class="form-control"
                 style="background: var(--gris-dark); border-color: var(--gris); color: white;"
                 placeholder="Toyota Prado 2024" required />
        </div>

        <div class="mb-3">
          <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Descripción</label>
          <textarea v-model="form.description" class="form-control" rows="2"
                    style="background: var(--gris-dark); border-color: var(--gris); color: white;"
                    placeholder="Describe el premio..."></textarea>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-6">
            <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Precio por número (COP) *</label>
            <input v-model.number="form.pricePerNumber" type="number" min="1" class="form-control"
                   style="background: var(--gris-dark); border-color: var(--gris); color: white;" required />
          </div>
          <div class="col-6">
            <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Fecha del sorteo <small style="color: var(--gris);">(opcional)</small></label>
            <input v-model="form.drawDate" type="datetime-local" class="form-control"
                   style="background: var(--gris-dark); border-color: var(--gris); color: white;" />
          </div>
        </div>

        <hr class="divider-rojo" />

        <!-- Números bendecidos -->
        <div class="mb-4">
          <h5 style="font-family: var(--font-display); font-size: 1.2rem; margin-bottom: 4px; color: #FFD700;">⭐ NÚMEROS BENDECIDOS</h5>
          <p style="font-size: 0.8rem; color: var(--gris-light); margin-bottom: 16px;">Números especiales con premio adicional — se asignan al azar al crear la rifa</p>
          <div class="row g-3">
            <div class="col-6">
              <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Cantidad de bendecidos</label>
              <input v-model.number="form.blessedCount" type="number" min="0" max="500" class="form-control"
                     style="background: var(--gris-dark); border-color: #FFD700; color: white;" />
            </div>
            <div class="col-6">
              <label class="form-label" style="font-size: 0.85rem; color: var(--gris-light);">Premio por bendecido (COP)</label>
              <input v-model.number="form.blessedPrize" type="number" min="0" class="form-control"
                     style="background: var(--gris-dark); border-color: #FFD700; color: white;" />
            </div>
          </div>
          <div class="mt-2 p-2 rounded-3" style="background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.2); font-size: 0.8rem; color: #FFD700;">
            ⭐ <strong>{{ form.blessedCount }}</strong> números dorados con premio de
            <strong>${{ Number(form.blessedPrize).toLocaleString('es-CO') }} COP</strong> c/u
          </div>
        </div>

        <hr class="divider-rojo" />

        <!-- Paquetes -->
        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 style="font-family: var(--font-display); font-size: 1.2rem; margin: 0;">PAQUETES</h5>
              <p style="font-size: 0.8rem; color: var(--gris-light); margin: 0;">Opciones de compra para esta rifa</p>
            </div>
            <button type="button" @click="addPackage" class="btn btn-sm btn-outline-light">
              <i class="bi bi-plus me-1"></i>Agregar
            </button>
          </div>

          <div v-for="(pkg, i) in form.packages" :key="i" class="d-flex gap-2 mb-2 align-items-center">
            <input v-model.number="pkg.quantity" type="number" min="1" class="form-control form-control-sm"
                   style="background: var(--gris-dark); border-color: var(--gris); color: white; flex:1;" placeholder="Cantidad" />
            <input v-model="pkg.label" type="text" class="form-control form-control-sm"
                   style="background: var(--gris-dark); border-color: var(--gris); color: white; flex:2;" placeholder="Nombre" />
            <div style="min-width: 90px; font-size: 0.8rem; color: var(--rojo); font-weight: 700; text-align:right;">
              ${{ (pkg.quantity * form.pricePerNumber).toLocaleString('es-CO') }}
            </div>
            <button type="button" @click="removePackage(i)" class="btn btn-sm btn-outline-danger">
              <i class="bi bi-trash"></i>
            </button>
          </div>

          <div v-if="form.packages.length === 0" class="text-center py-3 rounded-3"
               style="border: 1px dashed var(--gris); color: var(--gris-light); font-size: 0.85rem;">
            Sin paquetes — se usarán los predeterminados
          </div>
        </div>

        <!-- Resumen -->
        <div class="p-3 rounded-3 mb-4" style="background: rgba(204,0,0,0.08); border: 1px solid var(--rojo);">
          <div style="font-size: 0.8rem; color: var(--gris-light); margin-bottom: 4px;">Resumen</div>
          <div style="font-family: var(--font-display); font-size: 1.2rem;">
            10.000 tickets · ${{ form.pricePerNumber.toLocaleString('es-CO') }} c/u
          </div>
          <div style="font-size: 0.85rem; color: var(--rojo);">
            Recaudo potencial: ${{ (form.pricePerNumber * 10000).toLocaleString('es-CO') }} COP
          </div>
        </div>

        <div v-if="error" class="alert mb-3" style="background: rgba(204,0,0,0.15); border: 1px solid var(--rojo); color: white;">
          <i class="bi bi-exclamation-triangle me-2"></i>{{ error }}
        </div>

        <button type="submit" :disabled="loading" class="btn btn-primary btn-lg w-100">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="bi bi-plus-circle me-2"></i>
          {{ loading ? 'Creando rifa y tickets...' : 'Crear Rifa' }}
        </button>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { rafflesApi } from '@/services/api'

const loading = ref(false)
const error = ref(null)
const created = ref(false)
const prizeImageFile = ref(null)
const prizeImagePreview = ref(null)

const defaultPackages = () => [
  { quantity: 25,  label: 'Paquete Básico' },
  { quantity: 50,  label: 'Paquete Bronce' },
  { quantity: 75,  label: 'Paquete Plata' },
  { quantity: 100, label: 'Paquete Oro' },
  { quantity: 200, label: 'Paquete Diamante' },
]

const form = ref({
  title: '', prize: '', description: '',
  pricePerNumber: 400, drawDate: '',
  blessedCount: 10, blessedPrize: 50000,
  packages: defaultPackages(),
})

function onImageChange(e) {
  const file = e.target.files[0]
  if (!file) return
  prizeImageFile.value = file
  prizeImagePreview.value = URL.createObjectURL(file)
}

function addPackage() {
  form.value.packages.push({ quantity: 25, label: 'Nuevo paquete' })
}

function removePackage(i) {
  form.value.packages.splice(i, 1)
}

function resetForm() {
  form.value = { title: '', prize: '', description: '', pricePerNumber: 400, drawDate: '', blessedCount: 10, blessedPrize: 50000, packages: defaultPackages() }
  prizeImageFile.value = null
  prizeImagePreview.value = null
  created.value = false
  error.value = null
}

async function submit() {
  error.value = null
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('prize', form.value.prize)
    if (form.value.description) formData.append('description', form.value.description)
    formData.append('pricePerNumber', String(form.value.pricePerNumber))
    if (form.value.drawDate) formData.append('drawDate', new Date(form.value.drawDate).toISOString())
    formData.append('blessedCount', String(form.value.blessedCount))
    formData.append('blessedPrize', String(form.value.blessedPrize))
    if (form.value.packages.length > 0) {
      formData.append('packages', JSON.stringify(form.value.packages))
    }
    if (prizeImageFile.value) {
      formData.append('prizeImage', prizeImageFile.value)
    }

    await rafflesApi.create(formData)
    created.value = true
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al crear la rifa'
  } finally {
    loading.value = false
  }
}
</script>
