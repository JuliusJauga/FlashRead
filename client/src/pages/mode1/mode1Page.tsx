import React from 'react';
import { Button, Container, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import axios from '../../components/axiosWrapper';
import * as mode1Task from './mode1Task';
import Timer, { TimerHandle } from '../../components/timer';
import TimerInput from '../../components/timerInput';
import { useRef } from 'react';
import ModeButton from '../home/modeButton';
import ChoiceBox from '../../components/choiceBox';
import QuestionPoints from './questionPoints';
import { useNavigate } from 'react-router-dom';
import '../../boards/css/main.board.css';
import CustomButton from '../../components/buttons/customButton';
import '../../boards/css/buttons.css';
import AnimatedText from '../../components/animatedText';



const Mode1Page: React.FC = () => {
    const navigate = useNavigate();
    const timerRef = useRef(null);
    const [mode1Data, setMode1Data] = React.useState<mode1Task.Mode1TaskData | undefined>(undefined);
    const [initialTime, setInitialTime] = React.useState<number>(0);
    const [mode1Theme, setMode1Theme] = React.useState<string>("Any");
    const [mode1Difficulty, setMode1Difficulty] = React.useState<string>("Any");
    const [mode1Answers, setMode1Answers] = React.useState<number[]>([]);

    const handleTimeChange = (seconds: number) => {
        setInitialTime(seconds);
      };

    function getCurrentTime() {
        if (timerRef && timerRef.current) {
          return Math.abs((timerRef.current as TimerHandle).getTime() - initialTime);
        }
        return 0;
    }

    return (
        <div className='Mode1_content'>
            <div className="MainBoard_mode1" id="mode1Div">

            <div className="mode1_upperDiv" id="upperDiv">
                <div className="mode1_upperDiv_box" id="mode1_upperDiv_box">
                <div className="mode1_upperDiv_parts" id="mode1_upperDiv_parts">
                    <ChoiceBox choices={["History", "Technology", "Anime", "Politics"]} prompt='Theme:' onSelect={choice => setMode1Theme(choice)} label="Theme:"/>
                </div>
                <div className="mode1_upperDiv_parts" id="mode1_upperDiv_parts">
                    <ChoiceBox choices={["Easy", "Medium", "Hard", "EXTREME"]} prompt='Difficulty:' onSelect={choice => setMode1Difficulty(choice)} label="Difficulty:"/>
                </div>
                <div className="mode1_upperDiv_parts" id="mode1_upperDiv_parts">
                    <div className="mode1_timerInput">
                    <label htmlFor="mode1TimerInput" className="mode1_timerInputLabel">Timer:</label>
                    <TimerInput onTimeChange={handleTimeChange} className="mode1_timerInputSelect" id="mode1TimerInput"  />
                    </div>
                </div>
                </div>
            </div>

            <div className="mode1_innerDiv" id="textAreaDiv">
                <div className="mode1_mainBox" id="mode1_mainBox">
                <div className="mode1_textDiv" id="mode1_textDiv">
                    
                    <p className="mode1_text" id="mode1_text">
                    {mode1Data && (
                        <AnimatedText text={mode1Data?.text || ""} />
                    )}
                    </p>
                </div>
                <div className="mode1_answerDiv" id="mode1_answerDiv">
                    <div className="mode1_questionsContainer" id="mode1_questionsContainer">
                    {(mode1Data && mode1Data.questions) && <QuestionPoints 
                        questions={mode1Data.questions}
                        onChanged={p=>setMode1Answers(p)}
                    />}
                    </div>              
                </div>
                <div className="mode1_resultDiv" id="mode1_resultDiv">
                    <div className="mode1_resultAnswerContainer" id="mode1_resultContainer">
                        {mode1Data && mode1Data.answers && <QuestionPoints
                            questions={mode1Data.answers}
                        />}
                    </div>              
                    <div className="mode1_resultsContainer" id="mode1_resultContainer">
                        <div className="correctAnswersDisplayDiv">
                            <span className="mode1_Text">Correct answers: </span>
                            <span className="mode1_Text">{mode1Data?.statistics?.correct + '/' + mode1Data?.statistics?.total}</span>
                        </div>
                        <div className="WPMDisplayDiv">
                            <span className="mode1_Text">Words per minute: </span>
                            <span className="mode1_Text">{mode1Data?.statistics?.wpm}</span>                            
                        </div>
                    </div>
                </div>
                <div className="mode1_start_options">
                    <Timer ref={timerRef} initialTime={initialTime} id = "mode1_startButton" onClick= {() => {
                    const startButton = document.getElementById("mode1_startButton") as HTMLButtonElement;
                    const mode1AnswerDiv = document.getElementById("mode1_answerDiv") as HTMLDivElement;
                    const mode1ResultDiv = document.getElementById("mode1_resultDiv") as HTMLDivElement;
                    const mode1TextDiv = document.getElementById("mode1_textDiv") as HTMLDivElement;

                    if (startButton.textContent === "Start") {
                        mode1Task.requestTask1Data({
                        taskId: 1,
                        theme: mode1Theme,
                        difficulty: mode1Difficulty
                        }).then(response => {
                        setMode1Data(response);
                        });
                    }
                    if (startButton.textContent === "Stop") {
                        mode1TextDiv.style.visibility = "hidden";
                        mode1AnswerDiv.style.visibility = "visible";
                        // remove text
                        const newData = mode1Data;
                        if (newData) {
                        newData.text = "";
                        setMode1Data(newData);
                        }
                    }
                    if (startButton.textContent === "Confirm") {
                        mode1AnswerDiv.style.visibility = "hidden";
                        mode1ResultDiv.style.visibility = "visible";
                        if (mode1Data) {
                        mode1Task.submitTask1Answers({
                            session: mode1Data.session,
                            selectedVariants: mode1Answers,
                            timeTaken: getCurrentTime(),
                        }).then(response => {
                            response.session = mode1Data.session;
                            response.answers?.forEach((answer, index) => {
                            answer.selectedVariant = index < mode1Answers.length ? mode1Answers[index] : -1;
                            });
                            setMode1Data(response);
                        })
                        } else {
                        console.error("No data to submit");
                        }
                    }
                    if (startButton.textContent === "Again") {
                        setMode1Data(undefined);
                        mode1TextDiv.style.visibility = "visible";
                        mode1ResultDiv.style.visibility = "hidden";
                    }
                    }} onComplete={() => {
                    const mode1AnswerDiv = document.getElementById("mode1_answerDiv") as HTMLDivElement;
                    const mode1TextDiv = document.getElementById("mode1_textDiv") as HTMLDivElement;
                    mode1TextDiv.style.visibility = "hidden";
                    mode1AnswerDiv.style.visibility = "visible";
                    // remove text
                    const newData = mode1Data;
                    if (newData) {
                        newData.text = "";
                        setMode1Data(newData);
                    }
                    }} />
                </div>
                </div>
            </div>

            <div className="mode1_lowerDiv" id="buttonDiv">
                <CustomButton label="Return" className="wideButton" id="MainBoard_returnButton" onClick={() => navigate("/home")}/>
            </div>

            </div>
        </div>
    );
};

export default Mode1Page;