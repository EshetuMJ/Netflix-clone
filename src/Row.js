import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";

import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";


const base_url = "https://image.tmdb.org/t/p/original/"; // url found from the documentation tmd
function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]); //empty movie array

  const [trailerUrl, setTrailerUrl] = useState("");

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1, // Will auto play videos on click.
    },
  };
  //snipets of code which runs based on specific condition/variable.....useEffect snipets used below
  useEffect(() => {
    //if the bracket is empty i.e run once and dont run again
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      // console.log(request.data.results);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const handleClick = (movie) => {
    if (trailerUrl) {
      setTrailerUrl(""); // Sets trailerUrl to initial value = null.
    } else {
      movieTrailer(movie?.title || movie?.name || movie.original_name)
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v")); // returns the video's id
        })
        .catch((error) => console.log(error));
    }
  };
  // console.log(movies);

  return (
    <div className="row">
      <h1>{title}</h1>
      <div className="row__posters">
        {movies.map((movie) => {
          return (
            <img  

              onClick={() => handleClick(movie)}
              className={`row__poster ${isLargeRow && "row_posterLarge"} `}
              src={`${base_url}${
                isLargeRow ? movie.poster_path : movie.backdrop_path
              }`}
              alt={movie.name}
            />

          );
        })}
      </div>

      <div style={{ padding: "40px" }}>
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        {/* YouTube module returns a youtube video based on the given videoId. */}
      </div>
    </div>
  );
}

export default Row;