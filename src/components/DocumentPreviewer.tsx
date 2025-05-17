import React, { useRef, useEffect, useState } from 'react';
import pagesData from '../data/pages.json';
import { getHighlightColor } from '../utils/colors';
import type { FieldItem } from '../types';

interface DocumentPreviewerProps {
  fields: FieldItem[];
  selectedIds?: number[];
  hoveredId?: number;
  onHover: (id?: number) => void;
}

const DocumentPreviewer: React.FC<DocumentPreviewerProps> = ({ fields, selectedIds, hoveredId, onHover }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(100); // percent
  const [imgLoaded, setImgLoaded] = useState(false);
  const [dimensions, setDimensions] = useState({ displayWidth: 0, displayHeight: 0, scale: 0 });

  // Get image info
  const doc = pagesData.data.documents[0];
  const page = doc.pages[0];
  const imageUrl = `${page.image.url}`;
  const imgWidth = page.image.width;
  const imgHeight = page.image.height;

  // Calculate zoomed size
  const calculateDimensions = () => {
    if (!containerRef.current) return { displayWidth: 0, displayHeight: 0, scale: 0 };

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    // Calculate the scale that would fit the image in the container
    const fitScaleWidth = containerWidth / imgWidth;
    const fitScaleHeight = containerHeight / imgHeight;
    const fitScale = Math.min(fitScaleWidth, fitScaleHeight);
    
    // Apply zoom factor
    const scale = (zoom / 100) * fitScale;
    
    // Calculate display dimensions while maintaining aspect ratio
    const displayWidth = imgWidth * scale;
    const displayHeight = imgHeight * scale;
    
    return { displayWidth, displayHeight, scale };
  };

  // Update dimensions when container size or zoom changes
  useEffect(() => {
    const newDimensions = calculateDimensions();
    setDimensions(newDimensions);
  }, [zoom]);

  // Load image only once
  useEffect(() => {
    const img = new window.Image();
    img.src = imageUrl;
    img.onload = () => {
      imageRef.current = img;
      setImgLoaded(true);
    };
  }, [imageUrl]);

  // Draw function that can be called when needed
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img || dimensions.displayWidth <= 0 || dimensions.displayHeight <= 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Only set canvas dimensions if they've changed
    if (canvas.width !== dimensions.displayWidth || canvas.height !== dimensions.displayHeight) {
      canvas.width = dimensions.displayWidth;
      canvas.height = dimensions.displayHeight;
    }

    // Clear and draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, dimensions.displayWidth, dimensions.displayHeight);

    // Draw highlights
    fields.forEach((field:any, idx:any) => {
      if (!field.content.position || field.content.position.length !== 4) return;
      const [x1, y1, x2, y2] = field.content.position;
      const color = getHighlightColor(idx);
      const isSelected = selectedIds?.includes(field.id);
      const isHovered = hoveredId === field.id;
      
      if (isSelected || isHovered) {
        ctx.save();
        ctx.globalAlpha = isHovered ? 0.5 : 0.3;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(
          x1 * dimensions.scale, 
          y1 * dimensions.scale, 
          (x2 - x1) * dimensions.scale, 
          (y2 - y1) * dimensions.scale
        );
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
    });
  };

  // Draw canvas when relevant properties change
  useEffect(() => {
    if (imgLoaded) {
      drawCanvas();
    }
  }, [imgLoaded, dimensions, hoveredId, selectedIds]);

  // // Handle window resize
  // useEffect(() => {
  //   const handleResize = () => {
  //     // This will trigger the dimensions calculation and canvas redraw
  //     const newDimensions = calculateDimensions();
  //     setDimensions(newDimensions);
  //   };

  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const { scale } = dimensions;
    
    let hoveredFieldId: number | undefined = undefined;
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
      if (!field.content.position || field.content.position.length !== 4) continue;
      
      const [x1, y1, x2, y2] = field.content.position;
      const sx1 = x1 * scale, sy1 = y1 * scale, sx2 = x2 * scale, sy2 = y2 * scale;
      
      if (mouseX >= sx1 && mouseX <= sx2 && mouseY >= sy1 && mouseY <= sy2) {
        hoveredFieldId = field.id;
        break;
      }
    }
    
    if (hoveredFieldId !== hoveredId) {
      onHover(hoveredFieldId);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="document-viewer"
      
    >
      <div 
       className='canvas-wrapper'
      >
        <canvas
          ref={canvasRef}
          style={{ 
            display: imgLoaded ? 'block' : 'none',
            background: '#232b32', 
            borderRadius: 8,
            width: dimensions.displayWidth,
            height: dimensions.displayHeight
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => onHover(undefined)}
        />
        {!imgLoaded && <div style={{ color: '#b0b8be', textAlign: 'center', padding: '2rem' }}>Loading image...</div>}
      </div>
      
      <div 
        className="zoom-controls" 
      >
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setZoom(z => Math.max(10, z - 10))}
          disabled={zoom <= 10}
          style={{ minWidth: 32 }}
        >-</button>
        <input
          type="range"
          min={10}
          max={200}
          step={1}
          value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          style={{ width: 120 }}
        />
        <span style={{ minWidth: 40, textAlign: 'center', color: '#b0b8be' }}>{zoom}%</span>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setZoom(z => Math.min(200, z + 10))}
          disabled={zoom >= 200}
          style={{ minWidth: 32 }}
        >+</button>
      </div>
    </div>
  );
};

export default DocumentPreviewer;