'use client'

import Image from 'next/image'

const LogoSection = () => {
  return (
    <div className="hidden md:flex w-1/2 bg-[#2c1207] flex-col items-center justify-center text-center p-6">
      <div className="max-w-xs">
        <Image
          src="/footer_logo.png"
          alt="Vaazhga Valamudan Logo"
          width={300}
          height={300}
          className="mx-auto"
        />
      </div>
    </div>
  )
}

export default LogoSection
