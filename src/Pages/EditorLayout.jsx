import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import { 
    FaMousePointer, FaPencilAlt, FaShapes, FaFont, FaImage, 
    FaDownload, FaTrash, FaBold, FaItalic, 
    FaUnderline, FaArrowUp, FaArrowDown, FaChevronDown, FaLayerGroup
} from 'react-icons/fa';
import { IoMdColorFilter } from "react-icons/io";
import { addRectangle, addCircle, addTriangle } from '../Components/AddShapes';
import { ToolButton, IconButton, PropertyGroup, RangeSlider, ColorPicker, InputField } from './../Components/EditorComponents';

const EditorLayout = () => {
    const canvasRef = useRef(null)
    const fabricCanvasRef = useRef(null)
    const containerRef = useRef(null)
    const fileref = useRef(null)
    
 
    const [activeTool, setActiveTool] = useState('select')
    const [selectedObject, setSelectedObject] = useState(null)
    const [showShapesMenu, setShowShapesMenu] = useState(false)
    const [isPropertiesOpen, setIsPropertiesOpen] = useState(false)


    const [canvasBg, setCanvasBg] = useState('#ffffff');
    const [brushSettings, setBrushSettings] = useState({
        stroke: '#000000',
        strokeWidth: 5
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
        if (!canvasRef.current || !containerRef.current) return


        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 600, 
            backgroundColor: canvasBg, 
            isDrawingMode: false,
            preserveObjectStacking: true, 
        })
        fabricCanvasRef.current = canvas


        const resizeCanvas = () => {
            if (!containerRef.current || !canvas) return;
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;
            
            if (containerWidth === 0 || containerHeight === 0) return;

            const paddingX = window.innerWidth < 768 ? 20 : 60;
            const paddingY = window.innerWidth < 768 ? 80 : 60; // Extra bottom padding on mobile for toolbar

            const availableWidth = containerWidth - paddingX;
            const availableHeight = containerHeight - paddingY;
            
            const scaleX = availableWidth / 800;
            const scaleY = availableHeight / 600;
            const scale = Math.min(scaleX, scaleY, 0.95); 

            // Apply CSS Transform
            const canvasContainer = canvas.getElement().parentNode;
            if (canvasContainer) {
                canvasContainer.style.transform = `scale(${scale})`;
                canvasContainer.style.transformOrigin = 'center center';
                canvasContainer.style.border = '1px solid #334155'; 
                canvasContainer.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            }
            
            canvas.renderAll();
        };

        const resizeObserver = new ResizeObserver(() => resizeCanvas());
        resizeObserver.observe(containerRef.current);

        // 3. Selection Handlers
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
                if(window.innerWidth < 768) setIsPropertiesOpen(true); 
            } else {
                setSelectedObject(null)
                if (activeTool !== 'draw') setIsPropertiesOpen(false);
            }
        }

        canvas.on('selection:created', updateSelection)
        canvas.on('selection:updated', updateSelection)
        canvas.on('selection:cleared', updateSelection)
        canvas.on('object:modified', () => updateSelection())

        // 4. Force Render on Mount (Fixes white area issue)
        resizeCanvas();
        setTimeout(() => {
            resizeCanvas();
            canvas.renderAll();
        }, 100);

        return () => {
            resizeObserver.disconnect();
            canvas.dispose()
            fabricCanvasRef.current = null
        }
    }, []) 

    // Update background color if state changes
    useEffect(() => {
        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.backgroundColor = canvasBg;
            fabricCanvasRef.current.requestRenderAll();
        }
    }, [canvasBg]);

    useEffect(() => {
        const canvas = fabricCanvasRef.current
        if (!canvas || !image) return
        fabric.FabricImage.fromURL(image).then((img) => {
            img.scaleToWidth(300)
            canvas.add(img)
            canvas.centerObject(img)
            canvas.setActiveObject(img)
            setImage(null)
        })
    }, [image])

    // --- Handlers ---
    const handleCanvasBgChange = (e) => {
        setCanvasBg(e.target.value);
    };

    const activateSelectMode = () => {
        if (!fabricCanvasRef.current) return
        fabricCanvasRef.current.isDrawingMode = false
        setActiveTool('select')
        setIsPropertiesOpen(false)
    }

    const activateDrawingMode = () => {
        if (!fabricCanvasRef.current) return
        fabricCanvasRef.current.isDrawingMode = true
        fabricCanvasRef.current.freeDrawingBrush = new fabric.PencilBrush(fabricCanvasRef.current)
        fabricCanvasRef.current.freeDrawingBrush.color = brushSettings.stroke
        fabricCanvasRef.current.freeDrawingBrush.width = brushSettings.strokeWidth
        fabricCanvasRef.current.discardActiveObject()
        fabricCanvasRef.current.requestRenderAll()
        setActiveTool('draw')
        setSelectedObject(null)
        setIsPropertiesOpen(true) 
    }

    const handleShapeAdd = (type) => {
        activateSelectMode()
        const c = fabricCanvasRef.current
        if (type === "rect") addRectangle(c)
        if (type === "circle") addCircle(c)
        if (type === "triangle") addTriangle(c)
        setShowShapesMenu(false)
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

    // Helper to render the content of the Properties Panel
    const renderPropertiesContent = () => (
        <div className="space-y-4">
            {activeTool === 'filters' ? (
                <div className="grid grid-cols-4 gap-2">
                    {['Grayscale', 'Sepia', 'Invert', 'Blur', 'Noise', 'Pixelate'].map(f => (
                        <button key={f} className="bg-gray-700 hover:bg-cyan-600 rounded p-2 text-[10px] flex flex-col items-center gap-1">
                            <IoMdColorFilter size={16} /> {f}
                        </button>
                    ))}
                </div>
            ) : activeTool === 'draw' ? (
                <PropertyGroup title="Brush Settings">
                    <ColorPicker label="Color" color={brushSettings.stroke} onChange={(e) => handleGenericUpdate('stroke', e.target.value)} />
                    <RangeSlider label="Size" value={brushSettings.strokeWidth} min={1} max={50} onChange={(e) => handleGenericUpdate('strokeWidth', parseInt(e.target.value))} />
                </PropertyGroup>
            ) : selectedObject ? (
                <>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                         <div className="flex-1 min-w-[120px]">
                            <PropertyGroup title="Fill & Stroke">
                                <ColorPicker label="Fill" color={selectedObject.fill} onChange={(e) => handleGenericUpdate('fill', e.target.value)} />
                                <ColorPicker label="Stroke" color={selectedObject.stroke || '#000000'} onChange={(e) => handleGenericUpdate('stroke', e.target.value)} />
                            </PropertyGroup>
                         </div>
                         <div className="flex-1 min-w-[120px]">
                             <PropertyGroup title="Transform">
                                <RangeSlider label="Opacity" value={selectedObject.opacity * 100} onChange={(e) => handleGenericUpdate('opacity', parseInt(e.target.value) / 100)} />
                                <RangeSlider label="Rotate" value={selectedObject.angle} min={0} max={360} onChange={(e) => handleGenericUpdate('angle', parseInt(e.target.value))} />
                             </PropertyGroup>
                         </div>
                    </div>
                    
                    {selectedObject.type === 'i-text' && (
                        <PropertyGroup title="Text Style">
                             <div className="flex justify-around bg-gray-900 p-2 rounded">
                                <IconButton icon={FaBold} isActive={selectedObject.fontWeight === 'bold'} onClick={() => {}} />
                                <IconButton icon={FaItalic} isActive={selectedObject.fontStyle === 'italic'} onClick={() => {}} />
                                <IconButton icon={FaUnderline} isActive={selectedObject.underline} onClick={() => {}} />
                             </div>
                        </PropertyGroup>
                    )}
                </>
            ) : (
                <PropertyGroup title="Canvas Background">
                    <ColorPicker label="Color" color={canvasBg} onChange={handleCanvasBgChange} />
                </PropertyGroup>
            )}
        </div>
    );

    return (
      
        <div className="fixed inset-0 h-[100dvh] w-full flex flex-col bg-gray-950 text-white font-sans overflow-hidden overscroll-none">
       
            <header className="h-14 bg-gray-900/95 backdrop-blur border-b border-gray-800 flex items-center justify-between px-4 z-50 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded flex items-center justify-center">
                         <FaShapes className="text-white text-sm" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">Lumina</span>
                </div>
                <button 
                    onClick={() => {
                        const link = document.createElement('a');
                        link.download = 'art.jpg';
                        link.href = fabricCanvasRef.current?.toDataURL({ format: 'jpeg', quality: 0.8 });
                        link.click();
                    }}
                    className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-transform active:scale-95"
                >
                    <FaDownload /> Export
                </button>
            </header>

        
            <div className="flex-1 flex flex-row overflow-hidden relative">

                
                <div className={`
                    bg-gray-900 border-r border-gray-800 z-40
                    /* Desktop Styles: Relative, Width 20 */
                    hidden md:flex md:flex-col md:w-20 md:relative md:h-full md:py-4
                `}>
             
                    <div className="flex flex-col gap-4 items-center w-full">
                        <ToolButton icon={FaMousePointer} label="Select" isActive={activeTool === 'select'} onClick={activateSelectMode} />
                        <ToolButton icon={FaPencilAlt} label="Draw" isActive={activeTool === 'draw'} onClick={activateDrawingMode} />
                        
                        <div className="relative">
                            <ToolButton icon={FaShapes} label="Shapes" isActive={showShapesMenu} onClick={() => setShowShapesMenu(!showShapesMenu)} />
                            {showShapesMenu && (
                                <div className="absolute left-14 top-0 bg-gray-800 border border-gray-700 rounded-lg p-2 shadow-xl flex flex-col gap-2 w-32 z-50 animate-in fade-in zoom-in duration-200">
                                    <button onClick={() => handleShapeAdd('rect')} className="text-sm hover:text-cyan-400 text-left p-2 rounded hover:bg-gray-700">Rectangle</button>
                                    <button onClick={() => handleShapeAdd('circle')} className="text-sm hover:text-cyan-400 text-left p-2 rounded hover:bg-gray-700">Circle</button>
                                    <button onClick={() => handleShapeAdd('triangle')} className="text-sm hover:text-cyan-400 text-left p-2 rounded hover:bg-gray-700">Triangle</button>
                                </div>
                            )}
                        </div>

                        <ToolButton icon={FaFont} label="Text" onClick={() => {
                            const t = new fabric.IText('Text', { left: 100, top: 100, fill: '#000', fontSize: 40 });
                            fabricCanvasRef.current.add(t);
                            fabricCanvasRef.current.setActiveObject(t);
                            activateSelectMode();
                        }} />
                        
                        <input type="file" ref={fileref} className="hidden" onChange={(e) => {
                            const file = e.target.files[0];
                            if(file) setImage(URL.createObjectURL(file));
                        }} />
                        <ToolButton icon={FaImage} label="Image" onClick={() => fileref.current.click()} />
                        
                        <div className="w-10 h-px bg-gray-700 my-1"></div>

                        <ToolButton icon={IoMdColorFilter} label="Filters" isActive={activeTool === 'filters'} onClick={() => setActiveTool('filters')} />
                    </div>
                </div>

               
                <div className={`
                    md:hidden fixed bottom-0 left-0 w-full h-16 bg-gray-900 border-t border-gray-800 z-50
                    flex items-center justify-between px-4 overflow-x-auto no-scrollbar
                `}>
                     <ToolButton icon={FaMousePointer} label="Select" isActive={activeTool === 'select'} onClick={activateSelectMode} />
                     <ToolButton icon={FaPencilAlt} label="Draw" isActive={activeTool === 'draw'} onClick={activateDrawingMode} />
                     <div className="relative">
                        <ToolButton icon={FaShapes} label="Shapes" isActive={showShapesMenu} onClick={() => setShowShapesMenu(!showShapesMenu)} />
                        {showShapesMenu && (
                             <div className="absolute bottom-16 left-[-10px] bg-gray-800 border border-gray-700 rounded-lg p-2 shadow-xl flex flex-col gap-2 w-32 z-50 mb-2">
                                <button onClick={() => handleShapeAdd('rect')} className="text-sm hover:text-cyan-400 text-left p-2 rounded hover:bg-gray-700">Rectangle</button>
                                <button onClick={() => handleShapeAdd('circle')} className="text-sm hover:text-cyan-400 text-left p-2 rounded hover:bg-gray-700">Circle</button>
                                <button onClick={() => handleShapeAdd('triangle')} className="text-sm hover:text-cyan-400 text-left p-2 rounded hover:bg-gray-700">Triangle</button>
                            </div>
                        )}
                     </div>
                     <ToolButton icon={FaFont} label="Text" onClick={() => {
                         const t = new fabric.IText('Text', { left: 100, top: 100, fill: '#000', fontSize: 40 });
                         fabricCanvasRef.current.add(t);
                         fabricCanvasRef.current.setActiveObject(t);
                         activateSelectMode();
                     }} />
                     <ToolButton icon={IoMdColorFilter} label="Filters" isActive={activeTool === 'filters'} onClick={() => {
                        setActiveTool('filters');
                        setIsPropertiesOpen(true);
                    }} />
                    <button 
                        onClick={() => setIsPropertiesOpen(!isPropertiesOpen)} 
                        className={`flex flex-col items-center justify-center w-12 h-10 rounded-lg transition-colors ${isPropertiesOpen ? 'text-cyan-400' : 'text-gray-400'}`}
                    >
                        <FaLayerGroup size={18} />
                        <span className="text-[9px] mt-0.5">Props</span>
                    </button>
                </div>

              
                <main className="flex-1 relative bg-[#0f172a] overflow-hidden flex items-center justify-center z-10" ref={containerRef}>
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                        style={{ 
                            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
                            backgroundSize: '24px 24px' 
                        }}>
                    </div>
         
                    <div className="relative shadow-2xl">
                        <canvas ref={canvasRef} />
                    </div>
                </main>

               
                <div className="hidden md:flex w-80 bg-gray-900 border-l border-gray-800 flex-col z-20">
                    <div className="p-4 border-b border-gray-800 font-bold text-gray-400 uppercase text-xs tracking-wider">
                        Properties
                    </div>
                    <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
                        {renderPropertiesContent()}
                    </div>
                </div>

            </div>

            <div className={`
                md:hidden fixed left-0 right-0 z-40
                bg-gray-800 rounded-t-2xl border-t border-gray-700 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]
                transition-transform duration-300 ease-out will-change-transform
                ${isPropertiesOpen ? 'translate-y-0 bottom-[64px]' : 'translate-y-[110%] bottom-0'}
            `} style={{ maxHeight: '45vh' }}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800 rounded-t-2xl sticky top-0 z-10" onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                        {selectedObject ? 'Edit Object' : activeTool === 'draw' ? 'Brush Settings' : 'Canvas Settings'}
                    </span>
                    <button onClick={() => setIsPropertiesOpen(false)} className="p-1 text-gray-400">
                        <FaChevronDown />
                    </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[35vh] custom-scrollbar pb-6">
                    {renderPropertiesContent()}
                </div>
            </div>

        </div>
    );
};

export default EditorLayout;