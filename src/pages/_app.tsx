// src/pages/_app.tsx
import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import { Header } from '@/components/layout/Header'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header />
      <div className="custom-container !mt-6">
        <Component {...pageProps} />
      </div>
    </div>
  )
}
