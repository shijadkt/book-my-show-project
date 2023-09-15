import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import MoviesList from "./MoviesList/MoviesList";

const Main = () => {
  const [moviesData, setMoviesData] = useState({});
  const [languageList, setLanguageList] = useState([]);
  useEffect(() => {
    fetch("https://in.bmscdn.com/m6/static/interview-mock/data.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMoviesData(data.moviesData);
        setLanguageList(data.languageList);
      });
  }, []);

  return (
    <>
      <Header />
      <MoviesList moviesData={moviesData} />
    </>
  );
};

export default Main;
