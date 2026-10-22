import { createClient } from '@supabase/supabase-js'
import { isValidWhatsAppPhone, normalizeWhatsAppPhone } from '@ecustodio123/kafka-commerce'

const env = import.meta.env
const url = env.VITE_SUPABASE_URL?.trim() ?? ''
const publicKey = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? ''

export const storeConfig = {
  id: env.VITE_STORE_ID?.trim() ?? '',
  name: env.VITE_STORE_NAME?.trim() || 'Helenita',
  whatsappPhone: normalizeWhatsAppPhone(env.VITE_WHATSAPP_PHONE?.trim() ?? ''),
  productImageBucket: env.VITE_PRODUCT_IMAGE_BUCKET?.trim() || 'product-images',
}

export const configurationIssues = []

if (!url) {
  configurationIssues.push('Configura VITE_SUPABASE_URL.')
} else {
  try {
    if (!['https:', 'http:'].includes(new URL(url).protocol)) throw new Error()
  } catch {
    configurationIssues.push('VITE_SUPABASE_URL debe ser una URL HTTP o HTTPS válida.')
  }
}

if (!publicKey) {
  configurationIssues.push('Configura VITE_SUPABASE_PUBLISHABLE_KEY con la clave pública de Supabase.')
}
if (!storeConfig.id) {
  configurationIssues.push('Configura VITE_STORE_ID con el identificador de tu tienda existente.')
}
if (!isValidWhatsAppPhone(storeConfig.whatsappPhone)) {
  configurationIssues.push('Configura VITE_WHATSAPP_PHONE con un número internacional de 8 a 15 dígitos.')
}

// No client or requests until the real store configuration is complete.
export const supabase = configurationIssues.length === 0
  ? createClient(url, publicKey)
  : null
