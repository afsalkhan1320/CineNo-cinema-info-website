import { Link } from "react-router-dom";
import { CardSlider, Slider } from "../Components";
import { useEffect } from "react";
import { useScrollRestoration } from "../hooks/useScrollRestoration";

export const TvSection = () => {
  useScrollRestoration();

  useEffect(() => {
    document.title = "Cineko - TV Shows";
  }, []);

  return (
    <div className="tv-section-page">
      <main className="container py-4">
        <h2 className="text-info border-bottom pb-2 mb-4 d-flex align-items-center">
          <Link to="/" className="me-2 back-arrow-title" aria-label="Back to Home">
            <i className="bi bi-arrow-left"></i>
          </Link>
          <span>📺 TV Shows</span>
        </h2>

        {/* FEATURED SLIDER */}
        <Slider apiPath="tv/popular" type="tv" />

        {/* POPULAR TV SHOWS */}
        <section className="category-section mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="section-title text-light mb-0">Popular TV Shows</h4>
            <Link to="/tvshows/popular" className="see-more-link btn btn-outline-info btn-sm">
              See More <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>
          <CardSlider apiPath="tv/popular" type="tv" />
        </section>

        {/* TOP RATED TV SHOWS */}
        <section className="category-section mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="section-title text-light mb-0">Top Rated TV Shows</h4>
            <Link to="/tvshows/top-rated" className="see-more-link btn btn-outline-info btn-sm">
              See More <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>
          <CardSlider apiPath="tv/top_rated" type="tv" />
        </section>

        {/* UPCOMING TV SHOWS */}
        <section className="category-section mt-5 mb-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="section-title text-light mb-0">Upcoming TV Shows</h4>
            <Link to="/tvshows/upcoming" className="see-more-link btn btn-outline-info btn-sm">
              See More <i className="bi bi-arrow-right-short"></i>
            </Link>
          </div>
          <CardSlider apiPath="tv/upcoming" type="tv" />
        </section>
      </main>
    </div>
  );
};
