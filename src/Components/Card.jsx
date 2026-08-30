import React from "react";
import background from "../assets/background.jpg";
import { Link } from "react-router-dom";

export const Card = ({ movie }) => {

  const {
    poster_path,
    id,
    title,
    release_date,
    vote_average,
    first_air_date,
    name,
    media_type,
  } = movie;

  // ==========================================
  // DETECT MOVIE OR TV SHOW
  // ==========================================

  const isTv =
    media_type === "tv" ||
    !!first_air_date ||
    !!name;

  // ==========================================
  // TITLE
  // ==========================================

  const displayTitle =
    title ||
    name ||
    "Unknown Title";

  // ==========================================
  // RELEASE DATE
  // ==========================================

  const displayDate =
    release_date ||
    first_air_date ||
    "";

  // ==========================================
  // DETAILS URL
  // ==========================================

  const detailsUrl = isTv
    ? `/tv/${id}`
    : `/movie/${id}`;

  // ==========================================
  // POSTER
  // ==========================================

  const posterUrl = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : background;

  return (
    <div className="col">

      <div className="movie-card">

        {/* ==================================
            POSTER
        ================================== */}

        <Link
          to={detailsUrl}
          className="poster-container"
        >

          {poster_path ? (

            <img
              src={posterUrl}
              alt={displayTitle}
              className="movie-poster"
            />

          ) : (

            <div className="no-poster">

              <div className="no-poster-content">

                <i className="bi bi-camera-reels no-poster-icon"></i>

                <h5>
                  No Poster Available
                </h5>

                <span>
                  Cineko
                </span>

              </div>

            </div>

          )}

        </Link>

        {/* ==================================
            CARD BODY
        ================================== */}

        <div className="movie-card-body">

          <h5 className="card-title text-overflow-1">
            {displayTitle}
          </h5>

          <div className="d-flex justify-content-between align-items-center">

            {/* YEAR */}

            <h6 className="card-text mb-0">

              {displayDate
                ? displayDate.slice(0, 4)
                : "N/A"}

            </h6>

            {/* RATING */}

            <small className="small text-light">

              <i className="bi bi-star-fill text-warning"></i>{" "}

              {typeof vote_average === "number"
                ? vote_average.toFixed(1)
                : "N/A"}

            </small>

          </div>

        </div>

      </div>

    </div>
  );
};
