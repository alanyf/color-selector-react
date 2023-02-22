import type { IColors, IRect, IRgba } from './interface';

/**
 * 加载base64图片
 * @param base64
 * @returns
 */
export const loadImage = (base64: string) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
  });
};

// 十进制转化为16进制
export function hex(n: number) {
  return `0${n.toString(16)}`.slice(-2);
}

/**
 * rbga对象转化为16进制颜色字符串
 * @param rgba
 * @returns
 */
export const rbgaObjToHex = (rgba: IRgba) => {
  let { r, g, b } = rgba;
  const { a } = rgba;
  r = Math.floor(r * a);
  g = Math.floor(g * a);
  b = Math.floor(b * a);
  return `#${hex(r)}${hex(g)}${hex(b)}`;
};

/**
 * rbga对象转化为rgba css颜色字符串
 * @param rgba
 * @returns
 */
export const rbgaObjToRgba = (rgba: IRgba) => {
  const { r, g, b, a } = rgba;
  return `rgba(${r},${g},${b},${a})`;
};

/**
 * 显示颜色信息，包括放大镜和颜色值
 * @param params
 * @returns
 */
export const renderColorInfo = (params: any) => {
  const { containerDom, color, colors, point } = params;
  let container = containerDom;
  const pos = point;
  const n = 7;
  const count = colors[0].length;
  const size = count * (n + 0) + 2;
  if (!container) {
    const magnifier: any = document.createElement('div');
    container = magnifier;
  }
  if (pos.x + size + 25 > window.innerWidth) {
    pos.x -= size + 25;
  }
  if (pos.y + size + 40 > window.innerHeight) {
    pos.y -= size + 40;
  }
  container.style = `
    position: fixed;
    left: ${pos.x + 5}px;
    top: ${pos.y}px;
    z-index: 10001;
    pointer-events: none;
  `;
  container.innerHTML = '';
  const pipette = drawPipette(colors, n);
  const colorBlock = drawColorBlock(color);
  const padding: any = document.createElement('div');
  padding.style = 'height: 3px;';
  container.appendChild(pipette);
  container.appendChild(padding);
  container.appendChild(colorBlock);
  return container;
};

/**
 * 绘制放大镜
 * @param colors 颜色二位数组
 * @param size 单个像素点显示大小
 * @returns
 */
export function drawPipette(colors: IColors, size = 8) {
  const scale = 2;
  const canvasContainer: any = document.createElement('div');
  const canvasContent: any = document.createElement('div');
  const pipetteCanvas: any = drawPipetteCanvas(colors, size);
  canvasContainer.style = `position: relative;`;
  canvasContent.style = `
    position: absolute;
    top: 0;
    left: 0;
    width: ${pipetteCanvas.width / scale}px;
    height: ${pipetteCanvas.height / scale}px;
    border-radius: 50%;
    box-shadow: 0 0 10px 10px rgba(150,150,150,0.2) inset;
  `;
  canvasContainer.appendChild(pipetteCanvas);
  canvasContainer.appendChild(canvasContent);
  return canvasContainer;
}

/**
 * 颜色方块和颜色值显示
 * @param color
 * @returns
 */
export function drawColorBlock(color: string) {
  const colorBlock: any = document.createElement('div');
  colorBlock.style = `
    display: flex;
    align-items: center;
    background-color: rgba(0,0,0,0.4);
    padding: 2px 4px;
    border-radius: 3px;
  `;
  colorBlock.innerHTML = `
    <div style="
      width: 20px;
      height: 20px;
      background-color: ${color};
      border-radius: 3px;
      border: 1px solid #eee;
    "></div>
    <div style="
      width: 65px;
      border-radius: 3px;
      color: #fff;
      margin-left: 4px;
    ">${color}</div>
  `;
  return colorBlock;
}

/**
 * 显示提示
 * @param content
 * @param tooltipVisible
 * @returns
 */
