import React from 'react'

const Button = ({classes, type = '', text, disabled = false, onClick}) => {
  return (
    <button type= {type} className={`app-button ${classes || ''}`} disabled={disabled} onClick={onClick}>
        {text}
    </button>
  )
}

export default Button



