import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // 설정한 색상들만 사용하기 위해 'extend' 대신 'colors' 덮어쓰기 사용
    extend: {
      fontFamily: {
        sans: ['NanumSquare', 'sans-serif'],
      },
      screens: {
        md: '744px',
      },
    },
  },
  plugins: [],
} satisfies Config
