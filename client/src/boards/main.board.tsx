import "./css/main.board.css";
import "./css/dropdown.css";
import "./css/mode1.css";
import "./css/loginPage.css";
import "./css/fonts.css";
import "./css/buttons.css";
import { requestTask1Data, submitTask1Answers, Mode1TaskData } from "./mode1Task.tsx";
import QuestionPoints from "./questionPoints.tsx";
import React, { useRef, useEffect } from 'react';
import CustomButton from "../components/buttons/customButton";
import Dropdown from "../components/dropdown";
import CustomHyperlink from '../components/buttons/hyperlink';
import TimerInput from "../components/timerInput.tsx";
import { createBoard } from "@wixc3/react-board";
import ChoiceBox from "../components/choiceBox";
import Timer, { TimerHandle } from "../components/timer";
import "./css/timer.css";

function handlePageChange(pageName: string, timerRef?: React.RefObject<TimerHandle>) {
  console.log("Page change clicked");

  const pages = {
    selectionPage: document.getElementById("selectionDiv") as HTMLDivElement,
    mode1Page: document.getElementById("mode1Div") as HTMLDivElement,
    loginPage: document.getElementById("loginPage") as HTMLDivElement,
    loginContainer: document.getElementById("loginContainer") as HTMLDivElement,
    registerContainer: document.getElementById("registerContainer") as HTMLDivElement,
  };
  const inputs = {
    signinEmailInput: document.getElementById("signinEmailInput") as HTMLInputElement,
    signinPasswordInput: document.getElementById("signinPasswordInput") as HTMLInputElement,
    registerEmailInput: document.getElementById("registerEmailInput") as HTMLInputElement,
    registerUsernameInput: document.getElementById("registerUsernameInput") as HTMLInputElement,
    registerPasswordInput: document.getElementById("registerPasswordInput") as HTMLInputElement,
    registerPasswordInput2: document.getElementById("registerPasswordInput2") as HTMLInputElement,
  };
  const modes_start = {
    startButton1: document.getElementById("mode1_startButton") as HTMLButtonElement,
  };

  const hideAllPages = () => {
    Object.values(pages).forEach(page => {
      page.style.display = "none";
    });
    Object.values(inputs).forEach(input => {
      input.value = "";
    });
    Object.values(modes_start).forEach(start => {
      start.textContent = "Start";
    });
  };

  hideAllPages();

  switch (pageName) {
    case "mode1Page": {
      pages.mode1Page.style.display = "flex";
      if (timerRef?.current) {
        timerRef.current.reset();
      }
      const mode1AnswerDiv = document.getElementById("mode1_answerDiv") as HTMLDivElement;
      const mode1ResultDiv = document.getElementById("mode1_resultDiv") as HTMLDivElement;
      const mode1TextDiv = document.getElementById("mode1_textDiv") as HTMLDivElement;
      mode1AnswerDiv.style.visibility = "hidden";
      mode1ResultDiv.style.visibility = "hidden";
      mode1TextDiv.style.visibility = "visible";
      break;
    }
    case "selectionPage":
      pages.selectionPage.style.display = "flex";
      break;

    case "loginPage":
      pages.loginPage.style.display = "flex";
      pages.loginContainer.style.display = "flex";
      pages.loginContainer.style.zIndex = "50";
      pages.registerContainer.style.zIndex = "0";
      break;

    case "registerPage":
      pages.loginPage.style.display = "flex";
      pages.registerContainer.style.display = "flex";
      pages.registerContainer.style.zIndex = "50";
      pages.loginContainer.style.zIndex = "0";
      break;

    default:
      console.log("Unknown page: " + pageName);
  }
}

