
export interface Point {
  x: number;
  y: number;
}

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type IColors = string[][];

export interface IRgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface IProps {
  container: any;
  listener?: Record<string, (e: any) => void>;
  scale?: number;
  useMagnifier?: boolean;
}
