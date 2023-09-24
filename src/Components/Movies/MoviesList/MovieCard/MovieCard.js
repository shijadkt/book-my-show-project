import React from "react";
import "./MovieCard.css";

const MovieCards = ({ data, selectMovieHandler, index }) => {
  return (
    data &&
    data.id && (
      <>
        <div onClick={() => selectMovieHandler(index, data)} className="card">
          <img
            src={data.EventImageUrl}
            alt="Avatar"
            style={{ width: "100%" }}
          ></img>
          <p>{data.EventTitle}</p>
        </div>
      </>
    )
  );
};

export default MovieCards;
