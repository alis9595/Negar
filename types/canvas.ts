export enum ECanvasMode {
  None,
  Pressing,
  SelectionNet,
  Moving,
  Inserting,
  Resizing,
  Pencil,
}

export enum ELayerType {
  Rectangle,
  Ellipse,
  Path,
  Text,
  Sticker,
}

export enum ESide {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

export type TColor = {
  r: number;
  g: number;
  b: number;
};

export type TCamera = {
  x: number;
  y: number;
};

export type TPoint = TCamera;

export type TXYWH = {
  width: number;
  height: number;
} & TPoint;

export type TCanvasObject = {
  fill: TColor;
  value?: string;
} & TXYWH;

export type TCanvasState =
  | { mode: ECanvasMode.None }
  | {
      mode: ECanvasMode.Inserting;
      layerType:
        | ELayerType.Ellipse
        | ELayerType.Rectangle
        | ELayerType.Text
        | ELayerType.Sticker;
    }
  | {
      mode: ECanvasMode.Moving;
      current: TPoint;
    }
  | { mode: ECanvasMode.Resizing; initialBounds: TXYWH; corner: ESide }
  | { mode: ECanvasMode.Pencil }
  | { mode: ECanvasMode.Pressing; origin: TPoint }
  | { mode: ECanvasMode.SelectionNet; origin: TPoint; current?: TPoint };

export type TRectangleLayer = {
  type: ELayerType.Rectangle;
} & TCanvasObject;

export type TEllipseLayer = {
  type: ELayerType.Ellipse;
} & TCanvasObject;

export type TPathLayer = {
  type: ELayerType.Path;
  points: number[][];
} & TCanvasObject;

export type TTextLayer = {
  type: ELayerType.Text;
} & TCanvasObject;

export type TStickerLayer = {
  type: ELayerType.Sticker;
} & TCanvasObject;

export type TLayer =
  | TRectangleLayer
  | TEllipseLayer
  | TPathLayer
  | TTextLayer
  | TStickerLayer;
