// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable filenames/match-exported */
/**
 * 网页颜色吸管工具【拾色器】
 * date: 2021.10.31
 * author: alanyf
 */
 import domtoimage from '@/dom-to-image';
 import {
   drawTooltip,
   getCanvas,
   getCanvasRectColor,
   loadImage,
   rbgaObjToHex,
   renderColorInfo,
 } from './helper';
 import type { IProps, IRect } from './interface';

 export * from './interface';

 /**
  * 网页拾色器【吸管工具】
  */
 export class ColorPipette {
   container: any = {};

   listener: Record<string, (e: any) => void> = {};

   rect: IRect = { x: 0, y: 0, width: 0, height: 0 };

   canvas: any = {};

   ctx: any;

   scale = 1;

   magnifier: any = null;

   colorContainer: any = null;

   colors: string[][] = [];

   tooltipVisible = true;

   useMagnifier = false;

   eyeDropper: any = null;

   constructor(props: IProps) {
     try {
       const { container, listener, scale = 1, useMagnifier = false } = props;
       this.container = container || document.body;
       this.listener = listener || {};
       this.rect = this.container.getBoundingClientRect();
       this.scale = scale > 4 ? 4 : scale;
       this.useMagnifier = useMagnifier;
       // 浏览器支持颜色吸管工具
       if ('EyeDropper' in window) {
         console.info('使用谷歌浏览器的颜色选择器功能');

         this.eyeDropper = new (window as any).EyeDropper();
         return;
       }
       // 去除noscript标签，可能会导致
       const noscript = document.body.querySelector('noscript');
       noscript?.parentNode?.removeChild(noscript);
       this.initCanvas();
     } catch (err) {
       console.error(err);
       this.destroy();
     }
   }

   /**
    * 初始化canvas
    */
   initCanvas() {
     const { rect, scale } = this;
     const { x, y, width, height } = rect;
     const { canvas, ctx } = getCanvas({
       width: rect.width,
       height: rect.height,
       scale,
       attrs: {
         class: 'color-pipette-canvas-container',
         style: `
           position: fixed;
           left: ${x}px;
           top: ${y}px;
           z-index: 10000;
           cursor: pointer;
           width: ${width}px;
           height: ${height}px;
         `,
       },
     });
     this.canvas = canvas;
     this.ctx = ctx;
   }

   /**
    * 开始
    */
   async start() {
     if (this.eyeDropper) {
       this.eyeDropper
         ?.open()
         // eslint-disable-next-line promise/prefer-await-to-then
         .then((res: any) => {
           const { sRGBHex: color } = res;
           this.listener?.onOk?.({ color, colors: [] });
         })
         // eslint-disable-next-line promise/prefer-await-to-then
         .catch((err: any) => console.error(err));
       return;
     }
     try {
       await this.drawCanvas();
       document.body.appendChild(this.canvas);
       const tooltip = drawTooltip('按Esc可退出');
       document.body.appendChild(tooltip);
       setTimeout(() => tooltip?.parentNode?.removeChild(tooltip), 2000);
       // 添加监听
       this.canvas.addEventListener('mousemove', this.handleMove);
       this.canvas.addEventListener('mousedown', this.handleDown);
       this.canvas.addEventListener('mouseenter', this.handleEnter);
       this.canvas.addEventListener('mouseout', this.handleOut);
       document.addEventListener('keydown', this.handleKeyDown);
     } catch (err) {
       console.error(err);
       this.destroy();
     }
   }

   /**
    * 结束销毁dom，清除事件监听
    */
   destroy() {
     this.canvas.removeEventListener('mousemove', this.handleMove);
     this.canvas.removeEventListener('mousedown', this.handleDown);
     this.canvas.removeEventListener('mouseenter', this.handleEnter);
     this.canvas.removeEventListener('mouseout', this.handleOut);
     document.removeEventListener('keydown', this.handleKeyDown);
     this.canvas?.parentNode?.removeChild(this.canvas);
     this.colorContainer?.parentNode?.removeChild(this.colorContainer);
   }

   /**
    * 将dom节点画到canvas里
    */
   async drawCanvas() {
     const base64 = await domtoimage
       .toPng(this.container, { scale: this.scale })
       .catch((err: any) => {
         console.error(err);
         return '';
       });
     if (!base64) {
       return;
     }
     const img = await loadImage(base64);
     if (!img) {
       return;
     }
     this.ctx.drawImage(img, 0, 0, this.rect.width, this.rect.height);
   }

   /**
    * 处理鼠标移动
    */
   handleMove = (e: any) => {
     const { color, colors } = this.getPointColors(e);
     const { onChange = () => '' } = this.listener;
     const { pageX, pageY } = e;
     const point = { x: pageX + 15, y: pageY + 15 };
     const colorContainer = renderColorInfo({
       containerDom: this.colorContainer,
       color,
       colors,
       point,
     });
     if (!this.colorContainer) {
       this.colorContainer = colorContainer;
       document.body.appendChild(colorContainer);
     }
     onChange({ color, colors });
   };

   /**
    * 处理鼠标按下
    */
   handleDown = (e: any) => {
     const { onOk = () => '' } = this.listener;
     const res = this.getPointColors(e);
     onOk(res);
     this.destroy();
   };

   /**
    * 鼠标进入截图区域
    */
   handleEnter = () => {
     if (this.colorContainer) {
       this.colorContainer.style.display = 'block';
     }
   };

   /**
    * 鼠标移出截图区域
    */
   handleOut = () => {
     if (this.colorContainer) {
       this.colorContainer.style.display = 'none';
     }
   };

   /**
    * 处理键盘按下Esc退出拾色
    */
   handleKeyDown = (e: KeyboardEvent) => {
     if (e.code === 'Escape') {
       this.destroy();
     }
   };

   /**
    * 获取鼠标点周围的颜色整列
    */
   getPointColors(e: any) {
     const { ctx, rect, scale } = this;
     let { pageX: x, pageY: y } = e;
     x -= rect.x;
     y -= rect.y;
     const color = this.getPointColor(x, y);
     const size = 19;
     const half = Math.floor(size / 2);
     const info = { x: x - half, y: y - half, width: size, height: size };
     const colors = getCanvasRectColor(ctx, info, scale);
     return { color, colors };
   }

   /**
    * 获取鼠标点的颜色
    */
   getPointColor(x: number, y: number) {
     const { scale } = this;
     const { data } = this.ctx.getImageData(x * scale, y * scale, 1, 1);
     console.log('yf123', data);

     const r = data[0];
     const g = data[1];
     const b = data[2];
     const a = data[3] / 255;
     const rgba = { r, g, b, a };
     return rbgaObjToHex(rgba);
   }
 }
