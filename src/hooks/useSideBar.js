"use client";

import { useState } from "react";

const { Button } = require("primereact/button");
const { Sidebar } = require("primereact/sidebar");

const useSideBar = () => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState();
  const [position, setPosition] = useState("left");
  const [fullscreen, setFullscreen] = useState(false);

  const sider = (prop = {}, localContent) => {
    return (
      <>
        <div className="card flex justify-content-center">
          <Sidebar
            visible={visible}
            position={position}
            onHide={() => setVisible(false)}
            className={prop?.className}
            fullScreen={fullscreen}
            icons={prop?.icons}
            header={prop?.header}
          >
            {localContent}
            {content}
          </Sidebar>
        </div>
      </>
    );
  };

  return {
    setVisible,
    setContent,
    setPosition,
    sider,
    setFullscreen,
  };
};

export default useSideBar;
