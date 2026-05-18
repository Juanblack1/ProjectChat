import { useI18n } from "@/utils/useI18n";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

const MAX_CANVAS_SIZE = 1600;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

const loadImage = (src) => new Promise((resolve, reject) => {
  const image = new window.Image();
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = src;
});

function ImageCanvasEditor({
  imageSrc,
  initialImageSrc,
  title,
  confirmLabel,
  resetLabel,
  busy = false,
  defaultDrawMode = false,
  onClose,
  onConfirm,
  onReset,
}) {
  const { t } = useI18n();
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [drawMode, setDrawMode] = useState(defaultDrawMode);
  const [brushColor, setBrushColor] = useState("#00a884");
  const [brushSize, setBrushSize] = useState(6);
  const [undoStack, setUndoStack] = useState([]);
  const [error, setError] = useState("");

  const drawSource = useCallback(async (source) => {
    const canvas = canvasRef.current;
    if (!canvas || !source) return;

    try {
      const image = await loadImage(source);
      const scale = Math.min(1, MAX_CANVAS_SIZE / image.naturalWidth, MAX_CANVAS_SIZE / image.naturalHeight);
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.width = width;
      canvas.height = height;
      setCanvasSize({ width, height });

      const context = canvas.getContext("2d");
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      setError("");
    } catch {
      setError(t("image.loadError"));
    }
  }, [t]);

  useEffect(() => {
    setUndoStack([]);
    setZoom(1);
    drawSource(initialImageSrc || imageSrc);
  }, [drawSource, imageSrc, initialImageSrc]);

  const getCanvasPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const startDrawing = (event) => {
    if (!drawMode || busy || !canvasRef.current) return;
    event.preventDefault();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const point = getCanvasPoint(event);

    setUndoStack((items) => [...items.slice(-14), canvas.toDataURL("image/png")]);
    drawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const draw = (event) => {
    if (!drawingRef.current || !drawMode || !canvasRef.current) return;
    event.preventDefault();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const point = getCanvasPoint(event);

    context.strokeStyle = brushColor;
    context.lineWidth = brushSize;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineTo(point.x, point.y);
    context.stroke();
  };

  const stopDrawing = () => {
    drawingRef.current = false;
  };

  const undo = () => {
    const previous = undoStack[undoStack.length - 1];
    if (!previous) return;
    setUndoStack((items) => items.slice(0, -1));
    drawSource(previous);
  };

  const resetCanvas = () => {
    setUndoStack([]);
    drawSource(imageSrc);
  };

  const confirm = () => {
    const canvas = canvasRef.current;
    if (!canvas || busy) return;
    onConfirm(canvas.toDataURL("image/png"));
  };

  return (
    <div className="fixed inset-0 z-[1200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
      <div className="bg-[#111b21] border border-conversation-border rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden">
        <div className="min-h-16 px-4 md:px-6 flex items-center justify-between border-b border-conversation-border bg-panel-header-background">
          <div>
            <h2 className="text-primary-strong font-semibold">{title || t("image.title")}</h2>
            <p className="text-secondary text-xs">{t("image.help")}</p>
          </div>
          <button className="text-panel-header-icon hover:text-primary-strong text-3xl" type="button" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 md:px-6 py-3 border-b border-conversation-border bg-search-input-container-background">
          <button type="button" className={`px-3 py-2 rounded-lg text-sm ${drawMode ? "bg-icon-green text-black" : "bg-panel-header-background text-primary-strong"}`} onClick={() => setDrawMode((value) => !value)}>
            {drawMode ? t("image.drawingOn") : t("image.draw")}
          </button>
          <button type="button" className="px-3 py-2 rounded-lg text-sm bg-panel-header-background text-primary-strong disabled:opacity-40" onClick={undo} disabled={!undoStack.length}>
            {t("image.undo")}
          </button>
          <button type="button" className="px-3 py-2 rounded-lg text-sm bg-panel-header-background text-primary-strong" onClick={resetCanvas}>
            {t("image.clear")}
          </button>
          {onReset && (
            <button type="button" className="px-3 py-2 rounded-lg text-sm bg-panel-header-background text-primary-strong" onClick={() => { onReset(); resetCanvas(); }}>
              {resetLabel || t("chat.removeDrawings")}
            </button>
          )}
          <div className="flex items-center gap-2 text-secondary text-sm ml-0 md:ml-2">
            <span>{t("image.color")}</span>
            <input type="color" value={brushColor} onChange={(event) => setBrushColor(event.target.value)} className="h-9 w-10 bg-transparent" />
          </div>
          <label className="flex items-center gap-2 text-secondary text-sm">
            {t("image.brush")}
            <input type="range" min="2" max="24" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} />
          </label>
          <div className="flex items-center gap-2 ml-auto">
            <button type="button" className="px-3 py-2 rounded-lg bg-panel-header-background text-primary-strong" onClick={() => setZoom((value) => Math.max(MIN_ZOOM, Number((value - 0.25).toFixed(2))))}>-</button>
            <span className="text-secondary text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button type="button" className="px-3 py-2 rounded-lg bg-panel-header-background text-primary-strong" onClick={() => setZoom((value) => Math.min(MAX_ZOOM, Number((value + 0.25).toFixed(2))))}>+</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar bg-[#0b141a] p-4">
          <div className="min-h-full flex items-start justify-center">
            <canvas
              ref={canvasRef}
              className={`rounded-xl shadow-2xl bg-black ${drawMode ? "cursor-crosshair touch-none" : "cursor-grab"}`}
              style={{
                width: canvasSize.width ? `${canvasSize.width * zoom}px` : undefined,
                height: canvasSize.height ? `${canvasSize.height * zoom}px` : undefined,
              }}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={stopDrawing}
              onPointerLeave={stopDrawing}
            />
          </div>
        </div>

        <div className="px-4 md:px-6 py-4 border-t border-conversation-border bg-panel-header-background flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="text-sm text-red-300 min-h-5">{error}</div>
          <div className="flex gap-3 justify-end">
            <button type="button" className="px-4 py-3 rounded-xl bg-search-input-container-background text-primary-strong" onClick={onClose}>{t("common.cancel")}</button>
            <button type="button" className="px-5 py-3 rounded-xl bg-icon-green text-black font-semibold disabled:opacity-60" onClick={confirm} disabled={busy || Boolean(error)}>
              {busy ? t("common.saving") : confirmLabel || t("image.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageCanvasEditor;
