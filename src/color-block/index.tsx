import React from 'react';
import './index.less';

const isTransparent = (_color: string) => {
  const color = _color?.replaceAll(' ', '');

  if (color === 'transparent') {
    return true;
  }
  if (color?.startsWith('#')) {
    if (color?.length === 5) {
      return color[4] === '0';
    } else if (color?.length === 9) {
      return color?.slice(7) === '00';
    }
  } else if (color?.startsWith('rgba')) {
    return color?.split(',')?.pop() === '0)';
  }
  return false;
};

interface IProps {
  color?: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e: any) => void;
  [prop: string]: any;
}
export const ColorBlock = (props: IProps) => {
  const {
    color = 'transparent',
    style = {},
    onClick = () => '',
    className = '',
    ...rest
  } = props;
  const transparentClass = isTransparent(color)
    ? 'color-block-transparent-background'
    : '';
  return (
    <div
      className={`color-block-container ${transparentClass} ${className}`}
      style={{
        ...style,
        backgroundColor: color,
      }}
      onClick={onClick}
      {...rest}
    ></div>
  );
};
