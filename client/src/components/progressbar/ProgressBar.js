import React from 'react'

const ProgressBar = ({ bgcolor, progress, height, top, bottom, left, right }) => {

    const Parentdiv = {
        height: height,
        width: '100%',
        backgroundColor: 'whitesmoke',
        borderRadius: 40,
        marginTop: top,
        marginBottom: bottom,
        marginLeft: left,
        marginRight: right,
    }

    const Childdiv = {
        height: '100%',
        width: `${progress}%`,
        backgroundColor: bgcolor,
        borderRadius: 40,
        textAlign: 'right'
    }



    return (
        <div style={Parentdiv}>
            <div style={Childdiv}>
            </div>
        </div>
    )
}

export default ProgressBar;