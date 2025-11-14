'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo } from 'react';
import '@excalidraw/excalidraw/index.css';

// Dynamically import Excalidraw with no SSR
const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { ssr: false }
);

// Dynamically import convertToExcalidrawElements
const getConvertFunction = async () => {
  const excalidrawModule = await import('@excalidraw/excalidraw');
  return excalidrawModule.convertToExcalidrawElements;
};

export default function ExcalidrawCanvas({ elements }) {
  const [convertToExcalidrawElements, setConvertFunction] = useState(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  // Load convert function on mount
  useEffect(() => {
    getConvertFunction().then(fn => {
      setConvertFunction(() => fn);
    });
  }, []);

  // Convert elements to Excalidraw format
  const convertedElements = useMemo(() => {
    if (!elements || elements.length === 0 || !convertToExcalidrawElements) {
      return [];
    }

    try {
      const raw = convertToExcalidrawElements(elements);
      // 统一用无衬线字体（Excalidraw 的 family=2）
      return raw.map((el) =>
        typeof el.fontFamily === 'number' ? { ...el, fontFamily: 2 } : el
      );
    } catch (error) {
      console.error('Failed to convert elements:', error);
      return [];
    }
  }, [elements, convertToExcalidrawElements]);

  useEffect(() => {
    if (!excalidrawAPI) return;
    excalidrawAPI.updateScene({
      appState: {
        currentItemFontFamily: 2,
      },
    });
  }, [excalidrawAPI]);

  // Auto zoom to fit content when API is ready and elements change
  useEffect(() => {
    if (excalidrawAPI && convertedElements.length > 0) {
      // Small delay to ensure elements are rendered
      setTimeout(() => {
        excalidrawAPI.scrollToContent(convertedElements, {
          fitToContent: true,
          animate: true,
          duration: 300,
        });
      }, 100);
    }
  }, [excalidrawAPI, convertedElements]);

  // Generate unique key when elements change to force remount
  const canvasKey = useMemo(() => {
    if (convertedElements.length === 0) return 'empty';
    // Create a hash from elements to detect changes
    return JSON.stringify(convertedElements.map(el => el.id)).slice(0, 50);
  }, [convertedElements]);

  // Remove "Excalidraw Links" sidebar section
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const removeLinks = () => {
      document
        .querySelectorAll('.layer-ui__wrapper__sidebar section')
        .forEach((section) => {
          if (
            section.textContent &&
            section.textContent.toLowerCase().includes('excalidraw links')
          ) {
            section.style.display = 'none';
          }
        });
    };
    removeLinks();
    const observer = new MutationObserver(removeLinks);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full h-full">
      <Excalidraw
        key={canvasKey}
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={{
          elements: convertedElements,
          appState: {
            viewBackgroundColor: '#ffffff',
            currentItemFontFamily: 2,
          },
          scrollToContent: true,
        }}
      />
    </div>
  );
}

