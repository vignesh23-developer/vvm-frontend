import React from 'react'

const OnThisStaticPages = ({ tocLabel, toc }: { tocLabel: string; toc: { id: string; text: string; level: number }[] }) => {
  return (
    <div>
      <aside className="md:col-span-1 hidden md:block">
        <div className="sticky top-24 border border-yellow-200 rounded-md p-4 bg-gradient-to-br from-yellow-50 to-yellow-100/30">
          <h3 className="text-sm font-semibold mb-3 text-[#2a1407]">{tocLabel}</h3>
          <nav>
            <ul className="space-y-2 text-sm">
              {toc.map(item => (
                <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                  <a
                    href={`#${item.id}`}
                    className="text-[#2a1407] hover:text-yellow-700"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault()
                      const el = document.getElementById(item.id)
                      if (!el) return
                      // center the heading in viewport so it's visible even with fixed headers
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      // focus after small delay so browser has scrolled
                      setTimeout(() => {
                        el.setAttribute('tabindex', '-1')
                        ;(el as HTMLElement).focus()
                        if (history && history.replaceState) history.replaceState(null, '', `#${item.id}`)
                      }, 250)
                    }}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  )
}

export default OnThisStaticPages
