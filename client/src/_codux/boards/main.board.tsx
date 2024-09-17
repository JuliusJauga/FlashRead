import "./main.board.css";
// import React from "react";
import { createBoard } from "@wixc3/react-board";

export default createBoard({
  name: "Main",
  Board: () => (
    <div className="MainBoard_main">
      <div className="MainBoard_header">
        <button className="MainBoard_userButton"></button>
      </div>
      <div className="MainBoard_content">
        <div className="MainBoard_mode1" />
        <div className="MainBoard_selection">
          <div className="MainBoard_grid">
            <button className="MainBoard_gridButton">Button</button>
            <button className="MainBoard_gridButton">Button</button>
            <button className="MainBoard_gridButton">Button</button>
          </div>
        </div>
        <div className="MainBoard_mode2" />
      </div>
    </div>
  ),
  isSnippet: true,
  environmentProps: { windowWidth: 1920, windowHeight: 1080 },
});
