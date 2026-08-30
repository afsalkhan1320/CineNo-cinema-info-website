import React from "react";
import { Link } from "react-router-dom";
import { CardSlider, Slider } from "../Components";
import AnimeStreaming from "../Components/AnimeStreaming";
import { useEffect } from "react";
import { useScrollRestoration } from "../hooks/useScrollRestoration";

export const AnimeSection = () => {
  useScrollRestoration();

  useEffect(() => {
    document.title = "Cineko - Anime";
  }, []);

  return (
    <div className="anime-section-page">
      <main className="container py-4">
        <h2 className="text-info border-bottom pb-2 mb-4 d-flex align-items-center">
          <Link to="/" className="me-2 back-arrow-title" aria-label="Back to Home">
            <i className="bi bi-arrow-left"></i>
          </Link>
          <span>🎌 Anime</span>
        </h2>

        {/* FEATURED SLIDER */}
        <Slider apiPath="anime/popular" type="anime" />

        {/* POPULAR ANIME */}
        <section className="category-section mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="section-title text-light mb-0">Popular Anime</h4>
            <Link to="/anime/popular" className="see-more-link btn btn-outline-info btn-sm">
              See More <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>
          <CardSlider apiPath="anime/popular" type="tv" />
        </section>

        {/* TOP RATED ANIME */}
        <section className="category-section mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="section-title text-light mb-0">Top Rated Anime</h4>
            <Link to="/anime/top-rated" className="see-more-link btn btn-outline-info btn-sm">
              See More <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>
          <CardSlider apiPath="anime/top-rated" type="tv" />
        </section>

        {/* UPCOMING ANIME */}
        <section className="category-section mt-5 mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="section-title text-light mb-0">Upcoming Anime</h4>
            <Link to="/anime/upcoming" className="see-more-link btn btn-outline-info btn-sm">
              See More <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>
          <CardSlider apiPath="anime/upcoming" type="tv" />
        </section>

        {/* ANIME STREAMING WEBSITES */}
        <div className="border-top pt-4 mt-5 mb-4">
          <AnimeStreaming />
        </div>
      </main>
    </div>
  );
};
