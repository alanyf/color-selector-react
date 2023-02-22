import React from 'react';
import './index.less';

interface IProps {
  color?: string;
  style?: Record<string, any>;
  className?: string;
  onClick?: (e: any) => void;
  [prop: string]: any;
}
export default (props: IProps) => {
  const { color = 'transparent', style = {}, onClick = () => '', className = '', ...rest } = props;
  const transparentClass = color === 'transparent' ? 'color-block-transparent-background' : '';
  return (
    <div
      className={`color-block-container ${transparentClass} ${className}`}
      style={{
        backgroundColor: color,
        ...style,
      }}
      onClick={onClick}
      {...rest}
    >
    </div>
  );
};
