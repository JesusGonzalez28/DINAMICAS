// URL base del backend para archivos estáticos (imágenes, comprobantes)
export const backendUrl = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api', '').replace(/\/$/, '')
  : 'http://localhost:3000'

export function fileUrl(path) {
  if (!path) return null
  return `${backendUrl}/${path}`
}
