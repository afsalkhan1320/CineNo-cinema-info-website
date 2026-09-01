import React from "react";
import { Link } from "react-router-dom";
import { CardSlider, Slider } from "../Components";
import { useEffect } from "react";
import { useScrollRestoration } from "../hooks/useScrollRestoration";

export const MoviesSection = () => {
  useScrollRestoration();

  useEffect(() => {
    document.title = "Cine No - Movies";
  }, []);

  return (
    <div className="movies-section-page">
      <main className="container py-4">
        <h2 className="text-info border-bottom pb-2 mb-4 d-flex align-items-center">
          <Link to="/" className="me-2 back-arrow-title" aria-label="Back to Home">
            <i className="bi bi-arrow-left"></i>
          </Link>
          <span>🎬 Movies</span>
        </h2>

        {/* FEATURED SLIDER */}
        <Slider apiPath="movie/popular" type="movie" />

        {/* POPULAR MOVIES */}
        <section className="category-section mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="section-title text-light mb-0">Popular Movies</h4>
            <Link to="/movies/popular" className="see-more-link btn btn-outline-info btn-sm">
              See More <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>
          <CardSlider apiPath="movie/popular" type="movie" />
        </section>

        {/* TOP RATED MOVIES */}
        <section className="category-section mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="section-title text-light mb-0">Top Rated Movies</h4>
            <Link to="/movies/top-rated" className="see-more-link btn btn-outline-info btn-sm">
              See More <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>
          <CardSlider apiPath="movie/top_rated" type="movie" />
        </section>

        {/* UPCOMING MOVIES */}
        <section className="category-section mt-5 mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="section-title text-light mb-0">Upcoming Movies</h4>
            <Link to="/movies/upcoming" className="see-more-link btn btn-outline-info btn-sm">
              See More <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>
          <CardSlider apiPath="movie/upcoming" type="movie" />
        </section>
      </main>
    </div>
  );
};
