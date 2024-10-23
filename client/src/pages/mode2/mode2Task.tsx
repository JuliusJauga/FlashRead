import Canvas from "./canvas";
import { vec2, droppingText, GameData } from "./canvas";
import { useState, useRef, useEffect } from "react";
import * as apiTask from './api';

// Temporary for presentation
interface Mode2TaskProps {
    wordArray: string[];
    fillerArray: string[];
    gameStarted: boolean;
    setPoints: (points: number) => void;
    setCombo: (combo: number) => void;
    difficulty: string;
}


const mode2Task: React.FC <Mode2TaskProps> = ({ wordArray, fillerArray, gameStarted, setPoints, setCombo, difficulty }) => {
    const [canvasSize, setCanvasSize] = useState<vec2>({ x: 1200, y: 600 });
    const [playerPos, setPlayerPos] = useState<vec2>({ x: 0, y: 0.1});
    const [textArray, setTextArray] = useState<droppingText[]>([]);
    const playerPosRef = useRef<vec2>(); playerPosRef.current = playerPos;
    const textArrayRef = useRef<droppingText[]>(); textArrayRef.current = textArray;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const onTickRef = useRef<((context: CanvasRenderingContext2D, dt: number) => GameData | undefined) | undefined>(undefined);
    let points = 0;
    let combo = 0;

    const getCanvasOffset = () => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const offsetX =  rect.left; // Mouse position relative to the canvas
            return offsetX;
        }
        return 0;
    };

    const handleMouseMove = (e: any) => {

        const pos = { x: e.clientX / canvasSize.x - getCanvasOffset(), y: 0.1 };
        setPlayerPos(pos);
    };
    
    useEffect(() => {
        const temp = (context: CanvasRenderingContext2D, dt: number) => {
            if (context === undefined) return undefined;
            if (!gameStarted) return undefined;
            if (playerPosRef === undefined || playerPosRef.current === undefined) return undefined;
            if (textArrayRef === undefined || textArrayRef.current === undefined) return undefined;
            
            const playerRadius = 0.05;
            const textArray = textArrayRef.current;
            // spawn new text
            let difficultyInt = 0.001;
            
            console.log(difficulty);

            if (difficulty === "Easy") {
                difficultyInt = 0.005;
            } else if (difficulty === "Medium") {
                difficultyInt = 0.007;
            } else if (difficulty === "Hard") {
                difficultyInt = 0.009;
            } else if (difficulty === "EXTREME") {
                difficultyInt = 0.02;
            } else {
                difficultyInt = 0.005;
            }

            if (Math.random() < difficultyInt * 2 && textArray.length < difficultyInt * 400) {
                const texts = fillerArray.concat(wordArray);
                const text = texts[Math.floor(Math.random() * texts.length)];
                const angle = 0;
                const color = "black";
                const pos = { x: Math.random() * 0.8 + 0.1, y: 1 };
                const rotSpeed = (Math.random() < 0.5 ? -1 : 1) * 
                Math.min(Math.max(0.0002, Math.random() * 0.01), difficultyInt / 4);
                const fallSpeed = Math.min(Math.max(0.0002,  Math.random() * 0.001), difficultyInt / 20);
                const size = Math.floor(Math.random() * 20 + 20);
                textArray.push({ text, pos, color, angle, rotSpeed, fallSpeed, size });
            }
    
            // collisions
            for (let i = 0; i < textArray.length; i++) {
                setPoints(points);
                setCombo(combo);
    
                const text = textArray[i];
                    if (text === undefined) {
                        textArray.splice(i, 1);
                        continue;
                    }
                // move the text
                text.pos.y -= text.fallSpeed * dt;
                text.angle += text.rotSpeed * dt;
    
                const playerPos = {x: playerPosRef.current.x, y: playerPosRef.current.y};
                
                // get text size and pos
                const metrics = context.measureText(text.text);
                const width = metrics.width / canvasSize.x;
                const height = (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) / canvasSize.y;
                
                const centerPos = {x: text.pos.x, y: text.pos.y + height / 2};
                const aspectRatio = canvasSize.x / canvasSize.y;
                const minPos = {x: centerPos.x - width / 2, y: centerPos.y - height / 2 * aspectRatio};
                const maxPos = {x: centerPos.x + width / 2, y: centerPos.y + height / 2 * aspectRatio};
    
                // Rotate circle's center point back
                const unrotatedPlayer = {
                    x: Math.cos(text.angle) * (playerPos.x - centerPos.x) -
                       Math.sin(text.angle) * (playerPos.y - centerPos.y) + centerPos.x,
                    y: Math.sin(text.angle) * (playerPos.x - centerPos.x) +
                       Math.cos(text.angle) * (playerPos.y - centerPos.y) + centerPos.y
                };
    
                let closestPoint = {x: 0, y: 0};
                if (unrotatedPlayer.x < minPos.x)
                    closestPoint.x = minPos.x;
                else if (unrotatedPlayer.x > maxPos.x)
                    closestPoint.x = maxPos.x;
                else
                    closestPoint.x = unrotatedPlayer.x;
    
                if (unrotatedPlayer.y < minPos.y)
                    closestPoint.y = minPos.y;
                else if (unrotatedPlayer.y > maxPos.y)
                    closestPoint.y = maxPos.y;
                else
                    closestPoint.y = unrotatedPlayer.y;
    
                const a = Math.abs(unrotatedPlayer.x - closestPoint.x);
                const b = Math.abs(unrotatedPlayer.y - closestPoint.y);
                const distance = Math.sqrt((a * a) + (b * b));
    
    
                if (text.pos.y < 0) {
                    apiTask.requestTask2Points({taskId: 2, wordArray: wordArray, collectedWord: textArray[i].text, currentCombo: combo, currentPoints: points, collision: false}).then((data) => {
                        points = data.points;
                        combo = data.combo;
                    });
                    textArray.splice(i, 1);
                    i--;
                    continue;
                }
                if (distance > playerRadius) continue;
                
                apiTask.requestTask2Points({taskId: 2, wordArray: wordArray, collectedWord: textArray[i].text, currentCombo: combo, currentPoints: points, collision: true}).then((data) => {
                    points = data.points;
                    combo = data.combo;
                });
                textArray.splice(i, 1);
                i--;
            }
    
    
            return {
                playerPos: playerPosRef.current,
                textArray: textArray,
            };
        };
        onTickRef.current = temp;
    }, [gameStarted]);

    return (
        <>
            <Canvas
                canvasSize={canvasSize}
                onTick={onTickRef.current}
                onMouseMove={handleMouseMove}
            />
        </>
    );
};

export default mode2Task;