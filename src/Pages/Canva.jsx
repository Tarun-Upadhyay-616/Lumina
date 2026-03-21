import React, { useEffect, useRef } from 'react'
import * as fabric from 'fabric';

const Canva = () => {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)

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

        const handleResize = () => {
          if (containerRef.current) {
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            canvas.setDimensions({ width, height });
            canvas.renderAll();
          }
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return ()=>{
            window.removeEventListener('resize', handleResize);
            canvas.dispose()
        }
    },[])

  return (
    <div ref={containerRef} className="w-full h-screen bg-black overflow-hidden">
        <canvas ref={canvasRef} />
    </div>
  )
}

export default Canva