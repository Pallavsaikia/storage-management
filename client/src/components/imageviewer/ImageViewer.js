import { React, useState, useEffect } from 'react'
import './ImageViewer.css'
export const ImageViewer = ({ imageList, currentIndex, setCurrentIndex, clicked, setClicked }) => {
    const [currentImg, setCurrentImg] = useState(null);


    useEffect(() => {
        setCurrentImg(imageList.current[currentIndex])
        return () => {
        };
    }, [currentIndex]);

    function onKeyPress(event) {
        const key = event.key; // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
        if (key === 'ArrowRight') {
            if (imageList.current.length > 0) {
                setCurrentIndex(oldata => {
                    if (imageList.current.length > (oldata + 1)) {
                        return oldata + 1
                    }
                    else {
                        return oldata
                    }

                })
            }
        }
        if (key === 'ArrowLeft') {
            if (imageList.current.length > 0) {
                setCurrentIndex(oldata => {
                    if ((oldata) > 0) {
                        return oldata - 1
                    }
                    else {
                        return oldata
                    }

                })
            }
        }
        if (key === 'Escape') {
            setClicked(false)

        }

    }

    useEffect(() => {
        window.addEventListener('keydown', onKeyPress);
        return () => {
            window.removeEventListener('keydown', onKeyPress)
        };

    }, []);

    function imageViewerUi(currentImg) {
        if (clicked) {
            return (<div className='background-transparent'>
                < img src={currentImg?.src} className="img-view" />

                {/* < img src={currentImg?.src} className="img-view" /> */}


            </div>)
        } else {
            <></>
        }
    }

    return (
        <>
            {imageViewerUi(currentImg)}
        </>



    )
}
