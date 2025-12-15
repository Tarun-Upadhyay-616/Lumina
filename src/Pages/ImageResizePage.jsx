// src/components/ImageResizePage.jsx

import React, { useEffect, useState, useMemo } from 'react';
// import { RESIZEROUTE } from '../RoutesConstants'; // Assuming route is defined below
import { apiClient } from './../api-client'; // Assumes apiClient is defined
import { IoIosClose } from 'react-icons/io';
import LoadingIcons from 'react-loading-icons';
import { HOST } from '../Constants';

// Placeholder for HOST if it's not defined elsewhere:
const RESIZE_ENDPOINT = '/edit/resize-image'; // Use the correct endpoint defined in your Express setup

const Navbar = () => (
  <nav className="bg-gray-800 border-b border-cyan-800/50 shadow-md shadow-cyan-900/30">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="shrink-0">
          <span className="text-xl font-extrabold text-cyan-400 tracking-wider">
            LUMINA-STUDIO
          </span>
        </div>
        <div className="flex space-x-4">
          <a href="/" className="text-gray-300 hover:text-cyan-400 transition duration-150">Home</a>
          <a href="#" className="text-gray-300 hover:text-cyan-400 transition duration-150">Gallery</a>
          <a href="#" className="text-cyan-400 font-bold transition duration-150">Tools</a>
        </div>
      </div>
    </div>
  </nav>
);


const ImageResizePage = () => {
  const [image, setImage] = useState(null);
  const [resizeType, setResizeType] = useState('dimension');
  const [width, setWidth] = useState(''); // Stores current/original width
  const [height, setHeight] = useState(''); // Stores current/original height
  const [targetSizeKB, setTargetSizeKB] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [resizedPath, setResizedPath] = useState(null);
  const [resizedMetrics, setResizedMetrics] = useState({ sizeKB: null, name: null });


  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      // --- Get and Set Original Dimensions ---
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = objectUrl;

      img.onload = () => {
        const currentWidth = img.naturalWidth;
        const currentHeight = img.naturalHeight;

        // Set the original dimensions as the default input values
        setWidth(currentWidth.toString());
        setHeight(currentHeight.toString());

        URL.revokeObjectURL(objectUrl);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        console.error("Error loading image for dimension check.");
      };
      // ------------------------------------------

      setImage(file);
      setResizedPath(null);
      setResizedMetrics({ sizeKB: null, name: null });
    }
  }

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

    if (resizeType === 'dimension') {
      return !(width && height);
    } else if (resizeType === 'size') {
      return !targetSizeKB;
    }
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

      const response = await apiClient.post(RESIZE_ENDPOINT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const responseData = response.data.data;

      alert("Image resized successfully!");

      setResizedPath(responseData.resizedURL);
      setResizedMetrics({
        sizeKB: responseData.resizedSizeKB,
        name: responseData.resizedName
      });

    } catch (error) {
      console.error(error);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Image Resizer
          </h1>
          <p className="text-lg text-gray-400">
            Adjust dimensions and target file size with a few clicks.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row lg:space-x-8">

          <div className="lg:w-2/3 mb-8 lg:mb-0">
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl shadow-cyan-900/40 h-full">
              <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700/50 pb-2 flex gap-5 justify-between">
                {!image ? "Upload Image" : image.name}
                {image && <IoIosClose className='text-red-500 text-4xl cursor-pointer' onClick={handleClearImage} />}
              </h2>

              {!image ? (
                // --- File Upload Area ---
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-cyan-600 rounded-xl cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition duration-200"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-10 h-10 mb-3 text-cyan-400 drop-shadow-[0_0_8px_rgba(45,212,255,0.7)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 014 4v2m-5 4l-4-4m0 0l-4 4m4-4v12"></path></svg>
                      <p className="mb-2 text-sm text-gray-300">
                        <span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, or GIF (Max 10MB)
                      </p>
                    </div>
                    <input id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>)

                : (
                  <div className="flex flex-col items-center justify-center w-full">
                    <div className='relative w-full h-auto max-h-[50vh] overflow-hidden rounded-xl'>
                      <img src={previewUrl} alt="Original Image Preview" className="w-full h-auto object-contain" />
                    </div>
                    <div className="mt-4 text-center text-gray-400 text-sm">
                      Original Size: {image.size ? (image.size / 1024).toFixed(2) : ''} KB |
                      Dimensions: {width}px x {height}px
                    </div>

                    {resizedPath && (
                      <div className="mt-6 p-4 bg-gray-700 rounded-xl w-full text-center">
                        <h3 className="text-xl font-bold text-cyan-400 mb-4">Resize Complete!</h3>

                        <p className="text-sm font-bold text-white mb-4">
                          New Size: {resizedMetrics.sizeKB ? resizedMetrics.sizeKB.toFixed(2) : 'N/A'} KB
                        </p>

                        <img src={`${HOST}${resizedPath}`} alt="Resized Image"
                          className="max-w-full h-auto object-contain mx-auto border border-cyan-500 rounded my-4" />

                        <a
                          href={`${HOST}${resizedPath}`} download
                          className="inline-flex items-center justify-center py-2 px-6 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition"
                        >
                          Download Image
                        </a>
                      </div>
                    )}
                  </div>)}
            </div>
          </div>

          {/* --- Settings Panel --- */}
          <div className="lg:w-1/3">
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl shadow-cyan-900/40 space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700/50 pb-2">
                Resize Settings
              </h2>
              <div>
                <label htmlFor="resizeType" className="block text-sm font-semibold text-gray-300 mb-1">
                  Resize Mode
                </label>
                <select
                  id="resizeType"
                  value={resizeType}
                  onChange={(e) => setResizeType(e.target.value)}
                  className="block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                >
                  <option value="dimension">By Width and Height (px)</option>
                  <option value="size">By Target File Size (KB)</option>
                </select>
              </div>

              {resizeType === 'dimension' && (
                <>
                  <div>
                    <label htmlFor="width" className="block text-sm font-semibold text-gray-300 mb-1">
                      Width
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="width"
                        placeholder="e.g., 800"
                        min="1"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">
                        px
                      </span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="height" className="block text-sm font-semibold text-gray-300 mb-1">
                      Height
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="height"
                        placeholder="e.g., 600"
                        min="1"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">
                        px
                      </span>
                    </div>
                  </div>
                </>
              )}

              {resizeType === 'size' && (
                <div>
                  <div className="flex items-center py-2">
                    <div className="grow border-t border-gray-700/50"></div>
                    <span className="shrink mx-4 text-gray-500 text-sm font-medium">Target</span>
                    <div className="grow border-t border-gray-700/50"></div>
                  </div>
                  <label htmlFor="targetSizeKB" className="block text-sm font-semibold text-gray-300 mb-1">
                    Target File Size
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="targetSizeKB"
                      placeholder="e.g., 500"
                      min="1"
                      value={targetSizeKB}
                      onChange={(e) => setTargetSizeKB(e.target.value)}
                      className="block w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-150"
                    />
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">
                      KB
                    </span>
                  </div>
                </div>
              )}


              <button
                className="w-full flex justify-center py-3 px-4 mt-6 border border-transparent rounded-xl shadow-lg text-md font-bold text-gray-900 bg-cyan-400 hover:bg-cyan-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-cyan-600 focus:ring-offset-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={ResizeImage}
                disabled={isResizeDisabled}
              >
                {isLoading ? <LoadingIcons.ThreeDots className="h-6 w-6 text-gray-900" /> : "Resize and Save"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ImageResizePage;