import React, { useState, useEffect, useRef } from 'react'
import {Button} from 'antd'
const styles = {
    canvas : {
        border:'1px solid #333',
        margin:'20px 0px'
    },

    maindiv : {
        padding:'10px',
        margin:'auto',
        width:'800px'
    },

    button : {
        border:'0px',
        margin:'1px',
        height:'50px',
        minWidth:'75px'
    },

    colorSwatches : {        
        red : {'backgroundColor' : 'red'},    
        orange : {'backgroundColor' : 'orange'},
        yellow : {'backgroundColor' : 'yellow'},
        green : {'backgroundColor' : 'green'},
        blue : {'backgroundColor' : 'blue'},
        purple : {'backgroundColor' : 'purple'},
        black : {'backgroundColor' : 'black'}
    }
}

const Draw = ({url, canvasRef}) => {
    const [mode, setMode] = useState('draw')
    const [pen, setPen] = useState('up')
    const [lineWidth, setLineWidth] = useState(10)
    const [penColor, setPenColor] = useState('black')
    const [penCoords, setPenCoords] = useState([0, 0])
    

    useEffect(() => {
        loadImage()
    }, [])
    function loadImage(){
        try {
            getBase64ImageFromUrl(url).then((base64) => {
                let img = new Image(canvasRef.current.width, canvasRef.current.height);
                img.crossOrigin = '*'
                img.onload = function () {
                    const context = canvasRef.current.getContext('2d');
                    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    context.drawImage(img, 0, 0, this.width, this.height);
                };
                img.src = base64;
            })
            
        } catch (error) {
            console.log(error)
        }
    }

    function drawing(e) { //if the pen is down in the canvas, draw/erase

        if(pen === 'down') {

            let ctx = canvasRef.current.getContext('2d')
            ctx.beginPath()
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round';


            if(mode === 'draw') {
                ctx.strokeStyle = penColor
            }

            if(mode === 'erase') {
                ctx.strokeStyle = '#ffffff'
            }
            ctx.moveTo(penCoords[0], penCoords[1]) //move to old position
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY) //draw to new position
            ctx.stroke();

            setPenCoords([e.nativeEvent.offsetX, e.nativeEvent.offsetY])
        }
    }
    function penDown(e) { //mouse is down on the canvas
        setPen('down')
        setPenCoords([e.nativeEvent.offsetX, e.nativeEvent.offsetY])
    }

    function reset(){
        setMode('draw')
        setPen('up')
        setLineWidth(10)
        setPenColor('black')
        loadImage()
    }

    return (
        <>
            <div style={styles.maindiv}>
                <canvas id="imageCanvas" ref={canvasRef} width="800px" height="600px" style={styles.canvas} 
                    onMouseMove={(e)=>drawing(e)} 
                    onMouseDown={(e)=>penDown(e)} 
                    onMouseUp={(e)=>setPen('up')}>
                </canvas>
                <div>
                    <Button onClick={(e)=>setMode('draw')} style={styles.button}>Draw</Button>
                    <Button onClick={(e)=>setMode('erase')} style={styles.button}>Erase</Button>
                    <Button onClick={(e)=>setLineWidth(prev => prev += 5)} style={styles.button}>Pen Size +</Button>
                    <Button onClick={(e)=>setLineWidth(prev => prev -= 5)} style={styles.button}>Pen Size -</Button>
                    <Button onClick={()=>reset()} style={styles.button}>Reset</Button>
                </div>
                <div>
                    <Button style={Object.assign({}, styles.colorSwatches.red, styles.button)} onClick={()=>setPenColor('red')}>Red</Button>
                    <Button style={Object.assign({}, styles.colorSwatches.orange, styles.button)} onClick={()=>setPenColor('orange')}>Orange</Button>
                    <Button style={Object.assign({}, styles.colorSwatches.yellow, styles.button)} onClick={()=>setPenColor('yellow')}>Yellow</Button>
                    <Button style={Object.assign({}, styles.colorSwatches.green, styles.button)} onClick={()=>setPenColor('green')}>Green</Button>
                    <Button style={Object.assign({}, styles.colorSwatches.blue, styles.button)} onClick={()=>setPenColor('blue')}>Blue</Button>
                    <Button style={Object.assign({}, styles.colorSwatches.purple, styles.button)} onClick={()=>setPenColor('purple')}>Purple</Button>
                    <Button style={Object.assign({}, styles.colorSwatches.black, styles.button)} onClick={()=>setPenColor('black')}>Black</Button>
                </div>
            </div>
        </>
    )
}

export default Draw

async function getBase64ImageFromUrl(imageUrl) {
    var res = await fetch("https://cors-anywhere.herokuapp.com/" + imageUrl, {mode: 'cors', headers: {"Access-Control-Allow-Origin": "*"}});
    var blob = await res.blob();
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }