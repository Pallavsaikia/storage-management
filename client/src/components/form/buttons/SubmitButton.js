import React from 'react'

export const SubmitButton = ({top,bottom,x,y,reference,text,disabled}) => {
    
    return (
        <div className={`mt-${top?top:0} mb-${bottom?bottom:0} my-${y?y:0} mx-${x?x:0}`}>

            <button ref={reference} className="btn-primary button  d-grid w-100" type="submit" disabled={disabled?disabled:false}>
                {text}
            </button>
        </div>
    )
}
