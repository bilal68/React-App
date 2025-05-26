import React from "react";
import { Spin } from "antd";

const Loader: React.FC = () => {
  return (
    <div style={overlayStyle}>
      <Spin size="large" />
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.7)", 
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000, 
};

export default Loader;
