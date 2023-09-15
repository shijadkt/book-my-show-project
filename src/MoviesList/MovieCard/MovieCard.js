import React from "react";
import "./MovieCard.css";

const MovieCard = () => {
  return (
    <div class="card">
      <img src="img_avatar.png" alt="Avatar" style={{ width: "100%" }}></img>
      <div class="container">
        <h4>
          <b>John Doe</b>
        </h4>
        <p>Architect & Engineer</p>
      </div>
    </div>
  );
};

export default MovieCard;