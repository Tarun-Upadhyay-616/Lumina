
import * as fabric from 'fabric';

export const addRectangle = (canvas) => {
  if (!canvas) return;

  const rect = new fabric.Rect({
    left: 100,
    top: 100,
    width: 100,
    height: 60,
    fill: 'transparent', 
    stroke: 'white',
    strokeWidth: 1,
    selectable: true
  });
  
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.renderAll();
}

export const addCircle = (canvas) => {
  if (!canvas) return;

  const circle = new fabric.Circle({
    left: 150,
    top: 150,
    radius: 50,
    fill: 'transparent',
    stroke: 'white',
    strokeWidth: 1,
    selectable: true
  });

  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.renderAll();
}

export const addTriangle = (canvas) => {
  if (!canvas) return;

  const triangle = new fabric.Triangle({
    left: 200,
    top: 200,
    width: 100,
    height: 100,
    fill: 'transparent',
    stroke: 'white',
    strokeWidth: 1,
    selectable: true
  });

  canvas.add(triangle);
  canvas.setActiveObject(triangle);
  canvas.renderAll();
}