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

const FONT_OPTIONS = [
  {
    value: 'sans',
    label: 'Tiempos · PingFang（标准）',
    familyValue: 2,
    description: '适合常规流程图与信息图',
  },
  {
    value: 'pingfang',
    label: '苹方（中文优先）',
    familyValue: 2,
    description: '中文文本更圆润清晰',
  },
  {
    value: 'virgil',
    label: '手写（Virgil）',
    familyValue: 1,
    description: '保留 Excalidraw 手绘风格',
  },
  {
    value: 'mono',
    label: '等宽（Mono）',
    familyValue: 3,
    description: '适合技术图或代码片段',
  },
];

export default function ExcalidrawCanvas({
  elements,
  fontChoice = 'sans',
  onFontChoiceChange,
}) {
  const [convertToExcalidrawElements, setConvertFunction] = useState(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

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

  const handleFontChange = (event) => {
    onFontChoiceChange?.(event.target.value);
  };

  return (
    <div
      className="relative w-full h-full"
      data-font-choice={fontChoice}
    >
      <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.08)] border border-gray-200 px-4 py-3 space-y-2 min-w-[240px]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-600">字体</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">
            Font family
          </span>
        </div>
        <div className="space-y-1">
          <select
            value={fontChoice}
            onChange={handleFontChange}
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-focus)] bg-white"
          >
            {FONT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-gray-500 leading-snug">
            {selectedFontOption.description}
          </p>
        </div>
      </div>
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

