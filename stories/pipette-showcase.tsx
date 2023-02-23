import React, { useState } from 'react';
import { ColorPipette } from 'color-selector-react';

export default () => {
  const [color, setColor] = useState('#fff');
  const handleClick = () => {
    // 初始化
    const pipette = new ColorPipette({
      container: document.body,
      scale: 2,
      listener: {
        onOk: ({ color, colors }) => {
          console.info(color, colors);
          setColor(color);
        },
      },
    });
    // 开始取色
    pipette.start();
  };
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
      }}
    >
      <h2>取色器showcase</h2>
      <p>开始矩形色块开始取色</p>
      <div
        style={{
          width: 30,
          height: 30,
          backgroundColor: color,
          border: '2px solid #ccc',
          margin: 10,
          borderRadius: 4,
        }}
        onClick={handleClick}
      ></div>
      <br />
      <img
        style={{ width: 600 }}
        src="https://img0.baidu.com/it/u=3545961216,3880048105&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500"
      />
    </div>
  );
};
