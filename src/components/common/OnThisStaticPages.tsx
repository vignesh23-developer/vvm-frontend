import React from 'react'

const OnThisStaticPages = ({ tocLabel, toc }: { tocLabel?: string; toc: { id: string; text: string; level: number }[] }) => {
  const heading = tocLabel?.trim() || 'On this page'

  const splitLeadingMeta = (raw: string) => {
    const fullText = String(raw ?? '').trim()
    if (!fullText) return { icon: '', marker: '', label: '' }

    const parts = fullText.split(/\s+/).filter(Boolean)
    if (parts.length === 1) return { icon: '', marker: '', label: fullText }

    let cursor = 0
    let icon = ''
    let marker = ''

    // 1) Optional leading emoji/symbol token.
    const firstToken = parts[cursor]
    const hasLettersOrNumbers = /[\p{L}\p{N}]/u.test(firstToken)
    if (!hasLettersOrNumbers) {
      icon = firstToken
      cursor += 1
    }

    // 2) Optional leading numeric marker token (kept from content; not auto-generated).
    // Accept: 1, 1., 1), 1:, 1-
    const maybeMarker = parts[cursor]
    if (typeof maybeMarker === 'string') {
      const isNumericMarker = /^\d{1,3}(?:[\.)\:\-])?$/.test(maybeMarker)
      if (isNumericMarker && parts.length > cursor + 1) {
        marker = maybeMarker
        cursor += 1
      }
    }

    const label = parts.slice(cursor).join(' ').trim()
    if (!label) return { icon: '', marker: '', label: fullText }

    return { icon, marker, label }
  }

  return (
    <div>
      <aside className="md:col-span-1 hidden md:block">
        <div className="sticky top-24 border border-yellow-200 rounded-md p-4 bg-gradient-to-br from-yellow-50 to-yellow-100/30">
          <h3 className="text-sm font-bold mb-3 text-[#2a1407]">{heading}</h3>
          <nav>
            <ul className="space-y-2 text-sm list-none p-0 m-0">
              {toc.map(item => {
                const { icon, marker, label } = splitLeadingMeta(String(item.text ?? ''))
                const text = label
                const isPrimary = item.level === 1
                const textTone = isPrimary ? 'text-[#2a1407]' : item.level === 2 ? 'text-gray-700' : 'text-gray-600'
                const weightTone = isPrimary ? 'font-bold' : item.level === 2 ? 'font-medium' : 'font-normal'

                return (
                  <li key={item.id} className="list-none">
                    <a
                      href={`#${item.id}`}
                      className={`grid grid-cols-[1rem_1fr] items-start gap-2 rounded-md px-2 py-1.5 ${textTone} text-left leading-snug whitespace-normal break-words hover:text-yellow-700 hover:bg-yellow-100/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50 ${weightTone}`}
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
                      <span className="flex items-start gap-1 pt-0.5 leading-none text-gray-500 font-normal tabular-nums">
                        <span className="inline-block w-4 text-center">{icon}</span>
                        <span>{marker}</span>
                      </span>
                      <span className="min-w-0">{text}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  )
}

export default OnThisStaticPages
