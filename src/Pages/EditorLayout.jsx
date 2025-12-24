import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { 
    FaMousePointer, FaPencilAlt, FaShapes, FaFont, FaImage, 
    FaLayerGroup, FaDownload, FaUndo, FaRedo, 
    FaTrash, FaEye, FaLock, FaBold, FaItalic, FaUnderline, FaArrowUp, FaArrowDown
} from 'react-icons/fa';
import { IoMdColorFilter } from "react-icons/io";
import { RiDragDropLine, RiShadowLine } from "react-icons/ri";
import { addRectangle, addCircle, addTriangle } from '../Components/AddShapes';

const ToolButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        title={label}
        className={`w-full py-3 px-2 flex flex-col items-center space-y-1 rounded-lg transition-colors duration-150 
            ${isActive
                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                : 'text-gray-400 hover:bg-gray-700 hover:text-cyan-400'
            }`}
    >
        <Icon className="text-xl" />
        <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
);

const IconButton = ({ icon: Icon, title, onClick, isActive }) => (
    <button 
        onClick={onClick} 
        title={title}
        className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-700'}`}
    >
        <Icon />
    </button>
);

const PropertyGroup = ({ title, children }) => (
    <div className="border-b border-gray-700 pb-4 mb-4 last:border-0">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{title}</h4>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const RangeSlider = ({ label, value, onChange, min = 0, max = 100 }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-300">
            <span>{label}</span>
            <span className="text-cyan-400">{value}</span>
        </div>
        <input 
            type="range" 
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
        />
    </div>
);

const ColorPicker = ({ label, color, onChange }) => (
    <div className="flex items-center justify-between">
        <span className="text-xs text-gray-300">{label}</span>
        <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 uppercase">{color}</span>
            <input 
                type="color" 
                value={color || '#000000'}
                onChange={onChange}
                className="w-6 h-6 rounded border border-gray-600 cursor-pointer bg-transparent" 
            />
        </div>
    </div>
);

const InputField = ({ label, value, onChange, type = "text" }) => (
    <div className="flex items-center justify-between space-x-2">
        <span className="text-xs text-gray-300 whitespace-nowrap">{label}</span>
        <input 
            type={type} 
            value={value || ''} 
            onChange={onChange}
            className="w-16 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-right text-white focus:border-cyan-500 outline-none" 
        />
    </div>
);

const EditorLayout = () => {
    const canvasRef = useRef(null)
    const fabricCanvasRef = useRef(null)
    const fileref = useRef(null)
    const [activeTool, setActiveTool] = useState('select')
    const [activePanel, setActivePanel] = useState('properties')
    const [selectedObject, setSelectedObject] = useState(null)
    const [showShapesMenu, setShowShapesMenu] = useState(false)
    const [layers, setLayers] = useState([]) 
  
    const [brushSettings, setBrushSettings] = useState({
        stroke: '#ffffff',
        strokeWidth: 2
    });
    
    const [shadowSettings, setShadowSettings] = useState({
        color: '#000000',
        blur: 10,
        offsetX: 5,
        offsetY: 5,
        enabled: false
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

        const updateSelection = () => {
            if (canvas.isDrawingMode) return
            const active = canvas.getActiveObject()
            
            if (active) {
                const s = active.shadow;
                setShadowSettings({
                    enabled: !!s,
                    color: s ? s.color : '#000000',
                    blur: s ? s.blur : 10,
                    offsetX: s ? s.offsetX : 5,
                    offsetY: s ? s.offsetY : 5
                });
                setSelectedObject({ ...active }) 
            } else {
                setSelectedObject(null)
            }
        }

        const updateLayers = () => {
            
            const objs = canvas.getObjects();
            setLayers([...objs].reverse()); 
        }

        canvas.on('selection:created', updateSelection)
        canvas.on('selection:updated', updateSelection)
        canvas.on('selection:cleared', updateSelection)
        canvas.on('object:modified', updateSelection)
        canvas.on('object:scaling', updateSelection)

        canvas.on('object:added', updateLayers)
        canvas.on('object:removed', updateLayers)
        canvas.on('object:modified', updateLayers)

        return () => {
            canvas.dispose()
            fabricCanvasRef.current = null
        }
    }, [])

    useEffect(() => {
        const canvas = fabricCanvasRef.current
        if (!canvas || !image) return

        fabric.FabricImage.fromURL(image).then((img) => {
            img.set({ top: 50, left: 50 })
            if (img.width > 400) img.scaleToWidth(400)
            canvas.add(img)
            canvas.setActiveObject(img)
            canvas.requestRenderAll()
            setImage(null)
        }).catch(err => console.error(err))
    }, [image])

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

    const handleAddText = () => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return
        const text = new fabric.IText('Double click to edit', {
            left: 100, top: 100,
            fontFamily: 'Arial',
            fill: '#ffffff',
            fontSize: 24
        })
        canvas.add(text)
        canvas.setActiveObject(text)
        activateSelectMode()
    }

    const handleShapeSelect = (shapeType) => {
        activateSelectMode()
        const canvas = fabricCanvasRef.current
        if (shapeType === "rect") addRectangle(canvas)
        if (shapeType === "circle") addCircle(canvas)
        if (shapeType === "triangle") addTriangle(canvas)
        setShowShapesMenu(false)
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        if (!file) return
        const objectUrl = URL.createObjectURL(file)
        setImage(objectUrl)
        event.target.value = ''
    }

    const handleDelete = () => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return
        const activeObjects = canvas.getActiveObjects()
        if (activeObjects.length > 0) {
            activeObjects.forEach((obj) => canvas.remove(obj))
            canvas.discardActiveObject()
            canvas.requestRenderAll()
            setSelectedObject(null)
        }
    }

    const handleGenericUpdate = (key, value) => {
        const canvas = fabricCanvasRef.current
        if (!canvas) return

        if (activeTool === 'draw') {
            setBrushSettings(prev => ({ ...prev, [key]: value }))
            if (key === 'stroke') canvas.freeDrawingBrush.color = value
            if (key === 'strokeWidth') canvas.freeDrawingBrush.width = parseInt(value, 10)
            return
        }

        const activeObj = canvas.getActiveObject()
        if (!activeObj) return

        if (key === 'width') activeObj.set({ scaleX: value / activeObj.width })
        else if (key === 'height') activeObj.set({ scaleY: value / activeObj.height })
        else activeObj.set(key, value)
        
        activeObj.setCoords()
        canvas.requestRenderAll()
        setSelectedObject({ ...activeObj })
    }

    const handleShadowUpdate = (key, value) => {
        const canvas = fabricCanvasRef.current
        const activeObj = canvas?.getActiveObject()
        if (!activeObj) return

        const newSettings = { ...shadowSettings, [key]: value }
        setShadowSettings(newSettings)

        if (newSettings.enabled) {
            activeObj.set('shadow', new fabric.Shadow({
                color: newSettings.color,
                blur: newSettings.blur,
                offsetX: newSettings.offsetX,
                offsetY: newSettings.offsetY
            }))
        } else {
            activeObj.set('shadow', null)
        }
        canvas.requestRenderAll()
    }

    const handleTextUpdate = (prop, value) => {
        const canvas = fabricCanvasRef.current
        const activeObj = canvas?.getActiveObject()
        if (!activeObj || activeObj.type !== 'i-text') return

        if (prop === 'bold') {
            activeObj.set('fontWeight', activeObj.fontWeight === 'bold' ? 'normal' : 'bold')
        } else if (prop === 'italic') {
            activeObj.set('fontStyle', activeObj.fontStyle === 'italic' ? 'normal' : 'italic')
        } else if (prop === 'underline') {
            activeObj.set('underline', !activeObj.underline)
        } else {
            activeObj.set(prop, value)
        }
        canvas.requestRenderAll()
        setSelectedObject({ ...activeObj })
    }

    const handleFilterApply = (filterType) => {
        const canvas = fabricCanvasRef.current
        const activeObj = canvas?.getActiveObject()
        if (!activeObj || !activeObj.isType('image')) return
        let filter = null;
        switch(filterType) {
            case 'Grayscale': filter = new fabric.filters.Grayscale(); break;
            case 'Sepia': filter = new fabric.filters.Sepia(); break;
            case 'Invert': filter = new fabric.filters.Invert(); break;
            case 'Blur': filter = new fabric.filters.Blur({ blur: 0.5 }); break;
            case 'Noise': filter = new fabric.filters.Noise({ noise: 100 }); break;
            case 'Pixelate': filter = new fabric.filters.Pixelate({ blocksize: 8 }); break;
            default: break;
        }

        if (filter) {
            activeObj.filters.push(filter)
            activeObj.applyFilters()
            canvas.requestRenderAll()
        }
    }
    const ColorFill = ()=>{
        const canvas = fabricCanvasRef.current
        const activeObj = canvas.getActiveObject()
        const colorBucket = fabric.Color('#ffffff')
        
    }
    
    const handleLayerAction = (action, index) => {
         const canvas = fabricCanvasRef.current;
         if (!canvas) return;
         
         const objects = canvas.getObjects();
         const actualIndex = objects.length - 1 - index;
         const obj = objects[actualIndex];
         
         if (!obj) return;
         
         if (action === 'up') obj.bringForward();
         if (action === 'down') obj.sendBackwards();
         if (action === 'delete') canvas.remove(obj);
         
         canvas.requestRenderAll();
    }


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
            if (e.key === 'Delete' || e.key === 'Backspace') handleDelete()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <div className="min-h-screen flex bg-gray-900 text-white overflow-hidden font-sans">

            <div className="w-20 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 z-20 shadow-xl">
                <div className="mb-6">
                    <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <FaShapes className="text-xl text-white" />
                    </div>
                </div>
                
                <div className="flex-1 w-full px-2 space-y-2 overflow-y-auto scrollbar-hide">
                    <ToolButton icon={FaMousePointer} label="Select" isActive={activeTool === 'select'} onClick={activateSelectMode} />
                    <ToolButton icon={FaPencilAlt} label="Draw" isActive={activeTool === 'draw'} onClick={activateDrawingMode} />
                    
                    <div className="relative w-full">
                        <ToolButton icon={FaShapes} label="Shapes" isActive={showShapesMenu} onClick={() => setShowShapesMenu(!showShapesMenu)} />
                        {showShapesMenu && (
                            <div className="absolute left-16 top-0 bg-gray-800 border border-gray-600 rounded-lg p-2 shadow-xl flex flex-col gap-2 w-32 z-50">
                                <button onClick={() => handleShapeSelect('rect')} className="text-sm hover:text-cyan-400 text-left p-1">Rectangle</button>
                                <button onClick={() => handleShapeSelect('circle')} className="text-sm hover:text-cyan-400 text-left p-1">Circle</button>
                                <button onClick={() => handleShapeSelect('triangle')} className="text-sm hover:text-cyan-400 text-left p-1">Triangle</button>
                            </div>
                        )}
                    </div>

                    <ToolButton icon={FaFont} label="Text" isActive={activeTool === 'text'} onClick={handleAddText} />
                    
                    <input type="file" className='hidden' ref={fileref} onChange={handleImageChange} accept="image/*" />
                    <ToolButton icon={FaImage} label="Image" isActive={activeTool === 'image'} onClick={() => fileref.current.click()} />
                    
                    <div className="w-full h-px bg-gray-700 my-2"></div>
                    <ToolButton icon={IoMdColorFilter} label="Filters" isActive={activePanel === 'filters'} onClick={() => setActivePanel('filters')} />
                    <ToolButton icon={FaLayerGroup} label="Layers" isActive={activePanel === 'layers'} onClick={() => setActivePanel('layers')} />
                </div>
                <div className="mt-4 px-2 w-full space-y-2">
                     <ToolButton icon={FaTrash} label="Delete" onClick={handleDelete} />
                </div>
            </div>


            <div className="flex-1 flex flex-col relative">
                <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 shadow-md z-10">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-lg font-bold tracking-tight">
                            <span className="text-cyan-400">Lumina</span> Studio
                        </h2>
                    </div>
                    <div className="flex items-center space-x-4">
                         <button className="flex items-center space-x-2 py-1.5 px-4 rounded-lg text-sm font-bold text-gray-900 bg-cyan-400 hover:bg-cyan-300 transition shadow-lg shadow-cyan-500/20">
                            <FaDownload /> <span>Export</span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 bg-gray-900 overflow-hidden relative flex items-center justify-center p-8">
                    <div className="absolute inset-0 opacity-5 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>
                    <div className="relative shadow-2xl shadow-black/50 border border-gray-700 bg-[#1e293b] flex items-center justify-center">
                        <canvas ref={canvasRef} />
                    </div>
                </main>
            </div>

            <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col z-20 shadow-xl">
                <div className="flex border-b border-gray-700">
                    <button onClick={() => setActivePanel('properties')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activePanel === 'properties' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-700/50' : 'text-gray-400 hover:text-gray-200'}`}>Properties</button>
                    <button onClick={() => setActivePanel('layers')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-colors ${activePanel === 'layers' ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-700/50' : 'text-gray-400 hover:text-gray-200'}`}>Layers</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {activePanel === 'properties' && (
                        <>
                            {activeTool === 'draw' ? (
                                <PropertyGroup title="Brush Settings">
                                    <ColorPicker label="Color" color={brushSettings.stroke} onChange={(e) => handleGenericUpdate('stroke', e.target.value)} />
                                    <RangeSlider label="Width" value={brushSettings.strokeWidth} min={1} max={50} onChange={(e) => handleGenericUpdate('strokeWidth', parseInt(e.target.value))} />
                                </PropertyGroup>
                            ) : selectedObject ? (
                                <>
                                    <PropertyGroup title="Transform">
                                        <div className="grid grid-cols-2 gap-2">
                                            <InputField label="X" value={Math.round(selectedObject.left)} onChange={(e) => handleGenericUpdate('left', parseInt(e.target.value))} />
                                            <InputField label="Y" value={Math.round(selectedObject.top)} onChange={(e) => handleGenericUpdate('top', parseInt(e.target.value))} />
                                            <InputField label="W" value={Math.round(selectedObject.width * selectedObject.scaleX)} onChange={(e) => handleGenericUpdate('width', parseInt(e.target.value))} />
                                            <InputField label="H" value={Math.round(selectedObject.height * selectedObject.scaleY)} onChange={(e) => handleGenericUpdate('height', parseInt(e.target.value))} />
                                        </div>
                                    </PropertyGroup>

                                    {selectedObject.type === 'i-text' && (
                                        <PropertyGroup title="Typography">
                                            <div className="flex space-x-2 mb-2">
                                                <IconButton icon={FaBold} title="Bold" isActive={selectedObject.fontWeight === 'bold'} onClick={() => handleTextUpdate('bold')} />
                                                <IconButton icon={FaItalic} title="Italic" isActive={selectedObject.fontStyle === 'italic'} onClick={() => handleTextUpdate('italic')} />
                                                <IconButton icon={FaUnderline} title="Underline" isActive={selectedObject.underline} onClick={() => handleTextUpdate('underline')} />
                                            </div>
                                            <select 
                                                className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1 text-xs text-white mb-2"
                                                value={selectedObject.fontFamily}
                                                onChange={(e) => handleTextUpdate('fontFamily', e.target.value)}
                                            >
                                                <option value="Arial">Arial</option>
                                                <option value="Times New Roman">Times New Roman</option>
                                                <option value="Courier New">Courier New</option>
                                            </select>
                                        </PropertyGroup>
                                    )}

                                    <PropertyGroup title="Appearance">
                                        <RangeSlider label="Opacity" value={selectedObject.opacity * 100} onChange={(e) => handleGenericUpdate('opacity', parseInt(e.target.value) / 100)} />
                                    </PropertyGroup>

                                    <PropertyGroup title="Fill & Stroke">
                                        <ColorPicker label="Fill" color={selectedObject.fill} onChange={(e) => handleGenericUpdate('fill', e.target.value)} />
                                        <ColorPicker label="Stroke" color={selectedObject.stroke || '#000000'} onChange={(e) => handleGenericUpdate('stroke', e.target.value)} />
                                        <RangeSlider label="Stroke Width" value={selectedObject.strokeWidth || 0} min={0} max={20} onChange={(e) => handleGenericUpdate('strokeWidth', parseInt(e.target.value))} />
                                    </PropertyGroup>

                                    <PropertyGroup title="Shadows">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-300">Enable Shadow</span>
                                            <input 
                                                type="checkbox" 
                                                checked={shadowSettings.enabled} 
                                                onChange={(e) => handleShadowUpdate('enabled', e.target.checked)}
                                                className="toggle-checkbox accent-cyan-500" 
                                            />
                                        </div>
                                        {shadowSettings.enabled && (
                                            <>
                                                <ColorPicker label="Color" color={shadowSettings.color} onChange={(e) => handleShadowUpdate('color', e.target.value)} />
                                                <RangeSlider label="Blur" value={shadowSettings.blur} min={0} max={50} onChange={(e) => handleShadowUpdate('blur', parseInt(e.target.value))} />
                                                <RangeSlider label="Offset X" value={shadowSettings.offsetX} min={-50} max={50} onChange={(e) => handleShadowUpdate('offsetX', parseInt(e.target.value))} />
                                                <RangeSlider label="Offset Y" value={shadowSettings.offsetY} min={-50} max={50} onChange={(e) => handleShadowUpdate('offsetY', parseInt(e.target.value))} />
                                            </>
                                        )}
                                    </PropertyGroup>
                                </>
                            ) : (
                                <div className="text-gray-500 text-sm text-center mt-10">Select an object or choose a tool</div>
                            )}
                        </>
                    )}

                    {activePanel === 'filters' && (
                        <PropertyGroup title="Image Filters">
                             <div className="grid grid-cols-3 gap-2">
                                {['Grayscale', 'Sepia', 'Invert', 'Blur', 'Noise', 'Pixelate'].map(f => (
                                    <button key={f} onClick={() => handleFilterApply(f)} className="bg-gray-700 hover:bg-cyan-900/30 hover:text-cyan-400 border border-gray-600 rounded-lg p-2 flex flex-col items-center gap-1 transition-all">
                                        <IoMdColorFilter className="text-lg" />
                                        <span className="text-[10px]">{f}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2 text-center">Select an image to apply filters</p>
                        </PropertyGroup>
                    )}

                    {activePanel === 'layers' && (
                        <div className="space-y-1">
                            {layers.length === 0 && <div className="text-gray-500 text-xs text-center">No layers</div>}
                            {layers.map((obj, i) => (
                                <div key={i} className={`flex items-center p-2 rounded-lg ${obj === selectedObject ? 'bg-cyan-900/20 border border-cyan-500/30' : 'hover:bg-gray-700 border border-transparent'}`}>
                                    <div className="mr-2 text-gray-500"><RiDragDropLine /></div>
                                    <div className="w-8 h-8 bg-gray-900 border border-gray-600 rounded mr-3 flex items-center justify-center">
                                        {obj.type === 'i-text' ? <FaFont className="text-xs"/> : <FaShapes className="text-xs" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs text-white font-medium truncate">{obj.type}</div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button onClick={() => handleLayerAction('up', i)} className="p-1.5 text-gray-400 hover:text-white"><FaArrowUp size={10} /></button>
                                        <button onClick={() => handleLayerAction('down', i)} className="p-1.5 text-gray-400 hover:text-white"><FaArrowDown size={10} /></button>
                                        <button onClick={() => handleLayerAction('delete', i)} className="p-1.5 text-red-400 hover:text-red-300"><FaTrash size={10} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditorLayout;