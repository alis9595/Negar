"use client";

import {
  useHistory,
  useSelf,
  useCanRedo,
  useCanUndo,
  useMutation,
  useStorage,
  useOthersMapped,
} from "@liveblocks/react";
import { nanoid } from "nanoid";
import Info from "./Info";
import Participants from "./Participants";
import Toolbar from "./Toolbar";
import CursorsPresence from "./CursorsPresence";
import {
  PointerEvent,
  WheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ECanvasMode,
  ELayerType,
  ESide,
  TCamera,
  TCanvasState,
  TColor,
  TPoint,
  TXYWH,
} from "@/types/canvas";
import {
  connectionIdToColor,
  findIntersectingLayersWithRectangle,
  penPointsToPath,
  pointerEventToCanvasPoint,
  resizeBounds,
  rgbToHex,
} from "@/lib/utils";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./LayerPreview";
import { SelectionBox } from "./SelectionBox";
import { SelectionTools } from "./SelectionTools";
import { Path } from "./layers/Path";
import { useDisableScrollBounce } from "@/hooks/useDisableScrollBounce";
import { useDeleteLayers } from "@/hooks/useDeleteLayers";

const MAX_LAYERS = 100;
const SELECTION_NET_THRESHOLD = 5;

interface Props {
  boardId: string;
}

