'use client'

import React, { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger, ScrollToPlugin } from 'gsap/all'
import './style.css' // Import the regular CSS file
import Image from 'next/image'
import { BackgroundRippleEffect } from '../background-ripple-effect' // <-- added
import { useGlobalContext } from '@/hooks/GlobalContext/GlobalContext'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const LoadingAnimation: React.FC = () => {
  const { setIsPageLoading } = useGlobalContext()

  useEffect(() => {
    const timeline = gsap.timeline()

    timeline.to('.milPreloaderAnimation', {
      opacity: 1,
    })

    timeline.fromTo(
      '.milAnimation1 .milH3',
      {
        y: '30px',
        opacity: 0,
      },
      {
        y: '0px',
        opacity: 1,
        stagger: 0.4,
      },
    )

    timeline.to(
      '.milAnimation1 .milH3',
      {
        opacity: 0,
        y: '-30',
      },
      '+=.3',
    )

    timeline.fromTo(
      '.milRevealBox',
      0.1,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        x: '-30',
      },
    )

    timeline.to(
      '.milRevealBox',
      0.45,
      {
        width: '100%',
        x: 0,
      },
      '+=.1',
    )

    timeline.to('.milRevealBox', {
      right: '0',
    })

    timeline.to('.milRevealBox', {
      width: '0%',
    })

    timeline.fromTo(
      '.milAnimation2 .milH3',
      {
        opacity: 0,
      },
      {
        opacity: 1,
      },
      '-=.5',
    )

    timeline.to(
      '.milAnimation2 .milH3',
      0.6,
      {
        opacity: 0,
        y: '-30',
      },
      '+=.5',
    )

    timeline.to(
      '.milPreloader',
      0.8,
      {
        opacity: 0,
        ease: 'sine',
      },
      '+=.2',
    )

    timeline.fromTo(
      '.milUp',
      0.8,
      {
        opacity: 0,
        y: 40,
        scale: 0.98,
        ease: 'sine',
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        onComplete: function () {
          const preloaderElement = document.querySelector('.milPreloader') as HTMLElement
          if (preloaderElement) preloaderElement.classList.add('milHidden')
          setIsPageLoading(false)
        },
      },
      '-=1',
    )
  }, [])

  return (
    <div className="milPreloader relative">
      {/* Background ripple/grid effect behind the loader content */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundRippleEffect rows={7} cols={28} cellSize={44} />
      </div>

      <div className="milPreloaderAnimation relative z-10">
        <div className="milPosAbs milAnimation1">
          <p className="milH3 milBla milThin" id="color-mil-txt">
            TamilNadu's{' '}
          </p>
          <p className="milH3 milMaroon" id="color-mil-txt" style={{ color: '#fde047' }}>
            Trusted
          </p>
          <p className="milH3 milBlack milThin" id="color-mil-txt">
            Digital Platform
          </p>
        </div>
        <div className="milPosAbs milAnimation2">
          <div className="milRevealFrame">
            <p className="milRevealBox"></p>
            <div className="milH3 milMaroon milThin minWebHeader">
              {/* use logo from public folder */}
              <Image
                src="/footer_logo_new_en.png"
                alt="Vaazhga Valamudan Logo"
                width={300}
                height={150}
                className="w-[300px] h-auto object-contain hover:brightness-110 transition duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingAnimation
