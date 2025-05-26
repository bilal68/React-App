import { Button as AntdButton } from "antd";
import "./Button.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
  type?: "primary" | "default" | "dashed" | "text" | "link"; // Optional Ant Design button types
  disabled?: boolean; // Optional disabled state
}

function Button({ text, onClick, type = "default", disabled = false }: ButtonProps) {
  return (
    <AntdButton type={type} onClick={onClick} disabled={disabled} className="custom-button">
      {text}
    </AntdButton>
  );
}

export default Button;
