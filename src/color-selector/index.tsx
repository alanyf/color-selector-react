import React, { useState, useEffect, useRef } from 'react';
import { SketchPicker } from 'react-color';
import ColorPipette from '@/color-pipette';
import ColorBlock from '@/color-block';

import { defaultColors } from './default-colors';
import PaletteIcon from './icon/palette';
import PipetteIcon from './icon/pipette';
import ArrowIcon from './icon/arrow-right';
import { getColorInfo, IColorObj, toHexString } from './color-utils';

import './index.less';

const defaultFun = () => '';

const getLocalRecentColors = (localStorageKey: string) => {
  if (!window.localStorage) {
    console.warn(
      '你的浏览器不支持localStorage，无法使用最近使用颜色存储功能。',
    );
    return [];
  }
  const colorStr = localStorage.getItem(localStorageKey);
  if (!colorStr) {
    return [];
  }
  return colorStr.split(', ');
};
const setLocalRecentColors = (localStorageKey: string, colors: string[]) => {
  if (!window.localStorage) {
    console.warn(
      '你的浏览器不支持localStorage，无法使用最近使用颜色存储功能。',
    );
    return;
  }
  localStorage.setItem(localStorageKey, colors.join(', '));
};

const getHexColor = (color?: string) => {
  color = color || '#000000';
  return color.startsWith('#') ? color : getColorInfo(color).hex;
};

interface IChangeParams {
  color: string;
  hex: string;
  rgba: string;
  rgb: string;
  rgbaObj: { r: number; g: number; b: number; a: number };
}

interface IProps {
  color?: string;
  recommendedColors?: string[];
  visible?: boolean;
  noneTitle?: React.ReactNode;
  showNoneButton?: boolean;
  noneValue?: string;
  localStorageKey?: string;
  showPipetteColor?: boolean;
  showMoreColor?: boolean;
  className?: string;
  style?: Record<string, any>;
  colorPipetteDom?: HTMLElement | (() => HTMLElement);
  onChange?: (e: IChangeParams) => void;
  onVisibleChange?: (visible: boolean) => void;
}
export const ColorSelector = (props: IProps) => {
  const {
    recommendedColors = defaultColors,
    visible = true,
    showPipetteColor = true,
    showMoreColor = true,
    noneTitle = '默认颜色',
    showNoneButton = true,
    noneValue = 'none',
    localStorageKey = 'color_picker_recent_color',
    className = '',
    style = {},
    onChange = defaultFun,
    onVisibleChange = defaultFun,
    colorPipetteDom = document.body,
    ...rest
  } = props;
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [hoverLeft, setHoverLeft] = useState(false);
  const enable = useRef(false);
  const containerRef = useRef(null as any);
  const color = getHexColor(props.color);

  const handleRecentColorsChange = (color: string) => {
    const newRecentColors = [...recentColors];
    for (let i = 0; i < newRecentColors.length; i += 1) {
      if (newRecentColors[i] === color) {
        newRecentColors.splice(i, 1);
      }
    }
    newRecentColors.unshift(color);
    if (newRecentColors.length > 8) {
      newRecentColors.splice(8);
    }
    setRecentColors(newRecentColors);
    setLocalRecentColors(localStorageKey, newRecentColors);
  };
  const handleChange = (color: string) => {
    const colorInfo = getColorInfo(color);
    handleRecentColorsChange(colorInfo.hex);
    onChange({ ...colorInfo, color: colorInfo.hex } as any);
    onVisibleChange(false);
  };
  const handleMoreColorComplete = (colorObj: IColorObj) => {
    const color = toHexString(colorObj);
    const colorInfo = getColorInfo(color);
    handleRecentColorsChange(colorInfo.hex);
    onChange({ ...colorInfo, color } as any);
  };
  const handleMoreColorChange = (colorObj: IColorObj) => {
    const color = toHexString(colorObj);
    const colorInfo = getColorInfo(color);
    onChange({ ...colorInfo, color: colorInfo.hex } as any);
  };
  const handlePickerColor = () => {
    onVisibleChange(false);
    const container =
      typeof colorPipetteDom === 'function'
        ? colorPipetteDom()
        : colorPipetteDom;
    const pipette = new ColorPipette({
      container,
      scale: 2,
      useMagnifier: true,
      listener: {
        onOk: ({ color }) => handleChange(color?.hex || color),
      },
    });
    setTimeout(() => pipette.start(), 300);
  };
  const handleEnable = (e: any) => {
    if (
      e.target.tagName === 'INPUT' ||
      e.target.classList.contains('saturation-black')
    ) {
      enable.current = true;
    }
  };
  const getMoreColorPos = () => {
    if (containerRef?.current) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && rect.x + rect.width + 230 > window.innerWidth) {
        setHoverLeft(true);
        return;
      }
    }
    setHoverLeft(false);
  };

  useEffect(() => {
    const colors = getLocalRecentColors(localStorageKey);
    setRecentColors(colors);
    document.addEventListener('keyup', handleEnable);
    setTimeout(() => getMoreColorPos(), 600);
    window.addEventListener('resize', getMoreColorPos);
    return () => {
      document.removeEventListener('keyup', handleEnable);
      window.removeEventListener('resize', getMoreColorPos);
    };
  }, []);

  const renderColors = (colors: string[]) => (
    <>
      {colors.map((color: string, i: number) => (
        <ColorBlock
          // eslint-disable-next-line react/no-array-index-key
          key={`${color}-${i}`}
          color={color}
          title={color}
          className="color-item-content"
          onClick={() => handleChange(color)}
        />
      ))}
    </>
  );
  return visible ? (
    <div
      ref={containerRef}
      className={`color-picker-container ${className}`}
      style={{ ...style }}
      {...rest}>
      {showNoneButton && (
        <div
          className="none-color-container"
          onClick={() => {
            onChange({
              hex: '',
              rgba: '',
              rgb: '',
              rgbaObj: {},
              color: noneValue,
            } as any);
            onVisibleChange(false);
          }}>
          {noneTitle}
        </div>
      )}
      <div className="recommend-color-container">
        <div className="color-list-title">推荐颜色</div>
        <div className="color-list-container">
          {renderColors(recommendedColors)}
        </div>
      </div>
      <div className="recent-use-container">
        <div className="color-list-title">最近使用</div>
        <div className="color-list-container">{renderColors(recentColors)}</div>
      </div>
      {showPipetteColor && (
        <div className="pipette-color tool-row-container">
          <div className="tool-row-content" onClick={handlePickerColor}>
            <PipetteIcon className="tool-row-icon" />
            <div>拾色器</div>
          </div>
        </div>
      )}
      {showMoreColor && (
        <div className="more-color tool-row-container">
          <div className="tool-row-content">
            <PaletteIcon className="tool-row-icon" />
            <div>更多颜色</div>
            <ArrowIcon className="tool-row-arrow" />
          </div>
          <div
            className={`more-color-panel-container ${
              hoverLeft ? 'more-color-panel-left' : ''
            }`}
            onClick={handleEnable}>
            <SketchPicker
              color={color}
              onChange={({ rgb }) => handleMoreColorChange(rgb)}
              onChangeComplete={({ rgb }) => handleMoreColorComplete(rgb)}
            />
          </div>
        </div>
      )}
    </div>
  ) : null;
};
