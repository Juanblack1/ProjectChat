import { useI18n } from "@/utils/useI18n";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";

const MAX_CANVAS_SIZE = 1600;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const DRAW_TOOLS = ["pen", "line", "arrow", "rectangle", "circle", "emoji"];
const EMOJI_STAMPS = ["✅", "⭐", "🔥", "❤️", "📌", "⚠️", "👍", "😀"];

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
  const draftImageRef = useRef(null);
  const startPointRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  const [activeTool, setActiveTool] = useState(defaultDrawMode ? "pen" : "move");
  const [brushColor, setBrushColor] = useState("#00a884");
  const [brushSize, setBrushSize] = useState(6);
  const [selectedEmoji, setSelectedEmoji] = useState("⭐");
  const [undoStack, setUndoStack] = useState([]);
  const [error, setError] = useState("");
  const drawMode = DRAW_TOOLS.includes(activeTool);

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
    setActiveTool(defaultDrawMode ? "pen" : "move");
    drawSource(initialImageSrc || imageSrc);
  }, [defaultDrawMode, drawSource, imageSrc, initialImageSrc]);

  const pushUndoState = useCallback((canvas) => {
    setUndoStack((items) => [...items.slice(-14), canvas.toDataURL("image/png")]);
  }, []);

  const applyStrokeStyle = useCallback((context) => {
    context.strokeStyle = brushColor;
    context.fillStyle = brushColor;
    context.lineWidth = brushSize;
    context.lineCap = "round";
    context.lineJoin = "round";
  }, [brushColor, brushSize]);

  const drawArrowHead = useCallback((context, from, to) => {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const headLength = Math.max(14, brushSize * 3);
    context.beginPath();
    context.moveTo(to.x, to.y);
    context.lineTo(to.x - headLength * Math.cos(angle - Math.PI / 6), to.y - headLength * Math.sin(angle - Math.PI / 6));
    context.moveTo(to.x, to.y);
    context.lineTo(to.x - headLength * Math.cos(angle + Math.PI / 6), to.y - headLength * Math.sin(angle + Math.PI / 6));
    context.stroke();
  }, [brushSize]);

  const drawShape = useCallback((context, tool, start, end) => {
    applyStrokeStyle(context);
    const width = end.x - start.x;
    const height = end.y - start.y;

    if (tool === "line" || tool === "arrow") {
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
      if (tool === "arrow") drawArrowHead(context, start, end);
      return;
    }

    if (tool === "rectangle") {
      context.strokeRect(start.x, start.y, width, height);
      return;
    }

    if (tool === "circle") {
      const centerX = start.x + width / 2;
      const centerY = start.y + height / 2;
      context.beginPath();
      context.ellipse(centerX, centerY, Math.abs(width / 2), Math.abs(height / 2), 0, 0, Math.PI * 2);
      context.stroke();
    }
  }, [applyStrokeStyle, drawArrowHead]);

  const drawEmoji = useCallback((context, point) => {
    const size = Math.max(24, brushSize * 5);
    context.save();
    context.fillStyle = "rgba(17, 27, 33, 0.72)";
    context.beginPath();
    context.arc(point.x, point.y, size * 0.62, 0, Math.PI * 2);
    context.fill();
    context.font = `${size}px sans-serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(selectedEmoji, point.x, point.y);
    context.restore();
  }, [brushSize, selectedEmoji]);

  const getCanvasPoint = useCallback((event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }, []);

  const startDrawing = useCallback((event) => {
    if (!drawMode || busy || !canvasRef.current) return;
    event.preventDefault();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const point = getCanvasPoint(event);

    pushUndoState(canvas);
    drawingRef.current = true;
    startPointRef.current = point;
    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is best effort; drawing still works without it.
    }

    if (activeTool === "emoji") {
      drawEmoji(context, point);
      drawingRef.current = false;
      return;
    }

    if (activeTool === "pen") {
      applyStrokeStyle(context);
      context.beginPath();
      context.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.moveTo(point.x, point.y);
      return;
    }

    draftImageRef.current = context.getImageData(0, 0, canvas.width, canvas.height);
  }, [activeTool, applyStrokeStyle, brushSize, busy, drawEmoji, drawMode, getCanvasPoint, pushUndoState]);

  const draw = useCallback((event) => {
    if (!drawingRef.current || !drawMode || !canvasRef.current) return;
    event.preventDefault();
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const point = getCanvasPoint(event);

    if (activeTool !== "pen") {
      if (draftImageRef.current) context.putImageData(draftImageRef.current, 0, 0);
      drawShape(context, activeTool, startPointRef.current, point);
      return;
    }

    applyStrokeStyle(context);
    context.lineTo(point.x, point.y);
    context.stroke();
  }, [activeTool, applyStrokeStyle, drawMode, drawShape, getCanvasPoint]);

  const stopDrawing = useCallback((event) => {
    if (!drawingRef.current) return;
    if (activeTool !== "pen" && activeTool !== "emoji" && event && startPointRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const point = getCanvasPoint(event);
      if (draftImageRef.current) context.putImageData(draftImageRef.current, 0, 0);
      drawShape(context, activeTool, startPointRef.current, point);
    }
    drawingRef.current = false;
    draftImageRef.current = null;
    startPointRef.current = null;
  }, [activeTool, drawShape, getCanvasPoint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    canvas.addEventListener("pointerdown", startDrawing);
    canvas.addEventListener("pointermove", draw);
    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);
    canvas.addEventListener("pointerleave", stopDrawing);

    return () => {
      canvas.removeEventListener("pointerdown", startDrawing);
      canvas.removeEventListener("pointermove", draw);
      canvas.removeEventListener("pointerup", stopDrawing);
      canvas.removeEventListener("pointercancel", stopDrawing);
      canvas.removeEventListener("pointerleave", stopDrawing);
    };
  }, [draw, startDrawing, stopDrawing]);

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
          <div className="flex flex-wrap items-center gap-2">
            {DRAW_TOOLS.map((tool) => (
              <button
                key={tool}
                type="button"
                className={`px-3 py-2 rounded-lg text-sm transition ${activeTool === tool ? "bg-icon-green text-black" : "bg-panel-header-background text-primary-strong hover:bg-background-default-hover"}`}
                onClick={() => setActiveTool(tool)}
              >
                {t(`image.tool.${tool}`)}
              </button>
            ))}
          </div>
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
          {activeTool === "emoji" && (
            <div className="flex items-center gap-1 rounded-lg bg-panel-header-background px-2 py-1">
              {EMOJI_STAMPS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`h-8 w-8 rounded-md text-lg ${selectedEmoji === emoji ? "bg-icon-green/80" : "hover:bg-background-default-hover"}`}
                  onClick={() => setSelectedEmoji(emoji)}
                  aria-label={`${t("image.emoji")}: ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
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
