import React, { useEffect, useRef } from 'react'
import * as fabric from 'fabric';

const Canva = () => {
    const canvasRef = useRef(null)
    useEffect(()=>{
        const canvas = new fabric.Canvas(canvasRef.current)

        const rect = new fabric.Rect({
            left:100,
            top: 100,
            fill : "red",
            width: 200,
            height: 200
        })
        canvas.add(rect)

        return ()=>{
            canvas.dispose()
        }
    },[])
  return (
    <canvas className='bg-black' ref={canvasRef} width={600} height={400}/>
  )
}

export default Canva
