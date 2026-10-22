# Helenita

Tienda independiente en React + Vite que consume `@ecustodio123/kafka-commerce` 0.3.0 de GitHub Packages y su peer dependency `@supabase/supabase-js` 2.x. La versión publicada es compatible con React 19. El lockfile registra las versiones instaladas.

## Instalación privada

El `.npmrc` del proyecto dirige únicamente el scope `@ecustodio123` a GitHub Packages. La autenticación se hereda del `.npmrc` de usuario (`~/.npmrc`), que ya permitió instalar y consultar el paquete en este equipo. No se copió su token al proyecto.

En otro equipo configura un token personal de GitHub con acceso al paquete y permiso `read:packages` mediante una variable de entorno privada `GITHUB_PACKAGES_TOKEN`. Agrega esta referencia a tu **`~/.npmrc` de usuario**, fuera del repositorio:

```ini
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

Exporta esa variable de forma segura en tu sesión o gestor de secretos antes de ejecutar `npm ci`. No la guardes en `.env.local`: npm no carga ese archivo. Tampoco uses el prefijo `VITE_` para tokens privados. El `NPM_TOKEN` presente en el entorno de este equipo no autentica contra GitHub Packages; la configuración de usuario existente sí.

## Configuración

Completa `.env.local` (ya creado y excluido de Git). En otro equipo copia primero `.env.example` a `.env.local`.

| Variable | Valor |
| --- | --- |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase existente. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave pública publishable del mismo proyecto. Nunca `service_role` ni una clave secreta. |
| `VITE_STORE_ID` | `store_id` real de la tienda. La API publicada requiere `storeId` y no acepta `store_slug`. |
| `VITE_WHATSAPP_PHONE` | Número real del negocio en formato internacional, de 8 a 15 dígitos. Se aceptan `+`, espacios y guiones; el normalizador del paquete los elimina antes de validar y configurar el checkout. |
| `VITE_STORE_NAME` | Opcional; nombre visible. Predeterminado: Helenita. |
| `VITE_PRODUCT_IMAGE_BUCKET` | Opcional; bucket público existente. Predeterminado del paquete: `product-images`. |

Las variables `VITE_*` se incluyen en el navegador: usa únicamente datos públicos. Reinicia Vite al cambiar el entorno; para producción vuelve a compilar.

```bash
npm ci
npm run dev
npm run build
npm run preview
```

## Integración verificada

Se inspeccionaron `package.json`, el README, `dist/index.d.ts`, los tipos de `CommerceStore`, `CommerceProvider` y checkout, y el bundle distribuido. El README publicado contiene referencias antiguas a `@kafka/commerce` y a la tabla `products`; se priorizaron los exports y la implementación de la versión 0.3.0.

`src/App.jsx` usa el export real `CommerceStore` con `navigationMode="standalone"`, `layout="sections"`, `supabase`, `storeId`, `storeName`, `title`, `productImageBucket` y `checkout={{ type: 'whatsapp', phone }}`. Importa los estilos desde el export público `@ecustodio123/kafka-commerce/styles.css`. El paquete proporciona catálogo responsive, categorías, búsqueda, filtros, carrito y checkout; esta app no duplica esas funcionalidades.

`src/lib/commerce.js` valida las variables obligatorias y crea el cliente Supabase. Si falta configuración, se muestra un aviso y no se instancia el cliente ni se monta la tienda.

Para ver la tienda real, configura las cuatro variables obligatorias y ejecuta `npm run dev`. El proyecto Supabase debe tener los productos y categorías reales de ese `store_id`, las imágenes y los permisos de lectura pública existentes que requiere el paquete. El bundle publicado consulta `kafka_commerce_products` y filtra por `store_id` y `active`; no se han modificado tablas, políticas RLS ni Edge Functions. Si los datos no son legibles, la interfaz del paquete mostrará el error o el estado vacío correspondiente.

No se agregaron datos ficticios, no se modificó Kafka Commerce y no se ejecutaron compras, commits, pushes ni despliegues.
