'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
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

const FONT_OPTIONS = [
  {
    value: 'tiempos',
    label: 'Tiempos · PingFang',
    familyValue: 2,
    description: '英文优先 Tiempos，中文回退苹方',
  },
  {
    value: 'pingfang',
    label: '仅苹方',
    familyValue: 2,
    description: '全部文本都使用苹方风格',
  },
  {
    value: 'virgil',
    label: '手写 (Virgil)',
    familyValue: 1,
    description: '保留 Excalidraw 手绘风格',
  },
  {
    value: 'mono',
    label: '等宽 (Mono)',
    familyValue: 3,
    description: '适合代码或技术草图',
  },
];

export default function ExcalidrawCanvas({
  elements,
  fontChoice = 'tiempos',
  onFontChoiceChange,
}) {
  const [convertToExcalidrawElements, setConvertFunction] = useState(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [topLeftPanelMount, setTopLeftPanelMount] = useState(null);

  // Load convert function on mount
  useEffect(() => {
    getConvertFunction().then(fn => {
      setConvertFunction(() => fn);
    });
  }, []);

  const selectedFontOption =
    FONT_OPTIONS.find((opt) => opt.value === fontChoice) || FONT_OPTIONS[0];
  const selectedFontFamilyValue = selectedFontOption.familyValue;

  // Convert elements to Excalidraw format
  const convertedElements = useMemo(() => {
    if (!elements || elements.length === 0 || !convertToExcalidrawElements) {
      return [];
    }

    try {
      const raw = convertToExcalidrawElements(elements);
      // 统一根据选择的字体家族覆盖
      return raw.map((el) =>
        typeof el.fontFamily === 'number'
          ? { ...el, fontFamily: selectedFontFamilyValue }
          : el
      );
    } catch (error) {
      console.error('Failed to convert elements:', error);
      return [];
    }
  }, [elements, convertToExcalidrawElements, selectedFontFamilyValue]);

  useEffect(() => {
    if (!excalidrawAPI) return;
    excalidrawAPI.updateScene({
      appState: {
        currentItemFontFamily: selectedFontFamilyValue,
      },
    });
  }, [excalidrawAPI, selectedFontFamilyValue]);

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

  // Mount custom font control into the native top-left stack
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const ensureMount = () => {
      const stackContainer = document.querySelector(
        '.excalidraw .layer-ui__wrapper .Stack.Stack_vertical.App-menu_top__left'
      );
      if (!stackContainer) {
        setTopLeftPanelMount(null);
        return;
      }
      let mount = stackContainer.querySelector('.custom-font-choice');
      if (!mount) {
        mount = document.createElement('div');
        mount.className = 'custom-font-choice w-full';
        stackContainer.appendChild(mount);
      }
      setTopLeftPanelMount(mount);
    };

    ensureMount();
    const observer = new MutationObserver(ensureMount);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

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

  const handleFontChange = (event) => {
    onFontChoiceChange?.(event.target.value);
  };

  return (
    <div className="relative w-full h-full" data-font-choice={fontChoice}>
      {topLeftPanelMount &&
        createPortal(
          <div className="w-full border border-dashed border-[var(--primary-main)] rounded-lg px-3 py-2 mt-2 text-[11px] text-gray-600 bg-white/80 backdrop-blur">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-xs text-gray-700">字体偏好</span>
              <span className="text-[10px] uppercase tracking-wide text-gray-400">
                Custom font
              </span>
            </div>
            <select
              value={fontChoice}
              onChange={handleFontChange}
              className="w-full text-xs px-2 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-[var(--primary-focus)] border border-gray-200 bg-white"
            >
              {FONT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-[10px] text-gray-500 leading-tight">
              {selectedFontOption.description}
            </p>
          </div>,
          topLeftPanelMount
        )}
      <Excalidraw
        key={canvasKey}
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        initialData={{
          elements: convertedElements,
          appState: {
            viewBackgroundColor: '#ffffff',
            currentItemFontFamily: selectedFontFamilyValue,
          },
          scrollToContent: true,
        }}
      />
    </div>
  );
}

