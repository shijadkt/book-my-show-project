import React, { useState } from "react";
import "./MovieList.css";
import MovieCard from "./MovieCard/MovieCard";
import RoundedFilter from "../../Common/RoundedFilter";

const MoviesList = ({ moviesData }) => {
  const [selectedMovie, setSelectedMovie] = useState("");
  const [inlayIndex, setInlayIndex] = useState("");

  const selectMovieHandler = (index, movie) => {
    setInlayIndex(index + (6 - (index % 6)));
    setSelectedMovie(movie);
  };

  const showGenre = () => {
    const array = selectedMovie.EventGenre.split("|");
    return array.map((item) => (
      <RoundedFilter
        key={item}
        value={item}
        type="normal"
        sx={{
          background: "transparent",
          border: "1px solid #fff",
          padding: "3px 16px",
        }}
      />
    ));
  };

  let grid =
    moviesData.length > 0 &&
    moviesData.map((movie, index) => {
      return (
        <MovieCard
          data={movie}
          key={movie.id}
          selectMovieHandler={selectMovieHandler}
          index={index}
        />
      );
    });

  if (selectedMovie.id) {
    grid.splice(
      inlayIndex,
      0,
      <div className="inlay-outer">
        <div className="video-outer">
          <div>
            <iframe
              title={selectedMovie.EventTitle}
              width="560"
              height="315"
              src={selectedMovie.TrailerURL}
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
          <div className="single-movie-details">
            <h4>{selectedMovie.EventTitle}</h4>
            <span>{selectedMovie.EventLanguage}</span>
            <div className="genre-list-outer">{showGenre()}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-list-outer">
      <div className="movie-list-card-outer">{grid}</div>
    </div>
  );
};

export default MoviesList;
