import "./main.board.css";
import React from "react";
import { createBoard } from "@wixc3/react-board";

export default createBoard({
  name: "Main",
  Board: () => (
    <div className="MainBoard_div1">
      <div className="MainBoard_div2">
        <button className="MainBoard_button2"></button>
      </div>
      <div className="MainBoard_div4">
        <div className="MainBoard_div6" />
        <div className="MainBoard_div5" />
        <div className="MainBoard_div3">
          <div className="MainBoard_grid">
            <button className="MainBoard_gridButton">Button</button>
            <button className="MainBoard_gridButton">Button</button>
            <button className="MainBoard_gridButton">Button</button>
          </div>
        </div>
      </div>
    </div>
  ),
  isSnippet: true,
  environmentProps: { windowHeight: 1080, windowWidth: 1941 },
});
