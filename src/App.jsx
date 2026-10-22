import { CommerceStore } from '@ecustodio123/kafka-commerce'
import { storeConfig, configurationIssues, supabase } from './lib/commerce.js'
import { theme } from './theme.js'

export default function App() {
  if (configurationIssues.length > 0) {
    return (
      <main className="setup" aria-labelledby="setup-title">
        <div className="setup__card">
          <p className="setup__label">{storeConfig.name}</p>
          <h1 id="setup-title">La tienda está pendiente de configuración</h1>
          <p>
            Completa <code>.env.local</code> con los datos de tu tienda y reinicia
            el servidor de desarrollo para ver el catálogo real.
          </p>
          <ul>
            {configurationIssues.map((issue) => <li key={issue}>{issue}</li>)}
          </ul>
        </div>
      </main>
    )
  }

  return (
    <main>
      <CommerceStore
        supabase={supabase}
        storeId={storeConfig.id}
        storeName={storeConfig.name}
        title={storeConfig.name}
        description="Cuidado y Comodidad para Adultos"
        theme={theme}
        navigationMode="standalone"
        layout="sections"
        productImageBucket={storeConfig.productImageBucket}
        checkout={{ type: 'whatsapp', phone: storeConfig.whatsappPhone }}
      />
    </main>
  )
}
