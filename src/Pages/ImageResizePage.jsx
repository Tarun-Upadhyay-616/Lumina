import React, { useEffect, useState, useMemo } from 'react';
import { apiClient } from './../api-client'; 
import { IoIosClose } from 'react-icons/io';
import LoadingIcons from 'react-loading-icons';
import { HOST } from '../Constants';
import { RESIZEROUTE } from '../RoutesConstants';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const TOOLS_LIST = [
    { name: 'Background Remover', path: '/bg-remover', description: 'AI cutout' },
    { name: 'Photo Editor', path: '/editor', description: 'Editor' },
  ];

  return (
    <nav className="bg-gray-800 border-b border-cyan-800/50 shadow-md shadow-cyan-900/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0">
            <Link to='/' className="flex items-center">
              <span className="text-xl font-extrabold text-cyan-400 tracking-wider">
                LUMINA-STUDIO
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition duration-150">Home</Link>
            
            <div 
              className="relative group"
              onMouseEnter={() => setIsToolsOpen(true)}
              onMouseLeave={() => setIsToolsOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm text-cyan-400 font-bold transition duration-150 py-5">
                Tools
                <svg className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isToolsOpen && (
                <div className="absolute right-0 mt-0 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {TOOLS_LIST.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className="block px-4 py-3 hover:bg-cyan-500/10 transition-colors border-b border-gray-700/50 last:border-0 group"
                    >
                      <p className="text-sm font-bold text-white group-hover:text-cyan-400">{tool.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{tool.description}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden p-2 text-gray-300 hover:text-cyan-400 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
            </svg>
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-4 space-y-4 shadow-inner">
          <Link to="/" className="block text-base font-medium text-gray-300" onClick={() => setIsOpen(false)}>Home</Link>
          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Our Tools</p>
            <div className="grid grid-cols-1 gap-2">
              {TOOLS_LIST.map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className="p-3 bg-gray-900/50 rounded-lg border border-gray-700 active:bg-cyan-900/20"
                  onClick={() => setIsOpen(false)}
                >
                  <p className="text-sm font-bold text-cyan-400">{tool.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const ImageResizePage = () => {
  const [image, setImage] = useState(null);
  const [resizeType, setResizeType] = useState('dimension');
  const [width, setWidth] = useState(''); 
  const [height, setHeight] = useState(''); 
  const [targetSizeKB, setTargetSizeKB] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [resizedPath, setResizedPath] = useState(null);
  const [resizedMetrics, setResizedMetrics] = useState({ sizeKB: null, name: null });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = objectUrl;
      img.onload = () => {
        setWidth(img.naturalWidth.toString());
        setHeight(img.naturalHeight.toString());
        URL.revokeObjectURL(objectUrl);
      };
      setImage(file);
      setResizedPath(null);
      setResizedMetrics({ sizeKB: null, name: null });
    }
  };

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleClearImage = () => {
    setImage(null);
    setResizedPath(null);
    setPreviewUrl('');
    setResizedMetrics({ sizeKB: null, name: null });
  };

  const isResizeDisabled = useMemo(() => {
    if (isLoading || !image) return true;
    if (resizeType === 'dimension') return !(width && height);
    if (resizeType === 'size') return !targetSizeKB;
    return true;
  }, [isLoading, image, resizeType, width, height, targetSizeKB]);

  const ResizeImage = async () => {
    if (isResizeDisabled) return;
    const formData = new FormData();
    formData.append('image', image);
    formData.append('resizeType', resizeType);
    if (resizeType === 'dimension') {
      formData.append('width', width);
      formData.append('height', height);
    } else if (resizeType === 'size') {
      formData.append('targetSizeKB', targetSizeKB);
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(RESIZEROUTE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const responseData = response.data.data;
      setResizedPath(responseData.resizedURL);
      setResizedMetrics({
        sizeKB: responseData.resizedSizeKB,
        name: responseData.resizedName
      });
    } catch (error) {
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Image Resizer
          </h1>
          <p className="text-sm sm:text-lg text-gray-400">
            Professional-grade image optimization. Adjust dimensions or compress file size in seconds.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 w-full order-1">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-4 sm:p-5 border-b border-gray-700/50 bg-gray-800/50">
                <h2 className="text-sm sm:text-base font-semibold truncate max-w-[80%]">
                  {!image ? "Step 1: Upload your image" : `Editing: ${image.name}`}
                </h2>
                {image && (
                  <button 
                    onClick={handleClearImage}
                    className="p-1 hover:bg-red-500/20 rounded-full transition-colors group"
                  >
                    <IoIosClose className='text-red-500 text-3xl group-hover:scale-110 transition-transform' />
                  </button>
                )}
              </div>

              <div className="p-4 sm:p-6">
                {!image ? (
                  <label className="flex flex-col items-center justify-center w-full min-h-[300px] border-2 border-dashed border-cyan-600/50 rounded-2xl cursor-pointer bg-gray-700/20 hover:bg-gray-700/40 hover:border-cyan-400 transition-all group">
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 mb-4 rounded-full bg-cyan-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 014 4v2m-5 4l-4-4m0 0l-4 4m4-4v12" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium mb-1"><span className="text-cyan-400">Click to upload</span> or drag and drop</p>
                      <p className="text-sm text-gray-500">PNG, JPG, or WEBP (Max 10MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                ) : (
                  <div className="space-y-6">
                    <div className='w-full bg-gray-950 rounded-xl overflow-hidden shadow-inner flex justify-center items-center border border-gray-700'>
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-[350px] sm:max-h-[500px] lg:max-h-[600px] w-auto object-contain p-2" 
                      />
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm font-mono text-cyan-400 bg-cyan-950/30 py-3 px-4 rounded-lg border border-cyan-900/50">
                      <span>ORIGINAL: {(image.size / 1024).toFixed(1)} KB</span>
                      <span className="text-gray-600">|</span>
                      <span>DIMENSIONS: {width} × {height} px</span>
                    </div>

                    {resizedPath && (
                      <div className="animate-in fade-in zoom-in duration-300 p-5 sm:p-6 bg-green-500/10 rounded-2xl border border-green-500/30 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                          <h3 className="text-base font-bold text-green-400 uppercase tracking-wider">Processing Complete</h3>
                        </div>
                        <p className="text-sm text-gray-300 mb-4">New File Size: <span className="text-white font-bold">{resizedMetrics.sizeKB?.toFixed(1)} KB</span></p>
                        <div className="max-w-xs mx-auto mb-6 bg-gray-900 rounded-lg p-2 border border-gray-700">
                           <img src={`${HOST}${resizedPath}`} alt="Resized Result" className="w-full h-auto rounded" />
                        </div>
                        <a 
                          href={`${HOST}${resizedPath}`} 
                          download 
                          className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all shadow-lg shadow-green-900/20 active:scale-95 w-full sm:w-auto"
                        >
                          Download Resized Image
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 w-full order-2">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-2xl lg:sticky lg:top-24">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Resize Settings
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Resize Mode</label>
                  <select 
                    value={resizeType} 
                    onChange={(e) => setResizeType(e.target.value)} 
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="dimension">By Dimensions (Pixels)</option>
                    <option value="size">By File Size (KB)</option>
                  </select>
                </div>

                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700">
                  {resizeType === 'dimension' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Width (px)</label>
                        <input 
                          type="number" 
                          value={width} 
                          onChange={(e) => setWidth(e.target.value)} 
                          placeholder="e.g. 1920"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:border-cyan-500 outline-none transition-colors" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Height (px)</label>
                        <input 
                          type="number" 
                          value={height} 
                          onChange={(e) => setHeight(e.target.value)} 
                          placeholder="e.g. 1080"
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:border-cyan-500 outline-none transition-colors" 
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">Target Size (KB)</label>
                      <input 
                        type="number" 
                        value={targetSizeKB} 
                        onChange={(e) => setTargetSizeKB(e.target.value)} 
                        placeholder="e.g. 200"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:border-cyan-500 outline-none transition-colors" 
                      />
                    </div>
                  )}
                </div>

                <button 
                  onClick={ResizeImage} 
                  disabled={isResizeDisabled} 
                  className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-700 text-gray-900 font-black rounded-xl text-base transition-all transform active:scale-[0.98] disabled:transform-none disabled:opacity-50 shadow-lg shadow-cyan-500/20 flex justify-center items-center gap-3"
                >
                  {isLoading ? (
                    <>
                      <LoadingIcons.ThreeDots className="h-5 w-5 fill-current" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    "Process Image"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t border-gray-800 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} LUMINA-STUDIO. All rights reserved.
      </footer>
    </div>
  );
};

export default ImageResizePage;