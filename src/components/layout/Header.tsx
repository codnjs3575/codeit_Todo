import Image from 'next/image'

export const Header = () => {
  const handleLogoClick = () => (window.location.href = '/')
  return (
    <div className="w-full bg-white !border-b-[1px] !border-slate2">
      <div className="custom-container h-[60px] flex flex-row items-center">
        <div className="hidden cursor-pointer sm:block">
          <Image
            src="/images/logo/large.svg"
            alt="로고 이미지"
            width={151}
            height={40}
            onClick={handleLogoClick}
          />
        </div>
        <div className="block cursor-pointer sm:hidden">
          <Image
            src="/images/logo/small.svg"
            alt="로고 이미지"
            width={71}
            height={40}
            onClick={handleLogoClick}
          />
        </div>
      </div>
    </div>
  )
}
