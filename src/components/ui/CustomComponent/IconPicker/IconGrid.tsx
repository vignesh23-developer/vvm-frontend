import * as Icons from 'lucide-react'
import { Check, LucideIcon } from 'lucide-react'

interface IconGridProps {
  selected?: string
  onSelect: (iconName: string) => void
}

export default function IconGrid({ selected, onSelect }: IconGridProps) {
  // ✅ Filter out non-icon exports (like "default", "createLucideIcon")
  const iconEntries = Object.entries(Icons).filter(
    ([key, icon]) =>
      typeof icon === 'function' &&
      !['default', 'createLucideIcon'].includes(key),
  ) as [string, LucideIcon][]

  return (
    <div className="grid grid-cols-6 gap-3">
      {iconEntries.slice(0, 80).map(([name, Icon]) => (
        <button
          key={name}
          onClick={() => onSelect(name)}
          className={`relative p-2 border rounded-lg hover:bg-gray-100 transition ${
            selected === name ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <Icon size={20} />
          {selected === name && (
            <Check size={14} className="absolute top-1 right-1 text-blue-600" />
          )}
        </button>
      ))}
    </div>
  )
}
