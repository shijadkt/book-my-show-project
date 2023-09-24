import React from "react";
import "./Filters.css";
import RoundedFilter from "../../Common/RoundedFilter";

const Filters = ({ selectedGenres, selectedLanguge }) => {
  const combinedArray = [...selectedLanguge, ...selectedGenres];

  return (
    <div className="filter-outer">
      <p>Applied Filters:</p>
      {combinedArray &&
        combinedArray.map((item) => <RoundedFilter value={item} key={item} />)}
    </div>
  );
};

export default Filters;
