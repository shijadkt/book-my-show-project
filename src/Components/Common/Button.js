import React from "react";
import "./styles.css";

const Button = ({ value, type = "primary", sx }) => {
  return (
    <button style={sx} className={`button-${type}`}>
      {value}
    </button>
  );
};

export default Button;
