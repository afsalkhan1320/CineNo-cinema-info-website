import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="footer-section mt-5 py-5 border-top ">
      <div className="container">
        <div className="row g-4 justify-content-between text-start">
          
          {/* Logo & Description */}
          <div className="col-lg-5 col-md-12 mb-4 mb-lg-0">
            <div className="footer-brand mb-3">
              <Link to="/" className="text-decoration-none fs-4 fw-bold text-light d-flex align-items-center gap-2">
                 Cine<span className="header-title">No</span>
                <i className="bi bi-camera-reels header-icon"></i>
              </Link>
            </div>
            <p className="footer-desc mb-0">
              Explore the universe of movies, TV shows, and anime. Track your favorites, check streaming availability, and discover top-rated titles all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <h6 className="footer-heading text-light mb-3 text-uppercase fw-bold">
              Explore
            </h6>
            <ul className="list-unstyled footer-links">
              <li className="mb-2">
                <Link to="/" className="text-secondary text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/movies/popular" className="text-secondary text-decoration-none">Popular Movies</Link>
              </li>
              <li className="mb-2">
                <Link to="/movies/top-rated" className="text-secondary text-decoration-none">Top Rated</Link>
              </li>
              <li className="mb-2">
                <Link to="/movies/upcoming" className="text-secondary text-decoration-none">Upcoming</Link>
              </li>
            </ul>
          </div>

          {/* TV & Anime */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <h6 className="footer-heading text-light mb-3 text-uppercase fw-bold">
              TV & Anime
            </h6>
            <ul className="list-unstyled footer-links">
              <li className="mb-2">
                <Link to="/tvshows/popular" className="text-secondary text-decoration-none">Popular TV</Link>
              </li>
              <li className="mb-2">
                <Link to="/anime/popular" className="text-secondary text-decoration-none">Anime List</Link>
              </li>
              <li className="mb-2">
                <Link to="/anime/upcoming" className="text-secondary text-decoration-none">Upcoming Anime</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="footer-bottom mt-5 pt-4 border-top text-center text-secondary">
          <p className="mb-0">&copy; {new Date().getFullYear()} CineNo. Designed with ❤️ for all cinema  lovers everywhere.</p>
        </div>
      </div>
    </footer>
  );
};