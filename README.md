# color-selector-react


本组件来源于我的掘金文章：[实现超好用的React颜色选择器组件](https://juejin.cn/post/7041370652309192735)


> 颜色选择器组件提供一个简洁美观的面板，很方便的选择常用的颜色，具有推荐颜色、最近使用颜色、拾色器、自定义颜色等功能。

## 一、介绍

- **推荐颜色**：默认为红橙黄绿青蓝紫的不同深浅色，支持自定义
- **最近使用**：使用`localstorage`记录最近使用过的颜色
- **拾色器**：颜色吸管工具可吸取网页上其他元素的颜色值
- **更多颜色**：可以编辑器颜色的透明度，色盘选择颜色、输入颜色值等（使用react-color实现）

### 图例

- 颜色选择器主面板
![屏幕录制2021-11-03 下午3.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7bcbb0711f96449ea3b5efd41d7ac31b~tplv-k3u1fbpfcp-watermark.image?)

- 拾色器（颜色吸管工具）
![屏幕录制2021-11-03 下午3.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a43ddffe6fc94c11adf4bf3df6568f8b~tplv-k3u1fbpfcp-watermark.image?)

## 二、使用

### 安装

```shell
npm install -s color-selector-react
```

### 使用

```js
import React, { useState } from 'react';
import { ColorSelector } from 'color-selector-react';
import 'color-selector-react/dist/es/index.css';

export default () => {
  const [color, setColor] = useState('#fff');
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block', margin: 60, }}>
      <div
        color={color}
        onClick={() => setVisible(!visible)}
        style={{
          width: 20,
          height: 20,
          border: '1px solid #ccc',
          backgroundColor: color,
        }}
      />
      {<ColorSelector
        style={{ position: 'absolute' }}
        color={color}
        visible={visible}
        onChange={({ color }) => setColor(color)}
        onVisibleChange={(v: boolean) => setVisible(v)}
      />}
    </div>
  );
};
```

## 三、参数说明

| 参数名 | 含义 | 默认值 | 备注
| --- | --- | --- | --- |
| color | 颜色值 | '#000' | - |
| visible | 是否可见 | true | - |
| recommendedColors | 自定义推荐颜色 | - | - |
| localStorageKey | 自定义key | 'color_picker_recent_color' | 最近颜色使用的localStorage唯一键值 |
| showPipetteColor | 是否显示拾色器 | true | - |
| showMoreColor | 是否显示更多颜色 | true | - |
| className | 类名 | '' | - |
| style | 样式对象 | {} | - |
| onChange | 监听颜色变化 | - | ({ color: string; }) => void |
| onVisibleChange | 监听显示变化 | - | (visible: boolean) => void |






## Prerequisites

1. [Node.js LTS](https://github.com/nodejs/Release)
    * [Automatically call nvm use](https://github.com/nvm-sh/nvm#deeper-shell-integration)

## Get Started

按开发环境的要求，运行和调试项目

运行和调试组件


```sh
# 终端1 实时编译编译
pnpm run build:watch

# 终端2 在storybook中调试
pnpm run storybook
```

运行测试用例

```
pnpm run test
```

按照社区规范和最佳实践，生成构建产物

```
pnpm run build
```

继续创建更多项目要素

```
pnpm run new
```

其他

```
pnpm run lint         # 检查和修复所有代码
pnpm run change       # 添加 changeset，用于发版时生成 changelog
pnpm run bump         # 生成发版相关的修改，比如更新版本号、生成 changelog
pnpm run release      # 根据 bump 自动修改和人工修改的发版要求，发布项目
pnpm run publish      # 发布组件到npm
```
