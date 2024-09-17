import "./main.board.css";
import React, {useState} from "react";
import ModeButton1 from "../components/buttons/modeButton1";
import ReturnButton from "../components/buttons/returnButton";
import { createBoard } from "@wixc3/react-board";



export default createBoard({
  name: "Main", 
  Board: () => (
    <div className="MainBoard_main" id="mainDiv">
      <div className="MainBoard_header" id="headerDiv">
        <button className="MainBoard_userButton" id="userButton"></button>
      </div>
      <div className="MainBoard_content" id="contentDiv">
        <div className="MainBoard_mode1" id="mode1Div">
          <ReturnButton label="Return" className="MainBoard_returnButton" onClick={()=>{
            console.log("Return clicked")
            const mode1 = document.getElementById("mode1Div") as HTMLDivElement;
            const selection = document.getElementById("selectionDiv") as HTMLDivElement;
            mode1.style.display = "none";
            selection.style.display = "flex";
          }}/>
        </div>
        <div className="MainBoard_selection" id="selectionDiv">
          <div className="MainBoard_grid" id="selectionGrid">
            <ModeButton1 label= "Mode 1" className= "MainBoard_gridButton" onClick={()=>{
              console.log("Mode 1 clicked")
              const mode1 = document.getElementById("mode1Div") as HTMLDivElement;
              const selection = document.getElementById("selectionDiv") as HTMLDivElement;
              mode1.style.display = "flex";
              selection.style.display = "none";
            }}/>
            <button className="MainBoard_mode2Button MainBoard_gridButton">
              Button
            </button>
            <button className="MainBoard_mode3Button MainBoard_gridButton">
              Button
            </button>
          </div>
        </div>
        <div className="MainBoard_mode2" id="mode2Div"/>
      </div>
    </div>
  ),
  isSnippet: true,
  environmentProps: { windowHeight: 554, windowWidth: 621 },
});
