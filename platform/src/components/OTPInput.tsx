import React, { useState, useRef, useEffect } from 'react'

interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  error?: string
  disabled?: boolean
  autoFocus?: boolean
}

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  error,
  disabled = false,
  autoFocus = true
}) => {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0]?.focus()
    }
  }, [autoFocus])

  const handleChange = (index: number, digit: string) => {
    if (disabled) return

    // Only allow single digits
    if (digit.length > 1) return

    // Update the value
    const newValue = value.split('')
    newValue[index] = digit
    const newValueString = newValue.join('')
    onChange(newValueString)

    // Move to next input if digit was entered
    if (digit && index < length - 1) {
      setFocusedIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    // Handle backspace
    if (e.key === 'Backspace') {
      if (value[index]) {
        // Clear current digit
        const newValue = value.split('')
        newValue[index] = ''
        onChange(newValue.join(''))
      } else if (index > 0) {
        // Move to previous input and clear it
        setFocusedIndex(index - 1)
        inputRefs.current[index - 1]?.focus()
        const newValue = value.split('')
        newValue[index - 1] = ''
        onChange(newValue.join(''))
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      setFocusedIndex(index - 1)
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      setFocusedIndex(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return

    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '')
    
    if (pastedData.length === length) {
      onChange(pastedData)
      setFocusedIndex(length - 1)
      inputRefs.current[length - 1]?.focus()
    }
  }

  const handleFocus = (index: number) => {
    setFocusedIndex(index)
  }

  const handleClick = (index: number) => {
    setFocusedIndex(index)
    inputRefs.current[index]?.focus()
  }

  return (
    <div className="w-full">
      <div className="flex justify-center space-x-2 mb-4">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            onClick={() => handleClick(index)}
            disabled={disabled}
            className={`
              w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg
              transition-colors focus:outline-none focus:ring-2 focus:ring-primary
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : focusedIndex === index
                ? 'border-primary'
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  )
}

export default OTPInput 