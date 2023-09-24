import React, { useEffect, useState } from "react";
import Header from "./Components/Header/Header";
import Movies from "./Components/Movies/Movies";

const Main = () => {
  const [moviesData, setMoviesData] = useState({});
  const [filteredData, setFilteredData] = useState({});
  const [languageList, setLanguageList] = useState([]);
  const [selectedLanguge, setSelectedLanguge] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    fetch("https://in.bmscdn.com/m6/static/interview-mock/data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMoviesData(data.moviesData);
        const arrayOfObjects = Object.keys(data.moviesData).map((key) => ({
          id: key,
          ...data.moviesData[key],
        }));
        setMoviesData(arrayOfObjects);
        setLanguageList(data.languageList);
      });
  }, []);

  useEffect(() => {
    const filteredMovies =
      moviesData.length > 0 &&
      moviesData.filter((movie) => {
        return selectedLanguge.includes(movie.EventLanguage);
      });
    setFilteredData(filteredMovies);
  }, [moviesData, selectedLanguge]);

  const selectLangOrGenreHandler = (type, item) => {
    const array = [...(type === "lang" ? selectedLanguge : selectedGenres)];
    if (array.includes(item)) {
      const index = array.indexOf(item);
      array.splice(index, 1);
    } else {
      array.push(item);
    }
    type === "lang" ? setSelectedLanguge(array) : setSelectedGenres(array);
  };

  return (
    <>
      <Header
        languageList={languageList}
        selectedLanguge={selectedLanguge}
        selectLangOrGenreHandler={selectLangOrGenreHandler}
        selectedGenres={selectedGenres}
      />
      <Movies
        selectedLanguge={selectedLanguge}
        selectedGenres={selectedGenres}
        moviesData={selectedLanguge.length > 0 ? filteredData : moviesData}
      />
      {((selectedLanguge.length > 0 && filteredData.length === 0) ||
        moviesData.length === 0) && <div className="not-found">Not found</div>}
    </>
  );
};

export default Main;
