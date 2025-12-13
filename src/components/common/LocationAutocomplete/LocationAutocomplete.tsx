import { FocusEvent, memo } from 'react'
import { MapPin } from 'lucide-react'

export type LocationAutocompleteProps = {
  value: string
  onChange: (value: string) => void
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void
  placeholder?: string
  touched?: boolean
  error?: string
  showSuggestions: boolean
  suggestions: string[]
  onSuggestionSelect: (name: string) => void
  wrapperClassName?: string
  inputClassName?: string
  dropdownClassName?: string
  errorId?: string
  errorClassName?: string
}

const LocationAutocompleteComponent = ({
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder = 'Enter location',
  touched,
  error,
  showSuggestions,
  suggestions,
  onSuggestionSelect,
  wrapperClassName = '',
  inputClassName = '',
  dropdownClassName = '',
  errorId,
  errorClassName = '',
}: LocationAutocompleteProps) => {
  const hasError = Boolean(touched && error)

  return (
    <div className={`relative ${wrapperClassName}`}>
      <div className="flex items-center gap-2 w-full">
        <MapPin className={`w-5 h-5 ${hasError ? 'text-red-600' : 'text-gray-600'}`} />
        <input
          name="location"
          type="text"
          value={value}
          onChange={event => onChange(event.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          aria-invalid={hasError}
          aria-describedby={hasError && errorId ? errorId : undefined}
          className={`w-full bg-transparent outline-none font-medium placeholder-gray-400 ${
            hasError ? 'text-red-700' : 'text-black'
          } ${inputClassName}`}
        />
      </div>

      {hasError && error && (
        <p id={errorId} className={`text-red-600 text-xs mt-2 leading-tight ${errorClassName}`}>
          {error}
        </p>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div
          className={`absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-gray-100 bg-white shadow-xl ${dropdownClassName}`}
        >
          {suggestions.map(name => (
            <button
              type="button"
              key={name}
              onMouseDown={event => {
                event.preventDefault()
                onSuggestionSelect(name)
              }}
              className="w-full px-4 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const LocationAutocomplete = memo(LocationAutocompleteComponent)

export default LocationAutocomplete
