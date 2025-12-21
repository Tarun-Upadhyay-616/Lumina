import React from 'react';
import { BsBoundingBoxCircles, BsCircle, BsTriangle } from 'react-icons/bs';

export const SettingsPanel = ({ selectedObject, onUpdate }) => {
    if (!selectedObject) {
        return (
            <div className="w-64 bg-gray-800 border-l border-gray-700 p-4 text-gray-400 text-sm flex items-center justify-center">
                Select an object to edit
            </div>
        );
    }
    const width = Math.round(selectedObject.width * selectedObject.scaleX);
    const height = Math.round(selectedObject.height * selectedObject.scaleY);
    const fill = selectedObject.fill;
    const stroke = selectedObject.stroke || '#ffffff';
    const strokeWidth = selectedObject.strokeWidth || 0;
    const handleChange = (key, value) => {
        onUpdate(key, value);
    };

    return (
        <div className="w-64 bg-gray-800 border-l border-gray-700 p-4 flex flex-col space-y-6 overflow-y-auto">
            <h3 className="text-cyan-400 font-bold text-lg border-b border-gray-700 pb-2">Properties</h3>

            <div className="space-y-3">
                <label className="text-gray-300 text-xs font-bold">DIMENSIONS</label>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <span className="text-gray-500 text-[10px]">W</span>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => handleChange('width', parseInt(e.target.value))}
                            className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:border-cyan-500 outline-none"
                        />
                    </div>
                    <div>
                        <span className="text-gray-500 text-[10px]">H</span>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => handleChange('height', parseInt(e.target.value))}
                            className="w-full bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:border-cyan-500 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-gray-300 text-xs font-bold">APPEARANCE</label>
                
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Fill Color</span>
                    <div className="flex items-center space-x-2">
                        <input
                            type="color"
                            value={fill === 'transparent' ? '#000000' : fill}
                            onChange={(e) => handleChange('fill', e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Stroke Color</span>
                    <input
                        type="color"
                        value={stroke}
                        onChange={(e) => handleChange('stroke', e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-none"
                    />
                </div>

                <div>
                    <span className="text-sm text-gray-400 mb-1 block">Stroke Width</span>
                    <input
                        type="range"
                        min="0"
                        max="20"
                        value={strokeWidth}
                        onChange={(e) => handleChange('strokeWidth', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        
                    />
                </div>
            </div>
        </div>
    );
};

export const ShapesMenu = ({ onSelectShape, onClose }) => {
    return (
        <div 
            className="absolute left-20 top-20 bg-gray-800 border border-gray-600 shadow-2xl rounded-lg p-2 z-50 flex flex-col space-y-2 w-32"
            onMouseLeave={onClose}
        >
            <button onClick={() => onSelectShape('rect')} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-cyan-400 transition">
                <BsBoundingBoxCircles /> <span>Rectangle</span>
            </button>
            <button onClick={() => onSelectShape('circle')} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-cyan-400 transition">
                <BsCircle /> <span>Circle</span>
            </button>
            <button onClick={() => onSelectShape('triangle')} className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-cyan-400 transition">
                <BsTriangle /> <span>Triangle</span>
            </button>
        </div>
    );
};