import React from 'react'

interface TagProps {
  children: React.ReactNode
  variant: 'grow' | 'invest' | 'strategise' | 'manage' | 'sell'
  size?: 'sm' | 'md'
  className?: string
}

const Tag: React.FC<TagProps> = ({
  children,
  variant,
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    grow: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    invest: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    strategise: 'bg-purple-100 text-purple-800 border-purple-200',
    manage: 'bg-blue-100 text-blue-800 border-blue-200',
    sell: 'bg-orange-100 text-orange-800 border-orange-200'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  }
  
  const baseClasses = 'inline-flex items-center font-medium rounded-full border'
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  return (
    <span className={classes}>
      {children}
    </span>
  )
}

export default Tag 