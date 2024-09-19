import "./main.board.css";
import "./dropdown.css";
import CustomButton from "../components/buttons/customButton";
import Dropdown from "../components/dropdown";
import { postTaskText } from "../components/axios";
import { createBoard } from "@wixc3/react-board";

function handlePageChange(pageName: string) {
  console.log("Page change clicked");
  const selectionPage = document.getElementById("selectionDiv") as HTMLDivElement;
  const mode1Page = document.getElementById("mode1Div") as HTMLDivElement;
  const loginPage = document.getElementById("loginPage") as HTMLDivElement;

  if (pageName === "mode1Page") {
    // fetchPostData().then(data => {
    //   const mode1Text = document.querySelector(".mode1Text") as HTMLParagraphElement;
    //   mode1Text.textContent = data;
    //   console.log("Data fetched:", data);
    // }).catch(error => {
    //   console.error("Error fetching data:", error);
    // });
    postTaskText().then(data => {console.log(data);});
  }

  if (pageName === "selectionPage") {
    selectionPage.style.display = "flex";
    mode1Page.style.display = "none";
    loginPage.style.display = "none";
  } else if (pageName === "mode1Page") {
    selectionPage.style.display = "none";
    mode1Page.style.display = "flex";
    loginPage.style.display = "none";
  } else if (pageName === "loginPage") {
    selectionPage.style.display = "none";
    mode1Page.style.display = "none";
    loginPage.style.display = "flex";
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
          <div className="mode1_innerDiv" id="timerDiv">
            <p className="timerText">01:30</p>
          </div>
          <div className="mode1_innerDiv" id="textAreaDiv">
            <div className="mode1TextDiv">
              <p className="mode1Text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam neque commodi porro nisi sit fugiat. Odio voluptas recusandae, ea nesciunt repellendus doloremque dolorum quos veniam assumenda quia, facere dolores harum!</p>
            </div>
          </div>
          <div className="mode1_innerDiv" id="buttonDiv">
            <CustomButton label="Return" className="MainBoard_returnButton" onClick={() => handlePageChange("selectionPage")}/>
          </div>
        </div>
        <div className="MainBoard_selection" id="selectionDiv">
          <div className="MainBoard_grid" id="selectionGrid">
            <CustomButton label= "Mode 1" className= "MainBoard_gridButton" onClick={()=>{
              console.log("Mode 1 clicked");
              handlePageChange("mode1Page");
            }}/>
            <CustomButton label= "Mode 2" className= "MainBoard_gridButton" onClick={()=>{
              console.log("Mode 2 clicked");
              const mode2Button = document.querySelector(".MainBoard_gridButton:nth-child(2)") as HTMLButtonElement;
              mode2Button.textContent = "Coming Soon";
              setTimeout(() => {
                mode2Button.textContent = "Mode 2";
              }, 1000);
            }}/>
            <CustomButton label= "Mode 3" className= "MainBoard_gridButton" onClick={()=>{
              console.log("Mode 2 clicked");
              const mode3Button = document.querySelector(".MainBoard_gridButton:nth-child(3)") as HTMLButtonElement;
              mode3Button.textContent = "Coming Soon";
              setTimeout(() => {
                mode3Button.textContent = "Mode 3";
              }, 1000);
            }}/>
          </div>
        </div>
        <div className="MainBoard_loginPage" id="loginPage">
          <CustomButton label="Return" className="loginPage_returnButton" onClick={() => handlePageChange("selectionPage")}/>
        </div>
        <div className="MainBoard_mode2" id="mode2Div">
        </div>  
      </div>
    </div>
  ),
  isSnippet: true,
  environmentProps: { windowHeight: 554, windowWidth: 621 },
});

export default mainBoard;