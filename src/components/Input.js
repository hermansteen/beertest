import React, { useState } from 'react'

const Input = ({ onChange, onClear }) => {
  const [value, setValue] = useState('')
  return (
    <div>
      <input
        type='text' value={value} onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder='Search for a beer'
      />
    </div>
  )
}

export default Input
