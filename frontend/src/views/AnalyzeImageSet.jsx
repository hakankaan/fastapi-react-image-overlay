import React, { useContext, useState, useEffect } from 'react'
import { mainContext } from './context/mainContext'
import './styles/slider.css';

const AnalyzeImageSet = () => {
    const { mainData } = useContext(mainContext);
    const [rangeValue, setRangeValue] = useState(0)
    const [rawOpacity, setRawOpacity] = useState(0.5)
    const [maskOpacity, setMaskOpacity] = useState(0.5)
    useEffect(()=> {
        setRawOpacity(0.5 - rangeValue)
        setMaskOpacity(parseFloat(0.5) + parseFloat(rangeValue))
    },[rangeValue])
    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
            }}>

            
            {
                mainData.selectedImageSet &&
                <>
                <div style={{
                        position: 'relative',
                        width: '40vw',
                        height: '40vh',
                    }}>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                backgroundImage: `url(${mainData.selectedImageSet.raw_image_url})`,
                                backgroundSize: 'cover',
                                opacity: rawOpacity,
                            }}
                        ></div>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                backgroundImage: `url(${mainData.selectedImageSet.mask_image_url})`,
                                backgroundSize: 'cover',
                                opacity: maskOpacity,
                            }}
                        ></div>
                </div>
                <div class="slidecontainer" style={{}}>
                    <input type="range" step="0.02" min="-0.5" max="0.5" value={rangeValue} class="slider" id="myRange" onChange={(e) => setRangeValue(e.target.value)} />
                </div>
                </>
            }
            </div>
        </>
    )
}

export default AnalyzeImageSet
