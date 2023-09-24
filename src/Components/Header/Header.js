import React, { useState } from "react";
import "./Header.css";
import Button from "../Common/Button";
import Select from "../Common/Select";
import { generesList, trendList } from "../../Util/Constants";

const Header = ({
  languageList,
  selectedLanguge,
  selectLangOrGenreHandler,
  selectedGenres,
}) => {
  const [selectedTrend, setSelectedTrend] = useState("Fresh");

  const selectTrendType = (type, item) => {
    setSelectedTrend(item);
  };

  return (
    <header>
      <div className="header-left">
        <span>Movie Trailers</span>
        <Button value={"COMING SOON"} sx={{ marginRight: "15px" }} />
        <Button value={"NOW SHOWING"} type="secondary" />
      </div>
      <div className="header-right">
        <Select
          sx={{ marginRight: "10px" }}
          options={trendList}
          currentValue={selectedTrend}
          selectValueHandler={selectTrendType}
        />
        <Select
          sx={{ marginRight: "10px" }}
          options={languageList}
          multiSelect
          currentValue={selectedLanguge}
          selectValueHandler={selectLangOrGenreHandler}
          defaultValue="All Languages"
        />
        <Select
          defaultValue="All Genres"
          options={generesList}
          multiSelect
          currentValue={selectedGenres}
          selectValueHandler={selectLangOrGenreHandler}
        />
      </div>
    </header>
  );
};

export default Header;