export function Canvas({ boardId }: Props) {
  useDisableScrollBounce();

  const layerIds = useStorage((root) => root.layerIds);
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

  const [canvasState, setCanvasState] = useState<TCanvasState>({
    mode: ECanvasMode.None,
  });

  const deleteLayers = useDeleteLayers();
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const [camera, setCamera] = useState<TCamera>({ x: 0, y: 0 });
  const [lastUsedColor, setLastUsedColor] = useState<TColor>({
    r: 0,
    g: 0,
    b: 0,
  });

  const startDrawing = useMutation(
    ({ setMyPresence }, point: TPoint, pressure: number) => {
      setMyPresence({
        pencilDraft: [[point.x, point.y, pressure]],
        pencilColor: lastUsedColor,
      });
    },
    [lastUsedColor]
  );

  const continueDrawing = useMutation(
    ({ self, setMyPresence }, point: TPoint, event: PointerEvent) => {
      const { pencilDraft } = self.presence;

      if (
        canvasState.mode !== ECanvasMode.Pencil ||
        event.buttons !== 1 ||
        pencilDraft == null
      )
        return;

      setMyPresence({
        cursor: point,
        pencilDraft:
          pencilDraft.length === 1 &&
          pencilDraft[0][0] === point.x &&
          pencilDraft[0][1] === point.y
            ? pencilDraft
            : [...pencilDraft, [point.x, point.y, event.pressure]],
      });
    },
    [canvasState.mode]
  );

  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const { pencilDraft } = self.presence;

      if (
        pencilDraft == null ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null });
        return;
      }

      const id = nanoid();
      liveLayers.set(
        id,
        new LiveObject(penPointsToPath(pencilDraft, lastUsedColor))
      );

      const liveLayerIds = storage.get("layerIds");
      liveLayerIds.push(id);

      setMyPresence({ pencilDraft: null });
      setCanvasState({ mode: ECanvasMode.Pencil });
    },
    [lastUsedColor]
  );

  const insertLayer = useMutation(
    (
      { setMyPresence, storage },
      ElayerType:
        | ELayerType.Rectangle
        | ELayerType.Ellipse
        | ELayerType.Text
        | ELayerType.Sticker,
      position: TPoint
    ) => {
      const liveLayers = storage.get("layers");
      if (liveLayers.size >= MAX_LAYERS) return;

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      const layer = new LiveObject({
        type: ElayerType,
        x: position.x,
        y: position.y,
        height: 100,
        width: 100,
        fill: lastUsedColor,
      });

      liveLayerIds.push(layerId);
      liveLayers.set(layerId, layer);

      setMyPresence({ selection: [layerId] }, { addToHistory: true });
      setCanvasState({ mode: ECanvasMode.None });
    },
    [lastUsedColor]
  );

  const moveSelectedLayer = useMutation(
    ({ storage, self }, point: TPoint) => {
      if (canvasState.mode !== ECanvasMode.Moving) return;

      document.body.style.cursor = "grab";

      const offset = {
        x: point.x - canvasState.current.x,
        y: point.y - canvasState.current.y,
      };

      const liveLayers = storage.get("layers");
      for (const id of self.presence.selection) {
        const layer = liveLayers.get(id);

        if (layer) {
          layer.update({
            x: layer.get("x") + offset.x,
            y: layer.get("y") + offset.y,
          });
        }
      }

      setCanvasState({ mode: ECanvasMode.Moving, current: point });
    },
    [canvasState]
  );

  const resizeSelectedLayer = useMutation(
    ({ storage, self }, point: TPoint) => {
      if (canvasState.mode !== ECanvasMode.Resizing) return;

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.corner,
        point
      );

      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(self.presence.selection[0]);

      if (layer) {
        layer.update(bounds);
      }
    },
    [canvasState]
  );

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selection.length > 0)
      setMyPresence({ selection: [] }, { addToHistory: true });
  }, []);

  const startMultiSelection = useCallback((cursor: TPoint, origin: TPoint) => {
    const pointDiffer =
      Math.abs(cursor.x - origin.x) + Math.abs(cursor.x - origin.y);
    if (pointDiffer > SELECTION_NET_THRESHOLD)
      setCanvasState({
        mode: ECanvasMode.SelectionNet,
        origin,
        current: cursor,
      });
  }, []);

  const updateSelectionNet = useMutation(
    ({ storage, setMyPresence }, cursor: TPoint, origin: TPoint) => {
      const layers = storage.get("layers").toImmutable();
      setCanvasState({
        mode: ECanvasMode.SelectionNet,
        origin,
        current: cursor,
      });

      const ids = findIntersectingLayersWithRectangle(
        layerIds!,
        layers,
        origin,
        cursor
      );

      setMyPresence({ selection: ids });
    },
    [layerIds]
  );

  const onResizeHandlePointerDown = useCallback(
    (corner: ESide, initialBounds: TXYWH) => {
      history.pause();
      setCanvasState({ mode: ECanvasMode.Resizing, initialBounds, corner });
    },
    [history]
  );

  const onWheel = useCallback((e: WheelEvent) => {
    setCamera((camera) => ({ x: camera.x - e.deltaX, y: camera.y - e.deltaY }));
  }, []);

  const onPointerMove = useMutation(
    ({ setMyPresence }, e: PointerEvent) => {
      e.preventDefault();

      const currentCursor = pointerEventToCanvasPoint(e, camera);

      if (canvasState.mode === ECanvasMode.Pressing) {
        startMultiSelection(currentCursor, canvasState.origin);
      } else if (canvasState.mode === ECanvasMode.SelectionNet) {
        updateSelectionNet(currentCursor, canvasState.origin);
      } else if (canvasState.mode === ECanvasMode.Moving) {
        moveSelectedLayer(currentCursor);
      } else if (canvasState.mode === ECanvasMode.Resizing) {
        resizeSelectedLayer(currentCursor);
      } else if (canvasState.mode === ECanvasMode.Pencil) {
        continueDrawing(currentCursor, e);
      }

      setMyPresence({ cursor: currentCursor });
    },
    [
      camera,
      canvasState,
      resizeSelectedLayer,
      moveSelectedLayer,
      startMultiSelection,
      updateSelectionNet,
      continueDrawing,
    ]
  );

  const onPointerLeave = useMutation(
    ({ setMyPresence }) => setMyPresence({ cursor: null }),
    []
  );

  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      const point = pointerEventToCanvasPoint(e, camera);
      if (canvasState.mode === ECanvasMode.Inserting) return;

      if (canvasState.mode === ECanvasMode.Pencil) {
        startDrawing(point, e.pressure);
        return;
      }

      setCanvasState({ mode: ECanvasMode.Pressing, origin: point });
    },
    [camera, canvasState.mode, setCanvasState, startDrawing]
  );

  const onPointerUp = useMutation(
    ({}, e) => {
      document.body.style.cursor = "default";
      const point = pointerEventToCanvasPoint(e, camera);

      if (
        canvasState.mode === ECanvasMode.None ||
        canvasState.mode === ECanvasMode.Pressing
      ) {
        unselectLayers();
        setCanvasState({ mode: ECanvasMode.None });
      } else if (canvasState.mode === ECanvasMode.Pencil) {
        insertPath();
      } else if (canvasState.mode === ECanvasMode.Inserting)
        insertLayer(canvasState.layerType, point);
      else setCanvasState({ mode: ECanvasMode.None });

      history.resume();
    },
    [
      camera,
      canvasState,
      history,
      setCanvasState,
      insertLayer,
      unselectLayers,
      insertPath,
    ]
  );

  const onLayerPointerDown = useMutation(
    ({ self, setMyPresence }, e: PointerEvent, layerId: string) => {
      if (
        canvasState.mode === ECanvasMode.Pencil ||
        canvasState.mode === ECanvasMode.Inserting
      )
        return;

      history.pause();
      e.stopPropagation();

      const point = pointerEventToCanvasPoint(e, camera);

      if (!self.presence.selection.includes(layerId))
        setMyPresence({ selection: [layerId] }, { addToHistory: true });

      setCanvasState({ mode: ECanvasMode.Moving, current: point });
    },
    [setCanvasState, camera, history, canvasState.mode]
  );

  const selections = useOthersMapped((other) => other.presence.selection);

  const layerIdsToColorSelection = useMemo(() => {
    const ret: Record<string, string> = {};

    for (const user of selections) {
      const [connctionId, selection] = user;
      for (const layerId of selection)
        ret[layerId] = connectionIdToColor(connctionId);
    }

    return ret;
  }, [selections]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "z": {
          if (e.ctrlKey || e.metaKey) {
            if (e.shiftKey) history.redo();
            else history.undo();
          }
          break;
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [deleteLayers, history]);

  return (
    <main className="relative w-full h-full bg-neutral-100 touch-none">
      <Info boardId={boardId} />
      <Participants />
      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        undo={history.undo}
        redo={history.redo}
        canRedo={canRedo}
        canUndo={canUndo}
      />
      <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor} />
      <svg
        className="h-screen w-screen"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
      >
        <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)` }}>
          {layerIds?.map((layerId) => (
            <LayerPreview
              key={layerId}
              id={layerId}
              onLayerPointerDown={onLayerPointerDown}
              selectionColor={layerIdsToColorSelection[layerId]}
            />
          ))}
          <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
          {canvasState.mode === ECanvasMode.SelectionNet &&
            canvasState.current != null && (
              <rect
                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                x={Math.min(canvasState.origin.x, canvasState.current?.x)}
                y={Math.min(canvasState.origin.y, canvasState.current?.y)}
                width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                height={Math.abs(canvasState.origin.y - canvasState.current.y)}
              />
            )}
          <CursorsPresence />
          {pencilDraft != null && pencilDraft.length > 0 && (
            <Path
              points={pencilDraft}
              fill={rgbToHex(lastUsedColor)}
              x={0}
              y={0}
            />
          )}
        </g>
      </svg>
    </main>
  );
}
