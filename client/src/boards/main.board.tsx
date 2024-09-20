import "./css/main.board.css";
import "./css/dropdown.css";
import "./css/mode1.css";
import "./css/loginPage.css";
import "./css/fonts.css";
import "./css/buttons.css";
import CustomButton from "../components/buttons/customButton";
import Dropdown from "../components/dropdown";
import CustomHyperlink from '../components/buttons/hyperlink';
import { postTaskText } from "../components/axios";
import { createBoard } from "@wixc3/react-board";

function handlePageChange(pageName: string) {
  console.log("Page change clicked");

  const pages = {
    selectionPage: document.getElementById("selectionDiv") as HTMLDivElement,
    mode1Page: document.getElementById("mode1Div") as HTMLDivElement,
    loginPage: document.getElementById("loginPage") as HTMLDivElement,
    loginContainer: document.getElementById("loginContainer") as HTMLDivElement,
    registerContainer: document.getElementById("registerContainer") as HTMLDivElement,
  };

  const hideAllPages = () => {
    Object.values(pages).forEach(page => {
      page.style.display = "none";
    });
  };

  hideAllPages();

  switch (pageName) {
    case "mode1Page":
      postTaskText().then((data) => {
        console.log(data);
        const mode1Text = document.querySelector(".mode1Text") as HTMLParagraphElement;
        mode1Text.textContent = data.text;
      });
      pages.mode1Page.style.display = "flex";
      break;

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
  Board: () => (
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
            {/* Spacer */}
          </div>

          <div className="mode1_innerDiv" id="textAreaDiv">
            <div className="mode1TextDiv">
              <div className="mode1_mainBox">
                <p className="mode1Text">Loading...</p>
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
              handlePageChange("mode1Page");
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
                <CustomHyperlink href="/register" label="Register " onClick={() => handlePageChange("registerPage")} />
                <span> or </span>
                <CustomHyperlink href="/guest" label=" continue as guest" onClick={() => handlePageChange("selectionPage")} />
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
                <CustomHyperlink href="/login" label="Login " onClick={() => handlePageChange("loginPage")} />
                <span> or </span>
                <CustomHyperlink href="/guest" label=" continue as guest" onClick={() => handlePageChange("selectionPage")} />
              </div>
            </div>

          </div>

        </div>
      
      </div>

    </div>
  ),
  isSnippet: true,
  environmentProps: { windowHeight: 554, windowWidth: 621 },
});

export default mainBoard;