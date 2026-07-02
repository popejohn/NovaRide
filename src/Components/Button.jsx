import React from 'react'

const Button = ({classes, type = '', text, disabled = false, onClick}) => {
  return (
    <button type= {type} className={classes} disabled={disabled} onClick={onClick}>
        {text}
    </button>
  )
}

export default Button



