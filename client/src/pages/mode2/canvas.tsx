import { useEffect, useRef, useState } from "react";
import playerImgSource from '../../images/player.png';
import playerLeftImgSource from '../../images/player_left.png';

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

//image loading
let imageLoaded = false;
let imageLoadedLeft = false;
const playerImgLeft = new Image();
const playerImg = new Image();
playerImgLeft.src = playerLeftImgSource;
playerImg.src = playerImgSource;
playerImg.onload = () => {
    imageLoaded = true;
    console.log("image loaded");
};
playerImgLeft.onload = () => {
    imageLoadedLeft = true;
    console.log("image left loaded");
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
    const [prevMousePos, setPrevMousePos] = useState<{x: number, y: number } | null>(null);
    const [direction, setDirection] = useState<string | null>(null);

    const getCanvasOffset = () => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) {
            return { x: 0, y: 0 };
        }
        return { x: rect.left, y: rect.top };
    }

    const toScreenPos = (pos: vec2) => {

        return {
            x: pos.x * canvasSize.x,
            y: canvasSize.y - pos.y * canvasSize.y,
        };
    };

    const drawPlayer = (context: CanvasRenderingContext2D, gameData: GameData) => {
        context.beginPath();
        context.imageSmoothingEnabled = false;
        const player = toScreenPos(gameData.playerPos);
            // HitBox ---------------------------------------------------
            // context.arc(player.x, player.y, 0.05 * canvasSize.x, 0, 2 * Math.PI);
        context.stroke();

        if (imageLoaded ) { // && imageLoadedLeft
            if (direction === 'right') {
                context.drawImage(playerImg, player.x - 0.057 * canvasSize.x, player.y - 0.07 * canvasSize.x, 0.12 * canvasSize.x, 0.12 * canvasSize.x);
            } else if (direction === 'left') {
                context.drawImage(playerImg, player.x - 0.057 * canvasSize.x, player.y - 0.07 * canvasSize.x, -0.12 * canvasSize.x, 0.12 * canvasSize.x);
            }
        }
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
            const handleMouseMove = (event: MouseEvent) => {
                const adjustedEvent = {
                    ...event,
                    clientX: event.clientX - getCanvasOffset().x,
                    clientY: event.clientY - getCanvasOffset().y,
                };
                if (prevMousePos) {
                    const newDirection = adjustedEvent.clientX > prevMousePos.x ? 'right' : 'left';
                    setDirection(newDirection);
                    // TO DO set direction
                }
                setPrevMousePos({ x: adjustedEvent.clientX, y: adjustedEvent.clientY });

                onMouseMove(adjustedEvent);
            };
          canvas.addEventListener('mousemove', handleMouseMove, true);
    
          return () => {
            canvas.removeEventListener('mousemove', handleMouseMove, true);
          };
        }
    }, [prevMousePos, onMouseMove]);

    useEffect(() => {
        function draw(context: CanvasRenderingContext2D) {
            if (context && onTick !== undefined) {
                // draw background
                context.fillStyle = 'var(--backgroundColor)';
                context.fillRect(0, 0, canvasSize.x, canvasSize.y);

                const lastTime = lastTimeRef?.current ?? 0;
                const currentTime = performance.now();
                const gameData = onTick(context, currentTime - lastTime);
                if (gameData !== undefined) {
                    setLastTime(currentTime);
                    drawText(context, gameData);
                    drawPlayer(context, gameData);
                }
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
    }, [canvasSize, onTick, canvasRef]);

    return <canvas ref={canvasRef} style={{ cursor: 'none'}}/>;
}

export default Canvas;
