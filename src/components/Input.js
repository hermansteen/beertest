import React, { useState } from 'react'

const Input = ({ onChange, text }) => {
  const [value, setValue] = useState('')
  return (
      <input
        type='text' value={value} onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={text}/>

  )
}

export default Input
