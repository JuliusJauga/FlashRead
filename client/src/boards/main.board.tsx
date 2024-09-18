import "./main.board.css";
import React, {useState} from "react";
import CustomButton from "../components/buttons/customButton";
import { createBoard } from "@wixc3/react-board";

function returnFunction(id1Name: string, id2Name: string){
  console.log("Return clicked")
  const page1 = document.getElementById(id1Name) as HTMLDivElement;
  const page2 = document.getElementById(id2Name) as HTMLDivElement;
  page1.style.display = "none";
  page2.style.display = "flex";  
}

export default createBoard({
  name: "Main", 
  Board: () => (
    <div className="MainBoard_main" id="mainDiv">
      <div className="MainBoard_header" id="headerDiv">
        <CustomButton label="" className="MainBoard_userButton" onClick={()=>{
          console.log("User button clicked");
          const loginPage = document.getElementById("loginPage") as HTMLDivElement;
          const selection = document.getElementById("selectionDiv") as HTMLDivElement;
          loginPage.style.display = "flex";
          selection.style.display = "none";
        }}/>
      </div>
      <div className="MainBoard_content" id="contentDiv">
        <div className="MainBoard_mode1" id="mode1Div">
          <div className="mode1_innerDiv" id="timerDiv">
            <p>01:30</p>
          </div>
          <div className="mode1_innerDiv" id="textAreaDiv">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam neque commodi porro nisi sit fugiat. Odio voluptas recusandae, ea nesciunt repellendus doloremque dolorum quos veniam assumenda quia, facere dolores harum!</p>
          </div>
          <div className="mode1_innerDiv" id="buttonDiv">
            <CustomButton label="Return" className="MainBoard_returnButton" onClick={() => returnFunction("mode1Div", "selectionDiv")}/>
          </div>
        </div>
        <div className="MainBoard_selection" id="selectionDiv">
          <div className="MainBoard_grid" id="selectionGrid">
            <CustomButton label= "Mode 1" className= "MainBoard_gridButton" onClick={()=>{
              console.log("Mode 1 clicked");
              const mode1 = document.getElementById("mode1Div") as HTMLDivElement;
              const selection = document.getElementById("selectionDiv") as HTMLDivElement;
              mode1.style.display = "flex";
              selection.style.display = "none";
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
          <CustomButton label="Return" className="loginPage_returnButton" onClick={() => returnFunction("loginPage", "selectionDiv")}/>
        </div>
        <div className="MainBoard_mode2" id="mode2Div"/>
      </div>
    </div>
  ),
  isSnippet: true,
  environmentProps: { windowHeight: 554, windowWidth: 621 },
});
