import React, { useState } from "react";

const Select = ({
  sx,
  options,
  selectValueHandler,
  currentValue = "Options",
  defaultValue,
  multiSelect = false,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={sx} className="select-box">
      <p onClick={() => setOpen(!open)}>
        {multiSelect && currentValue.length > 0
          ? currentValue.length > 2
            ? `${currentValue.length} Selected`
            : currentValue.join(",")
          : defaultValue}
        {multiSelect === false && (currentValue ? currentValue : defaultValue)}
      </p>
      {open && (
        <div className="select-option">
          <ul>
            {options.map((item) => (
              <li
                onClick={() =>
                  selectValueHandler(
                    defaultValue === "All Languages" ? "lang" : "genres",
                    item
                  )
                }
                key={item}
              >
                {multiSelect && (
                  <input
                    type="checkbox"
                    name={item.label}
                    value={item.value}
                    checked={currentValue.includes(item) ? true : false}
                    onChange={() =>
                      selectValueHandler(
                        defaultValue === "All Languages" ? "lang" : "genres",
                        item
                      )
                    }
                  ></input>
                )}
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
