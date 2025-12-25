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
export const ToolButton = ({ icon: Icon, label, isActive, onClick }) => (
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

export const IconButton = ({ icon: Icon, title, onClick, isActive }) => (
    <button 
        onClick={onClick} 
        title={title}
        className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-700'}`}
    >
        <Icon />
    </button>
);

export const PropertyGroup = ({ title, children }) => (
    <div className="border-b border-gray-700 pb-4 mb-4 last:border-0">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{title}</h4>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

export const RangeSlider = ({ label, value, onChange, min = 0, max = 100 }) => (
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

export const ColorPicker = ({ label, color, onChange }) => (
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

export const InputField = ({ label, value, onChange, type = "text" }) => (
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