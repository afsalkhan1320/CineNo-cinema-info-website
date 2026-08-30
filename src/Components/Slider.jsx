import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import background from "../assets/background.jpg";

export const Slider = ({
  apiPath,
  type = "movie",
}) => {
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const key = import.meta.env.VITE_API_KEY;

 let url;

if (apiPath === "anime/popular") {
  url =
    `https://api.themoviedb.org/3/discover/tv` +
    `?api_key=${key}` +
    `&with_genres=16` +
    `&sort_by=popularity.desc`;
} else {
  url = `https://api.themoviedb.org/3/${apiPath}?api_key=${key}`;
}

  // =========================
  // Fetch slider data
  // =========================
  useEffect(() => {
    let active = true;

    async function fetchSliderData() {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Slider API error: ${response.status}`
          );
        }

        const data = await response.json();

        if (active) {
          setItems(data.results || []);
          setCurrentIndex(0);
        }

      } catch (error) {
        console.error("Slider Error:", error);
      }
    }

    fetchSliderData();

    return () => {
      active = false;
    };
  }, [url]);

  // =========================
  // Automatic slider
  // =========================
  useEffect(() => {
    if (items.length === 0) return;

    const sliderCount = Math.min(items.length, 6);

    const timer = setInterval(() => {
      setCurrentIndex((previousIndex) =>
        previousIndex === sliderCount - 1
          ? 0
          : previousIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [items]);

  // =========================
  // Previous
  // =========================
  const handlePrevious = () => {
    const sliderCount = Math.min(items.length, 6);

    setCurrentIndex((previousIndex) =>
      previousIndex === 0
        ? sliderCount - 1
        : previousIndex - 1
    );
  };

  // =========================
  // Next
  // =========================
  const handleNext = () => {
    const sliderCount = Math.min(items.length, 6);

    setCurrentIndex((previousIndex) =>
      previousIndex === sliderCount - 1
        ? 0
        : previousIndex + 1
    );
  };

  // =========================
  // Loading
  // =========================
  if (items.length === 0) {
    return (
      <div className="hero-slider-loading">
        Loading...
      </div>
    );
  }

  const item = items[currentIndex];

  const displayTitle =
    item.title || item.name;

  const displayDate =
    item.release_date || item.first_air_date;

  const displayYear = displayDate
    ? displayDate.slice(0, 4)
    : "N/A";

  const backdropImage = item.backdrop_path
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    : background;

  const posterImage = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : background;

  return (
    <section className="hero-slider">

      {/* Background */}
      <img
        src={backdropImage}
        alt={displayTitle}
        className="hero-background"
      />

      {/* Overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="hero-content">

        <div className="hero-info">

          {/* Label */}
          <span className="hero-label">

            {type === "movie"
              ? "🎬 Featured Movie"
              : type === "anime"
              ? "🎌 Featured Anime"
              : "📺 Featured TV Show"}

          </span>

          {/* Title */}
          <h1 className="hero-title">
            {displayTitle}
          </h1>

          {/* Meta */}
          <div className="hero-meta">

            <span>
              ⭐ {item.vote_average?.toFixed(1)}
            </span>

            <span>
              {displayYear}
            </span>

          </div>

          {/* Overview */}
          <p className="hero-overview">
            {item.overview ||
              "No description available."}
          </p>

          {/* Button */}
          <div className="hero-buttons">

            <Link
              to={
                type === "movie"
                  ? `/movie/${item.id}`
                  : `/tv/${item.id}`
              }
              className="hero-details-btn"
            >
              View Details
            </Link>

          </div>

        </div>

        {/* Poster */}
        <div className="hero-poster-container">

          <img
            src={posterImage}
            alt={displayTitle}
            className="hero-poster"
          />

        </div>

      </div>

      {/* Previous */}
      <button
        className="hero-arrow hero-prev"
        onClick={handlePrevious}
      >
        <i className="bi bi-chevron-left"></i>
      </button>

      {/* Next */}
      <button
        className="hero-arrow hero-next"
        onClick={handleNext}
      >
        <i className="bi bi-chevron-right"></i>
      </button>

      {/* Dots */}
      <div className="hero-dots">

        {items.slice(0, 6).map((_, index) => (
          <button
            key={index}
            className={
              index === currentIndex
                ? "hero-dot active"
                : "hero-dot"
            }
            onClick={() =>
              setCurrentIndex(index)
            }
          ></button>
        ))}

      </div>

    </section>
  );
};