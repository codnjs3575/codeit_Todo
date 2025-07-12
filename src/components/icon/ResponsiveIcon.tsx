import Image from 'next/image'

interface ResponsiveIconProps {
  name: string
  alt: string
  width?: number
  height?: number
  onClick?: () => void
}
export default function ResponsiveIcon({ name, alt }: ResponsiveIconProps) {
  return (
    <>
      <div className="block sm:hidden">
        <Image
          src={`/images/icon/${name}_small.svg`}
          alt={alt}
          width={120}
          height={120}
          style={{ objectFit: 'contain', width: '120px', height: '120px' }}
        />
      </div>
      <div className="hidden sm:block">
        <Image
          src={`/images/icon/${name}_large.svg`}
          alt={alt}
          width={240}
          height={240}
          style={{ objectFit: 'contain', width: '240px', height: '240px' }}
        />
      </div>
    </>
  )
}
