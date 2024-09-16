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
      <div className="MainBoard_div3">
        <div className="MainBoard_grid">
          <button className="MainBoard_gridButton">Button</button>
          <button className="MainBoard_gridButton">Button</button>
          <button className="MainBoard_gridButton">Button</button>
        </div>
      </div>
    </div>
  ),
  isSnippet: true,
  environmentProps: {
    windowWidth: 1920,
    windowHeight: 1080,
  },
});
