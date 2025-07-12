// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'

// Pages Router환경에서 HTML 문서 전체 구조를 커스터마이징할 때 사용하는 파일
export default function Document() {
  return (
    <Html lang="ko">
      <Head />
      {/* F9FAFB */}
      <body className="w-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
