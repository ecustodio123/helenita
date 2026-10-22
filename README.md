# Helenita

Tienda independiente en React + Vite que consume `@ecustodio123/kafka-commerce` 0.3.0 de GitHub Packages y su peer dependency `@supabase/supabase-js` 2.x. La versión publicada es compatible con React 19. El lockfile registra las versiones instaladas.

## Instalación privada

El `.npmrc` del proyecto dirige únicamente el scope `@ecustodio123` a GitHub Packages y referencia `${GITHUB_PACKAGES_TOKEN}` para autenticar. El valor del token no se guarda en el repositorio.

Configura un token personal de GitHub (classic) con acceso al paquete y permiso `read:packages` mediante la variable de entorno privada `GITHUB_PACKAGES_TOKEN`. El proyecto ya contiene esta referencia, sin su valor:

```ini
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

Exporta esa variable de forma segura en tu sesión o gestor de secretos antes de ejecutar `npm ci`. npm no carga `.env` ni `.env.local` automáticamente. Tampoco uses el prefijo `VITE_` para tokens privados.

En Cloudflare Pages, configura el secreto `GITHUB_PACKAGES_TOKEN` en el entorno de compilación de Production (y Preview si lo usas). El nombre debe coincidir exactamente con `.npmrc`. Usa `npm run build` como comando y `dist` como directorio de salida. La autenticación se necesita durante la instalación automática de dependencias, antes del comando de build. Tras subir esta configuración, inicia una nueva compilación del commit actualizado.

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
