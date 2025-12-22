import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { FaDownload, FaMousePointer, FaTextHeight, FaUndo, FaRedo, FaTrash, FaPencilAlt, FaFilter } from 'react-icons/fa';
import { IoShapesOutline } from "react-icons/io5";
import { BiImageAdd } from 'react-icons/bi';
import { addRectangle, addCircle, addTriangle } from '../Components/AddShapes';
import { SettingsPanel, ShapesMenu } from '../Components/EditorComponents';

const ToolButton = ({ icon: Icon, label, onclick, isActive }) => (
    <button
        onClick={onclick}
        title={label}
        className={`w-full py-3 px-2 flex flex-col items-center space-y-1 rounded-lg transition-colors duration-150 
            ${isActive
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                : 'text-gray-300 hover:bg-gray-700 hover:text-cyan-400'
            }`}
    >
        <Icon className="text-xl" />
        <span className="text-xs font-medium">{label}</span>
    </button>
)

const EditorLayout = () => {
    const canvasRef = useRef(null)
    const fabricCanvasRef = useRef(null)
    const fileref = useRef(null)
    const [activeTool, setActiveTool] = useState('select')
    const [selectedObject, setSelectedObject] = useState('')
    const [showShapesDropdown, setShowShapesDropdown] = useState(false)
    const [brushSettings, setBrushSettings] = useState({
        stroke: '#ffffff',
        strokeWidth: 2
    });
    const [image, setImage] = useState(null)

    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 500,
            backgroundColor: '#1e293b',
            isDrawingMode: false,
        })
        fabricCanvasRef.current = canvas


        const handleSelection = (e) => {
            if (canvas.isDrawingMode) return
            const selection = e.selected ? e.selected[0] : null
            setSelectedObject(selection ? { ...selection } : null)
        }

        const handleModification = () => {
            const activeObject = canvas.getActiveObject()
            if (activeObject) {
                setSelectedObject(Object.assign({}, activeObject))
            }

        }
        canvas.on('selection:created', handleSelection)
        canvas.on('selection:updated', handleSelection)
        canvas.on('selection:cleared', () => setSelectedObject(null))
        canvas.on('object:modified', handleModification)
        canvas.on('object:scaling', handleModification);


        canvas.on('path:created');

        return () => {
            canvas.dispose();
            fabricCanvasRef.current = null;
        };

    }, [])

    const activateSelectMode = () => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return

        canvas.isDrawingMode = false
        setActiveTool('select')
    }
    const activateDrawingMode = () => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return

        canvas.isDrawingMode = true
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
        canvas.freeDrawingBrush.color = brushSettings.stroke
        canvas.freeDrawingBrush.width = brushSettings.strokeWidth

        canvas.discardActiveObject()
        canvas.requestRenderAll()
        setActiveTool('draw')
        setSelectedObject(null)
    }
    const handleShapeSelect = (shapeType) => {
        activateSelectMode()
        const canvas = fabricCanvasRef.current
        if (shapeType == "rect") addRectangle(canvas)
        if (shapeType == "circle") addCircle(canvas)
        if (shapeType == "triangle") addTriangle(canvas)

        setShowShapesDropdown(false)
    }
    const handleSettingsUpdate = (key, value) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;


        if (activeTool === 'draw') {
            const newSettings = { ...brushSettings, [key]: value };
            setBrushSettings(newSettings);


            if (key === 'stroke') canvas.freeDrawingBrush.color = value;
            if (key === 'strokeWidth') canvas.freeDrawingBrush.width = value;
            return;
        }


        const activeObj = canvas.getActiveObject();
        if (!activeObj) return;

        if (key === 'width') {
            activeObj.set({ scaleX: value / activeObj.width });
        } else if (key === 'height') {
            activeObj.set({ scaleY: value / activeObj.height });
        } else {
            activeObj.set(key, value);
        }

        activeObj.setCoords();
        canvas.requestRenderAll();
        setSelectedObject(Object.assign({}, activeObj));
    };
    const getSettingsObject = () => {
        if (activeTool === 'draw') {
            return {
                stroke: brushSettings.stroke,
                strokeWidth: brushSettings.strokeWidth,
                fill: 'transparent'
            };
        }
        return selectedObject;
    };
    const handleImageChange = async (event) => {
        const file = event.target.files[0]
        if (!file) return
        const objectUrl = URL.createObjectURL(file);
        setImage(objectUrl);
        event.target.value = '' 
    }
    const handleImage = () => {
        fileref.current.click()
    }
    const handleDelete = () => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return

        const activeObjects = canvas.getActiveObjects()
        if (activeObjects.length > 0) {
            activeObjects.forEach((obj) => {
                canvas.remove(obj)
            })
            canvas.discardActiveObject()
            canvas.requestRenderAll()
            setSelectedObject(null)
        }
    }

    const handleFilter = () => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return

        const activeObj = canvas.getActiveObject()
        if (activeObj && activeObj.isType('image')) {
            activeObj.filters.push(new fabric.filters.Grayscale())
            activeObj.applyFilters()
            canvas.requestRenderAll()
        }
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            if (e.key === 'Delete' || e.key === 'Backspace') {
                handleDelete();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const canvas = fabricCanvasRef.current
        if (!canvas || !image) return

        fabric.FabricImage.fromURL(image).then((img) => {
            img.set({
                top: 50,
                left: 50,
            })
            if (img.width > 400) {
                img.scaleToWidth(400)
            }
            canvas.add(img)
            canvas.setActiveObject(img)
            canvas.requestRenderAll()
            setImage(null)
        }).catch(err => {
            console.error("Error loading image:", err)
        })
    }, [image])

    return (
        <div className="min-h-screen flex bg-gray-900 text-white p-4 overflow-hidden">

            <div className="relative z-10">
                <div className="w-20 bg-gray-800 rounded-2xl shadow-2xl shadow-cyan-900/50 p-4 px-2 space-y-4 border border-gray-700 flex-shrink-0 h-full">
                    <div className="text-center mb-4">
                        <h3 className='text-sm font-bold text-cyan-400'>TOOLS</h3>
                    </div>

                    <div className="space-y-3">
                        <ToolButton
                            icon={FaMousePointer}
                            label="Select"
                            isActive={activeTool === 'select'}
                            onclick={activateSelectMode}
                        />
                        <ToolButton
                            icon={FaPencilAlt}
                            label="Draw"
                            isActive={activeTool === 'draw'}
                            onclick={activateDrawingMode}
                        />

                        <div className='relative'>
                            <ToolButton
                                icon={IoShapesOutline}
                                label="Shapes"
                                onclick={() => setShowShapesDropdown(!showShapesDropdown)}
                                isActive={showShapesDropdown}
                            />

                        </div>

                        <ToolButton icon={FaTextHeight} label="Text" />
                        <input type="file" className='hidden' ref={fileref} onChange={handleImageChange} accept="image/*" />
                        <ToolButton icon={BiImageAdd} label="Image" onclick={handleImage} />
                        <ToolButton icon={FaFilter} label="Gray" onclick={handleFilter} />
                        <ToolButton icon={FaTrash} label="Delete" onclick={handleDelete} />
                    </div>
                    {showShapesDropdown && <ShapesMenu
                        onSelectShape={handleShapeSelect}
                        onClose={() => setShowShapesDropdown(false)}
                    />}
                </div>


            </div>


            <div className="grow flex flex-col items-center ml-4 space-y-4 relative">
                <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl shadow-cyan-900/50 p-3 flex justify-between items-center border border-gray-700">
                    <h2 className='text-xl font-extrabold text-cyan-400'>Lumina Editor</h2>
                    <button className="flex items-center space-x-2 py-2 px-4 rounded-xl text-md font-bold text-gray-900 bg-cyan-400 hover:bg-cyan-300 transition duration-200">
                        <FaDownload />
                        <span>Export</span>
                    </button>
                </div>

                <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-cyan-900/50 p-8 border border-gray-700 flex justify-center items-center overflow-auto">
                    <div className="shadow-2xl border border-gray-600">
                        <canvas ref={canvasRef} className='z-100' />
                    </div>
                </div>
            </div>

            <div className="w-72 ml-4 flex flex-col">
                <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-cyan-900/50 border border-gray-700 h-full overflow-hidden">
                    <SettingsPanel
                        selectedObject={getSettingsObject()}
                        isDrawingMode={activeTool === 'draw'}
                        onUpdate={handleSettingsUpdate}
                    />
                </div>
            </div>

        </div>
    )
}

export default EditorLayout