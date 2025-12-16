import React from 'react';
import { FaDownload, FaMousePointer, FaTextHeight, FaUndo, FaRedo, FaTrash } from 'react-icons/fa';
import { BsBoundingBoxCircles } from 'react-icons/bs';
import { BiImageAdd } from 'react-icons/bi';
import { IoMdColorFill } from "react-icons/io";

const ToolButton = ({ icon: Icon, label }) => (
    <button
        title={label}
        className='w-full py-3 px-2 flex flex-col items-center space-y-1 rounded-lg transition-colors duration-150 
            text-gray-300 hover:bg-gray-700 hover:text-cyan-400'
    >
        <Icon className="text-xl" />
        <span className="text-xs font-medium">{label}</span>
    </button>
);

const PhotoEditorLayout = () => {
    return (
        <div className="min-h-screen flex bg-gray-900 text-white p-4">
            
      
            <div className="w-20 bg-gray-800 rounded-2xl shadow-2xl shadow-cyan-900/50 p-4 px-2 space-y-4 border border-gray-700 flex-shrink-0">
                <div className="text-center mb-4">
                    <h3 className='text-sm font-bold text-cyan-400'>TOOLS</h3>
                </div>
                
             
                <div className="space-y-3 overflow-y-auto h-[50vh] overflow-x-hidden">
                    <ToolButton icon={FaMousePointer} label="Select" />
                    <ToolButton icon={BsBoundingBoxCircles} label="Rect" />
                    <ToolButton icon={FaTextHeight} label="Text" />
                    <ToolButton icon={BiImageAdd} label="Image" />
                    <ToolButton icon={IoMdColorFill} label="Fill" />

                </div>
                
               
                <div className="border-t border-gray-700 my-4"></div>

           
                <div className="space-y-3">
                    <ToolButton icon={FaUndo} label="Undo" />
                    <ToolButton icon={FaRedo} label="Redo" />
                    <ToolButton icon={FaTrash} label="Delete" />
                </div>
            </div>

            
            <div className="flex-grow flex flex-col items-center ml-4 space-y-4">
                
                
                <div className="w-full max-w-5xl bg-gray-800 rounded-2xl shadow-2xl shadow-cyan-900/50 p-3 flex justify-between items-center border border-gray-700">
                     <h2 className='text-xl font-extrabold text-cyan-400'>Lumina Editor</h2>
                    <button
                        className="flex items-center space-x-2 py-2 px-4 rounded-xl text-md font-bold text-gray-900 bg-cyan-400 hover:bg-cyan-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-cyan-600 focus:ring-offset-gray-800 transition duration-200"
                    >
                        <FaDownload />
                        <span>Download Image</span>
                    </button>
                </div>

               
                <div className="bg-gray-800 rounded-2xl shadow-2xl shadow-cyan-900/50 p-6 border border-gray-700 max-w-full overflow-auto">
               
                    <div className="bg-gray-700 rounded-lg border border-gray-600 shadow-xl" style={{ width: '800px', height: '500px' }}>
                        <p className="text-center text-gray-500 pt-60">Canvas Area (The `canvas` tag would go here)</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoEditorLayout;