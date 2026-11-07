import { useEffect, useRef } from 'react';
import type { Project } from '../../types/project';
import type { Sprite } from '../../types/sprite';
import { canvasToScratch, scratchToCanvas, spriteRenderSize, STAGE_HEIGHT, STAGE_WIDTH } from './stageMath';

type StageCanvasProps = {
  project: Project;
  onSpriteClick?: (spriteId: string) => void;
};

export function StageCanvas({ project, onSpriteClick }: StageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const projectRef = useRef(project);
  const imageCacheRef = useRef(new Map<string, HTMLImageElement>());
  const redrawRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    projectRef.current = project;
    redrawRef.current();
  }, [project]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return undefined;
    }

    redrawRef.current = () => {
      drawStage(context, projectRef.current, imageCacheRef.current, () => redrawRef.current());
    };

    redrawRef.current();
    return () => {
      redrawRef.current = () => undefined;
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const canvasX = ((event.clientX - rect.left) / rect.width) * STAGE_WIDTH;
    const canvasY = ((event.clientY - rect.top) / rect.height) * STAGE_HEIGHT;
    const point = canvasToScratch(canvasX, canvasY);

    const clicked = [...projectRef.current.sprites]
      .reverse()
      .find((sprite) => sprite.visible && isPointInsideSprite(point.x, point.y, sprite));

    if (clicked) {
      onSpriteClick?.(clicked.id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    const activeSprite = projectRef.current.sprites.find(
      (sprite) => sprite.id === projectRef.current.activeSpriteId && sprite.visible,
    ) ?? projectRef.current.sprites.find((sprite) => sprite.visible);
    if (activeSprite) {
      event.preventDefault();
      onSpriteClick?.(activeSprite.id);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={STAGE_WIDTH}
      height={STAGE_HEIGHT}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      className="aspect-[4/3] w-full cursor-pointer rounded-3xl border-4 border-white bg-sky-100 shadow-soft"
      aria-label="Project stage. Click a character to run its click blocks."
    />
  );
}

function drawStage(
  context: CanvasRenderingContext2D,
  project: Project,
  imageCache: Map<string, HTMLImageElement>,
  requestRedraw: () => void,
): void {
  const backdrop = project.backdrops.find((item) => item.id === project.stageState.backdropId) ?? project.backdrops[0];
  const gradient = context.createLinearGradient(0, 0, 0, STAGE_HEIGHT);
  gradient.addColorStop(0, backdrop?.color ?? '#BAE6FD');
  gradient.addColorStop(1, '#F8FAFC');
  context.fillStyle = gradient;
  context.fillRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

  context.save();
  context.globalAlpha = 0.38;
  context.fillStyle = '#FFFFFF';
  for (let i = 0; i < 8; i += 1) {
    context.beginPath();
    context.arc(40 + i * 65, 48 + (i % 2) * 34, 22 + (i % 3) * 8, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();

  project.sprites.forEach((sprite) => {
    if (!sprite.visible) {
      return;
    }

    drawSprite(context, sprite, imageCache, requestRedraw);
  });
}

function drawSprite(
  context: CanvasRenderingContext2D,
  sprite: Sprite,
  imageCache: Map<string, HTMLImageElement>,
  requestRedraw: () => void,
): void {
  const position = scratchToCanvas(sprite.x, sprite.y);
  const renderSize = spriteRenderSize(sprite.size);
  const costume = sprite.costumes.find((item) => item.id === sprite.currentCostumeId) ?? sprite.costumes[0];
  const image = costume ? getImage(costume.dataUrl, imageCache, requestRedraw) : undefined;

  context.save();
  context.translate(position.x, position.y);
  context.rotate(((sprite.direction - 90) * Math.PI) / 180);

  if (image?.complete && image.naturalWidth > 0) {
    context.drawImage(image, -renderSize / 2, -renderSize / 2, renderSize, renderSize);
  } else {
    context.fillStyle = sprite.color;
    context.beginPath();
    context.arc(0, 0, renderSize / 2, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#111827';
    context.beginPath();
    context.arc(-renderSize * 0.14, -renderSize * 0.1, 4, 0, Math.PI * 2);
    context.arc(renderSize * 0.14, -renderSize * 0.1, 4, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();

  if (sprite.speech?.text) {
    drawSpeech(context, position.x, position.y - renderSize / 2 - 16, sprite.speech.text);
  }
}

function drawSpeech(context: CanvasRenderingContext2D, x: number, y: number, text: string): void {
  const width = Math.min(210, Math.max(84, text.length * 8 + 28));
  const height = 42;
  const left = Math.min(STAGE_WIDTH - width - 8, Math.max(8, x - width / 2));
  const top = Math.max(8, y - height);

  context.save();
  context.fillStyle = '#FFFFFF';
  context.strokeStyle = '#CBD5E1';
  context.lineWidth = 2;
  roundRect(context, left, top, width, height, 12);
  context.fill();
  context.stroke();
  context.fillStyle = '#111827';
  context.font = '600 14px Inter, system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text.slice(0, 28), left + width / 2, top + height / 2);
  context.restore();
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function getImage(
  dataUrl: string,
  imageCache: Map<string, HTMLImageElement>,
  requestRedraw: () => void,
): HTMLImageElement {
  const cached = imageCache.get(dataUrl);
  if (cached) {
    return cached;
  }

  const image = new Image();
  image.addEventListener('load', requestRedraw, { once: true });
  image.src = dataUrl;
  imageCache.set(dataUrl, image);
  return image;
}

function isPointInsideSprite(x: number, y: number, sprite: Sprite): boolean {
  const radius = spriteRenderSize(sprite.size) / 2;
  return x >= sprite.x - radius && x <= sprite.x + radius && y >= sprite.y - radius && y <= sprite.y + radius;
}
