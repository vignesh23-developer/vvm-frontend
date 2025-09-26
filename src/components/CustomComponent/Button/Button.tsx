import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
  type?: 'button' | 'submit' | 'reset'
  icon?: React.ReactNode
  size?: 'small' | 'medium' | 'large'
  variant?: 'primary' | 'secondary' | 'tertiary'
}

function Button({
  children,
  onClick,
  disabled = false,
  className = '',
  style = {},
  type = 'button',
  icon,
  size = 'medium',
  variant = 'primary',
}: ButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      onClick()
    }
  }

  return (
    <div>
      <button
        type={type}
        onClick={handleClick}
        disabled={disabled}
        className={`btn btn-${variant} btn-${size} ${className}`}
        style={style}
      >
        {icon && <span className="btn-icon">{icon}</span>}
        {children}
      </button>
    </div>
  )
}

export default Button
