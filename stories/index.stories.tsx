import React, { useState } from 'react';
// import { ColorBlock, ColorSelector } from '../src';
import { ColorBlock, ColorSelector } from 'color-selector-react';
import PipetteDemo from './pipette-showcase';
import 'color-selector-react/dist/es/index.css';

export const Demo1ColorSelector = () => {
  const [color, setColor] = useState('#000');
  const [visible, setVisible] = useState(false);
  return (
    <div
      style={{
        backgroundColor: '#fff',
      }}
      onClick={() => setVisible(false)}
    >
      <h2>颜色选择器</h2>
      <p>开始矩形色块开始取色</p>
      <div
        style={{
          position: 'relative',
        }}
      >
        <ColorBlock
          style={{
            width: 30,
            height: 30,
            border: '2px solid #aaa',
          }}
          color={color}
          onClick={(e: MouseEvent) => {
            e.stopPropagation();
            setVisible(true);
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
          }}
          onClick={e => e.stopPropagation()}
        >
          <ColorSelector
            visible={visible}
            onVisibleChange={setVisible}
            style={{
              backgroundColor: '#fff',
            }}
            onChange={({ color }) => setColor(color)}
          />
        </div>
        <br />
        <img
          style={{ width: 600, marginLeft: 300 }}
          src="https://img0.baidu.com/it/u=3545961216,3880048105&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500"
        />
      </div>
    </div>
  );
};

export const Demo2Pipette = () => <PipetteDemo />;

export default {
  title: 'Your Story',
};