export function drawTooltip(content: string, tooltipVisible = true) {
  const tooltip: any = document.createElement('div');
  tooltip.id = 'color-pipette-tooltip-container';
  tooltip.innerHTML = content;
  tooltip.style = `
    position: fixed;
    left: 50%;
    top: 30%;
    z-index: 10002;
    display: ${tooltipVisible ? 'flex' : 'none'};
    align-items: center;
    background-color: rgba(0,0,0,0.4);
    padding: 4px 10px;
    border-radius: 3px;
    color: #fff;
    font-size: 20px;
    pointer-events: none;
  `;
  return tooltip;
}

/**
 * 绘制放大镜canvas
 * @param colors
 * @param size
 * @returns
 */
export function drawPipetteCanvas(colors: IColors, size: number) {
  const count = colors.length;
  const diameter = size * count;
  const radius = diameter / 2;
  const { canvas, ctx } = getCanvas({
    width: diameter,
    height: diameter,
    scale: 2,
    attrs: {
      style: `border-radius: 50%;`,
    },
  });
  if (!ctx) {
    return null;
  }
  // 画像素点
  colors.forEach((row, i) =>
    row.forEach((color, j) => {
      ctx.fillStyle = color;
      ctx.fillRect(j * size, i * size, size, size);
    }),
  );
  // 画水平线
  for (let i = 0; i < count; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 0.6;
    ctx.moveTo(0, i * size);
    ctx.lineTo(diameter, i * size);
    ctx.stroke();
  }
  // 画垂直线
  for (let j = 0; j < count; j += 1) {
    ctx.beginPath();
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 0.6;
    ctx.moveTo(j * size, 0);
    ctx.lineTo(j * size, diameter);
    ctx.stroke();
  }
  // 画圆形边框
  ctx.beginPath();
  ctx.strokeStyle = '#ddd';
  ctx.arc(radius, radius, radius, 0, 2 * Math.PI);
  ctx.stroke();
  // 画中心像素点
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.strokeRect(radius - size / 2, radius - size / 2, size, size);
  return canvas;
}

/**
 * 生成canvas
 * @param param0
 * @returns
 */
export function getCanvas({ width = 0, height = 0, scale = 1, attrs = {} as Record<string, any> }) {
  const canvas: any = document.createElement('canvas');
  Object.keys(attrs).forEach((key) => {
    const value = attrs[key];
    canvas.setAttribute(key, value);
  });
  canvas.setAttribute('width', `${width * scale}`);
  canvas.setAttribute('height', `${height * scale}`);
  canvas.style = `${attrs.style || ''};width: ${width}px;height: ${height}px;`;
  const ctx = canvas.getContext('2d');
  ctx?.scale(scale, scale);
  return { canvas, ctx };
}

/**
 * 获取将canvas输出的数据转化为二位数组
 * @param data
 * @param rect
 * @param scale
 * @returns
 */
const getImageColor = (data: any[], rect: IRect, scale: number = 1) => {
  const colors: any[][] = [];
  const { width, height } = rect;
  for (let row = 0; row < height; row += 1) {
    if (!colors[row]) {
      colors[row] = [];
    }
    const startIndex = row * width * 4 * scale * scale;
    for (let column = 0; column < width; column += 1) {
      const i = startIndex + column * 4 * scale;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3] / 255;
      const color = rbgaObjToHex({ r, g, b, a });
      colors[row][column] = color;
    }
  }
  return colors;
};

/**
 * 获取canvas某一区域的颜色值二位数组
 * @param ctx
 * @param rect
 * @param scale
 * @returns
 */
export const getCanvasRectColor = (ctx: any, rect: IRect, scale: number = 1) => {
  const { x, y, width, height } = rect;
  // console.log(x, y, width, height);
  const image = ctx.getImageData(x * scale, y * scale, width * scale, height * scale);
  const { data } = image;
  const colors = getImageColor(data, rect, scale);
  return colors;
};
