import { useEffect, useRef, useState } from "react";

export type vec2 = {
    x: number;
    y: number;
};

export type droppingText = {
    text: string;
    pos: vec2;
    color: string;
    angle: number;
    rotSpeed: number;
    fallSpeed: number;
    size: number;
};

export type GameData = {
    playerPos: vec2;
    textArray: droppingText[];
};

const Canvas: React.FC<{
    canvasSize: vec2;
    onMouseMove: (event: MouseEvent) => void;
    onTick: ((context: CanvasRenderingContext2D, dt: number) => GameData | undefined) | undefined;
}> = ({ canvasSize, onTick, onMouseMove }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const frameRef = useRef<number>(0);
    const [lastTime, setLastTime] = useState(0);
    const lastTimeRef = useRef<number>(); lastTimeRef.current = lastTime;

    const toScreenPos = (pos: vec2) => {
        return {
            x: pos.x * canvasSize.x,
            y: canvasSize.y - pos.y * canvasSize.y,
        };
    };

    const drawPlayer = (context: CanvasRenderingContext2D, gameData: GameData) => {
        context.beginPath();
        const player = toScreenPos(gameData.playerPos);
        context.arc(player.x, player.y, 0.05 * canvasSize.x, 0, 2 * Math.PI);
        context.stroke();
    };

    const drawText = (context: CanvasRenderingContext2D, gameData: GameData) => {
        for (const text of gameData.textArray) {
            context.font = `${text.size}px Arial`;
            context.fillStyle = text.color;
            const pos = toScreenPos(text.pos);
            context.save();
            context.translate(pos.x, pos.y);
            context.rotate(text.angle);
            context.textAlign = "center";
            context.fillText(text.text, 0, 0);
            context.restore();
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.addEventListener('mousemove', onMouseMove, true);
    
          return () => {
            canvas.removeEventListener('mousemove', onMouseMove, true);
          };
        }
    }, [onMouseMove]);

    useEffect(() => {
        function draw(context: CanvasRenderingContext2D) {
            if (context && onTick) {
                // draw background
                context.fillStyle = "gray";
                context.fillRect(0, 0, canvasSize.x, canvasSize.y);
                
                const lastTime = lastTimeRef?.current ?? 0;
                const currentTime = performance.now();
                const gameData = onTick(context, currentTime - lastTime);
                if (gameData === undefined) return;
                setLastTime(currentTime);

                drawText(context, gameData);
                drawPlayer(context, gameData);

                frameRef.current = requestAnimationFrame(() => draw(context));
            }
        }
        if (canvasRef.current) {
            const context = canvasRef.current.getContext("2d");

            if (context) {
                context.canvas.width = canvasSize.x;
                context.canvas.height = canvasSize.y;

                frameRef.current = requestAnimationFrame(() => draw(context));
            }
        }
        return () => cancelAnimationFrame(frameRef.current);
    }, [canvasSize]);

    return <canvas ref={canvasRef} />;
}

export default Canvas;
