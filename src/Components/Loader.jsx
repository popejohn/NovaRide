import React from 'react';
import { ClipLoader } from 'react-spinners';



const Loader = ({color}) => {
  return (
    <div className=""> 
        <ClipLoader
            color={color}
            size={20}
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    </div>
  )
}


export default Loader