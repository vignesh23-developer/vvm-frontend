import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
  hover?: string
  style?: React.CSSProperties
  type?: 'button' | 'submit' | 'reset'
  icon?: React.ReactNode
  size?: 'small' | 'medium' | 'large' | 'extra-large'
  variant?: 'primary' | 'secondary' | 'tertiary'
}

function Button({
  children,
  onClick,
  disabled = false,
  className = '',
  hover = '',
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
        className={`${className} hover:cursor-pointer ${hover}`}
        style={style}
      >
        {icon && <span className="btn-icon">{icon}</span>}
        {children}
      </button>
    </div>
  )
}

export default Button
