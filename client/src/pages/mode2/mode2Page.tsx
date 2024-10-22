import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../boards/css/main.board.css';
import CustomButton from '../../components/buttons/customButton';
import '../../boards/css/buttons.css';
import Mode2Task from './mode2Task';
import "../../boards/css/mode2.css";
import * as apiTask from './api';
import ChoiceBox from '../../components/choiceBox';


const Mode2Page: React.FC = () => {
    const navigate = useNavigate();
    const [points, setPoints] = React.useState<number>(0);
    const [mode2Theme, setMode2Theme] = React.useState<string>("Any");
    const [mode2Difficulty, setMode2Difficulty] = React.useState<string>("Any");
    const [gameStarted, setGameStarted] = React.useState<boolean>(false);
    const [textArray, setTextArray] = React.useState<string[]>([]);
    const [fillerArray, setFillerArray] = React.useState<string[]>([]);

    return (
        <div className='Mode2_content'>
            <div className="mode2_upperDiv">
                <ChoiceBox choices={["History", "Technology", "Anime"]} prompt='Theme:' onSelect={choice => setMode2Theme(choice)} label="Theme:"/>
                <ChoiceBox choices={["Easy", "Medium", "Hard", "EXTREME"]} prompt='Difficulty:' onSelect={choice => setMode2Difficulty(choice)} label="Difficulty:"/>
            </div>
            <div className="mode2_centerDiv" id="mode2Div">
                <div className="points">
                    <p className="pointsText">Points:</p>
                    <p className="pointsText" id="points">{points}</p>
                </div>
                <div className="w-full h-full gamePage">
                    <Mode2Task wordArray = {textArray} fillerArray = {fillerArray} gameStarted={gameStarted} setPoints={setPoints} />
                </div>
            </div>
            <div className="mode2_lowerDiv" id="buttonDiv">
                <div className="mode2_lowerUpperDiv">
                    <CustomButton label="Start" className="wideButton" id="MainBoard_restartButton" onClick={() => {
                        apiTask.requestTask2Data({taskId: 3, theme: mode2Theme }).then((data => {
                            setTextArray(data.wordArray);
                            setGameStarted(true); 
                        }))
                        apiTask.requestTask2Data({taskId: 3, theme: "Fillers" }).then((data => {
                            setFillerArray(data.wordArray);
                        }))
                    }}/>
                </div>
                <div>
                    <CustomButton label="Return" className="wideButton" id="MainBoard_returnButton" onClick={() => navigate("/home")}/>
                </div>
            </div>
        </div>
    );
};

export default Mode2Page;