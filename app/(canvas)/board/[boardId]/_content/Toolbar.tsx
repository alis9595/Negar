import { Skeleton } from "@/components/ui/skeleton";
import { IBtnProps, ToolButton } from "./ToolButton";
import { useTranslations } from "next-intl";
import {
  Circle,
  MousePointer2,
  Pencil,
  Redo2,
  Square,
  StickyNote,
  Type,
  Undo2,
} from "lucide-react";
import { ECanvasMode, ELayerType, TCanvasState } from "@/types/canvas";

type TToolbarProps = {
  canvasState: TCanvasState;
  setCanvasState: (newState: TCanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

export default function Toolbar({
  canvasState,
  canRedo,
  canUndo,
  redo,
  undo,
  setCanvasState,
}: TToolbarProps) {
  const t = useTranslations("Toolbar");

  const items: IBtnProps[] = [
    {
      label: t("select"),
      icon: MousePointer2,
      onClick: () => setCanvasState({ mode: ECanvasMode.None }),
      isActive:
        canvasState.mode === ECanvasMode.None ||
        canvasState.mode === ECanvasMode.Moving ||
        canvasState.mode === ECanvasMode.SelectionNet ||
        canvasState.mode === ECanvasMode.Pressing ||
        canvasState.mode === ECanvasMode.Resizing,
    },
    {
      label: t("type"),
      icon: Type,
      onClick: () =>
        setCanvasState({
          mode: ECanvasMode.Inserting,
          layerType: ELayerType.Text,
        }),
      isActive:
        canvasState.mode === ECanvasMode.Inserting &&
        canvasState.layerType === ELayerType.Text,
    },
    {
      label: t("sticker"),
      icon: StickyNote,
      onClick: () =>
        setCanvasState({
          mode: ECanvasMode.Inserting,
          layerType: ELayerType.Sticker,
        }),
      isActive:
        canvasState.mode === ECanvasMode.Inserting &&
        canvasState.layerType === ELayerType.Sticker,
    },
    {
      label: t("rectangle"),
      icon: Square,
      onClick: () =>
        setCanvasState({
          mode: ECanvasMode.Inserting,
          layerType: ELayerType.Rectangle,
        }),
      isActive:
        canvasState.mode === ECanvasMode.Inserting &&
        canvasState.layerType === ELayerType.Rectangle,
    },
    {
      label: t("ellipse"),
      icon: Circle,
      onClick: () =>
        setCanvasState({
          mode: ECanvasMode.Inserting,
          layerType: ELayerType.Ellipse,
        }),
      isActive:
        canvasState.mode === ECanvasMode.Inserting &&
        canvasState.layerType === ELayerType.Ellipse,
    },
    {
      label: t("pen"),
      icon: Pencil,
      onClick: () =>
        setCanvasState({
          mode: ECanvasMode.Pencil,
        }),
      isActive: canvasState.mode === ECanvasMode.Pencil,
    },
    {
      label: t("undo"),
      icon: Undo2,
      onClick: undo,
      isDisabled: !canUndo,
    },
    {
      label: t("redo"),
      icon: Redo2,
      onClick: redo,
      isDisabled: !canRedo,
    },
  ];

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-2 flex flex-col gap-y-4">
      <div className="bg-white rounded-md p-1.5 flex flex-col gap-1 items-center shadow-md">
        {items.slice(0, 6).map((item) => (
          <ToolButton {...item} key={item.label} />
        ))}
      </div>
      <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
        {items.slice(6, 8).map((item) => (
          <ToolButton {...item} key={item.label} />
        ))}
      </div>
    </div>
  );
}

Toolbar.Skeleton = function ToolbarSkeleton() {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 start-2 h-96 w-14 flex flex-col gap-y-4 shadow-md rounded-md bg-white">
      <Skeleton className="h-full w-full" />
    </div>
  );
};