const mainBoard = createBoard({
  name: "Main", 
  Board: () => {
    const timerRef = useRef(null);
    const [initialTime, setInitialTime] = React.useState<number>(0);
    const [isActive] = React.useState<boolean>(false);

    const [mode1Data, setMode1Data] = React.useState<Mode1TaskData | undefined>(undefined);
    const [mode1Theme, setMode1Theme] = React.useState<string>("Any");
    const [mode1Difficulty, setMode1Difficulty] = React.useState<string>("Any");
    const [mode1Answers, setMode1Answers] = React.useState<number[]>([]);

    useEffect(() => {
      if (isActive) {
        console.log("Component is active");
      }
    }, [isActive]);

    const handleTimeChange = (seconds: number) => {
      setInitialTime(seconds);
    };


    return (
      <div className="MainBoard_main" id="mainDiv">
      <div className="MainBoard_header" id="headerDiv">
        <Dropdown onSelect={function (item: string): void {
          if (item === "Login") {
            handlePageChange("loginPage");
          }
        } } />
      </div>

      <div className="MainBoard_content" id="contentDiv">

        <div className="MainBoard_mode1" id="mode1Div">
          <div className="mode1_upperDiv" id="upperDiv">
            <div className="mode1_upperDiv_box" id="mode1_upperDiv_box">
              <div className="mode1_upperDiv_parts" id="mode1_upperDiv_parts">
                <ChoiceBox choices={["History", "Technology", "Anime", "Politics"]} onSelect={choice => setMode1Theme(choice)} label="Theme:"/>
              </div>
              <div className="mode1_upperDiv_parts" id="mode1_upperDiv_parts">
                <ChoiceBox choices={["Easy", "Medium", "Hard", "EXTREME"]} onSelect={choice => setMode1Difficulty(choice)} label="Difficulty:"/>
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
                  {mode1Data && mode1Data.text}
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
                <div className="mode1_questionsContainer" id="mode1_questionsContainer">
                  {mode1Data && mode1Data.answers && <QuestionPoints
                    questions={mode1Data.answers}
                  />}
                </div>              
              </div>
              <div className="mode1_start_options">
                <Timer ref={timerRef} initialTime={initialTime} id = "mode1_startButton" onClick= {() => {
                  const startButton = document.getElementById("mode1_startButton") as HTMLButtonElement;
                  const mode1AnswerDiv = document.getElementById("mode1_answerDiv") as HTMLDivElement;
                  const mode1ResultDiv = document.getElementById("mode1_resultDiv") as HTMLDivElement;
                  const mode1TextDiv = document.getElementById("mode1_textDiv") as HTMLDivElement;

                  if (startButton.textContent === "Start") {
                    requestTask1Data({
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
                      submitTask1Answers({
                        session: mode1Data.session,
                        selectedVariants: mode1Answers
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
            <CustomButton label="Return" className="wideButton" id="MainBoard_returnButton" onClick={() => handlePageChange("selectionPage")}/>
          </div>

        </div>

        <div className="MainBoard_selection" id="selectionDiv">

          <div className="MainBoard_grid" id="selectionGrid">

            <CustomButton label= "Mode 1" className= "squareButton" id="MainBoard_mode1Button" onClick={()=>{
              console.log("Mode 1 clicked");
              handlePageChange("mode1Page", timerRef);
            }}/>

            <CustomButton label= "Mode 2" className= "squareButton" id="MainBoard_mode2Button" onClick={()=>{
              console.log("Mode 2 clicked");
              const mode2Button = document.getElementById("MainBoard_mode2Button") as HTMLButtonElement;
              mode2Button.textContent = "Coming Soon";
              setTimeout(() => {
                mode2Button.textContent = "Mode 2";
              }, 1000);
            }}/>

            <CustomButton label= "Mode 3" className= "squareButton" id="MainBoard_mode3Button" onClick={()=>{
              console.log("Mode 3 clicked");
              const mode3Button = document.getElementById("MainBoard_mode3Button") as HTMLButtonElement;
              mode3Button.textContent = "Coming Soon";
              setTimeout(() => {
                mode3Button.textContent = "Mode 3";
              }, 1000);
            }}/>

          </div>

        </div>

        <div className="MainBoard_loginPage" id="loginPage">

          <div className="loginContainer" id="loginContainer">

            <div className="loginPage_topDiv">
              <h1 className="loginPage_title">Welcome back!</h1>
            </div>

            <div className="loginPage_loginDiv">
              <input type="text" className="signinInput" id="signinEmailInput" placeholder="Username"/>
              <input type="password" className="signinInput" id="signinPasswordInput" placeholder="Password"/>
              <CustomButton label="Login" className="loginButton" id="loginPage_loginButton" onClick={() => handlePageChange("selectionPage")}/>
            </div>

            <div className="loginPage_bottomDiv">
              <h1 className="loginPage_noAccountText">Don't have an account?</h1>

              <div className="loginPage_links">
                <CustomHyperlink href="/register" label="Register " className="hyperlink" onClick={() => handlePageChange("registerPage")} />
                <span className="smallText"> or </span>
                <CustomHyperlink href="/guest" label=" continue as guest" className="hyperlink" onClick={() => handlePageChange("selectionPage")} />
              </div>

              {/* <CustomButton label="Return" className="loginPage_returnButton" onClick={() => handlePageChange("selectionPage")}/> */}
            </div>

          </div>
          <div className="registerContainer" id="registerContainer">

            <div className="registerPage_topDiv">
              <h1 className="loginPage_title">Create an account</h1>
            </div>

            <div className="registerPage_registerDiv">
              <input type="text" className="signinInput" id="registerEmailInput" placeholder="Email"/>
              <input type="text" className="signinInput" id="registerUsernameInput" placeholder="Username"/>
              <input type="password" className="signinInput" id="registerPasswordInput" placeholder="Password"/>
              <input type="password" className="signinInput" id="registerPasswordInput2" placeholder="Confirm Password"/>
              <CustomButton label="Register" className="loginButton" id="registerPage_registerButton" onClick={() => handlePageChange("selectionPage")}/>
            </div>

            <div className="registerPage_bottomDiv">
              <h1 className="loginPage_noAccountText">Already have an account?</h1>

              <div className="loginPage_links">
                <CustomHyperlink href="/login" label="Login " className="hyperlink" onClick={() => handlePageChange("loginPage")} />
                <span className="smallText"> or </span>
                <CustomHyperlink href="/guest" label=" continue as guest" className="hyperlink" onClick={() => handlePageChange("selectionPage")} />
              </div>
            </div>

          </div>

        </div>
      
      </div>

    </div>
    );
  },
  isSnippet: true,
  environmentProps: { windowHeight: 554, windowWidth: 621 },
});

export default mainBoard;