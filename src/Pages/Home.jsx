import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { CardSlider } from "../Components";
import movieHero from "../assets/movie-hero.png";
import { useEffect } from "react";
import { useScrollRestoration } from "../hooks/useScrollRestoration";

export const Home = () => {
  const navigate = useNavigate();
  useScrollRestoration();

  useEffect(() => {
    document.title = "Cineko - Your Guide to Movies, TV Shows, Anime";
  }, []);

  return (
    <div className="home-page">
      <main className="container">
        {/* HOME HERO */}
        <section
          className="hero-section mb-5 mt-3"
          style={{
            backgroundImage: `url(${movieHero})`,
          }}
        >
          <div className="hero-content-inner">
            <div className="hero-text">
              <h2>Welcome to</h2>
              <h1>
                <span>Cine</span>
                <strong>ko</strong>
                <i className="bi bi-camera-reels"></i>
              </h1>
              <p>
                Discover movies, TV shows, and anime you'll love with personalized suggestions,
                curated collections, and quick searches - your guide to finding great titles.
              </p>
              <button
                onClick={() => navigate("/movies")}
                className="hero-button"
              >
                Explore More
              </button>
            </div>
          </div>
        </section>

        {/* MOVIES SLIDER */}
        <section className="category-section mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="section-title text-light mb-0">
              <span className="header-title">Popular</span> Movies
            </h3>
            <Link to="/movies" className="see-more-link btn btn-outline-info btn-sm">
              See More <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>
          <CardSlider apiPath="movie/popular" type="movie" />
        </section>

        {/* TV SHOWS SLIDER */}
        <section className="category-section mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="section-title text-light mb-0">
              <span className="header-title">Popular</span> TV Shows
            </h3>
            <Link to="/tvshows" className="see-more-link btn btn-outline-info btn-sm">
              See More <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>
          <CardSlider apiPath="tv/popular" type="tv" />
        </section>

        {/* ANIME SLIDER */}
        <section className="category-section mt-5 mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="section-title text-light mb-0">
              <span className="header-title">Popular</span> Anime
            </h3>
            <Link to="/anime" className="see-more-link btn btn-outline-info btn-sm">
              See More <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>
          <CardSlider apiPath="anime/popular" type="tv" />
        </section>
      </main>
    </div>
  );
};
