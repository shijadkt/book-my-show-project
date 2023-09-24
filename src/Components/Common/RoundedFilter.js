import React from "react";
import "./styles.css";

const RoundedFilter = ({ value, removeHandler, type = "close", sx }) => {
  return (
    <div style={sx} className="filter-rounded">
      {value}{" "}
      {type === "close" && <span onClick={() => removeHandler(value)}>X</span>}
    </div>
  );
};

export default RoundedFilter;
