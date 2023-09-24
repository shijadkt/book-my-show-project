import React from "react";
import "./Movies.css";
import Filters from "./Filters/Filters";
import MoviesList from "./MoviesList/MoviesList";

const Movies = ({ selectedLanguge, selectedGenres, moviesData }) => {
  return (
    <div className="movies-outer">
      <Filters
        selectedLanguge={selectedLanguge}
        selectedGenres={selectedGenres}
      />
      <MoviesList moviesData={moviesData} />
    </div>
  );
};

export default Movies;
