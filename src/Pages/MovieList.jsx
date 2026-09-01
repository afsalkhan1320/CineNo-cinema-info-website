import React from "react";
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useNavigationType } from "react-router-dom";
import { Card } from "../Components";
import { useFetch } from "../hooks/useFetch";
import { Slider } from "../Components/Slider";
import movieHero from "../assets/movie-hero.png";
import AnimeStreaming from "../Components/AnimeStreaming";

import { useScrollRestoration } from "../hooks/useScrollRestoration";

export const MovieList = ({
  title,
  apiPath,
  
  showHero = false,

  sliderApiPath = "",
  sliderType = "movie",
  showAnimeStreaming = false,
  parentPath = "",
  parentName = "",
}) => {
  const navType = useNavigationType();
  const cacheKey = `movielist_${apiPath}`;

  const getCachedData = () => {
    if (navType !== "POP") return null;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.error("Failed to read cache", e);
    }
    return null;
  };

  const cachedData = getCachedData();

  const [page, setPage] = useState(cachedData ? cachedData.page : 1);
  const [movies, setMovies] = useState(cachedData ? cachedData.movies : []);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef(null);

  // Restore scroll using the reusable hook when movies are loaded
  useScrollRestoration(movies.length > 0);

  const { data } = useFetch(apiPath, "", page);

  const navigator = useNavigate();
  const prevApiPath = useRef(apiPath);

  // Clear cache for this key if not navigating back/forward
  useEffect(() => {
    if (navType !== "POP") {
      sessionStorage.removeItem(cacheKey);
    }
  }, [navType, cacheKey]);

  // Reset when page/category changes (unless it's initial mount with same path)
  useEffect(() => {
    if (prevApiPath.current !== apiPath) {
      setPage(1);
      setMovies([]);
      setLoading(false);
      setHasMore(true);
      prevApiPath.current = apiPath;
    }
  }, [apiPath]);

  // Set loading state when page increments
  useEffect(() => {
    setLoading(true);
  }, [page]);

  // Add API data and lock off loading state
  useEffect(() => {
    if (!data) return;
    
    setLoading(false);
    
    if (data.length === 0) {
      setHasMore(false);
      return;
    }

    if (data.length < 20) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }

    if (page === 1) {
      setMovies(data);
    } else {
      setMovies((previousMovies) => {
        const combinedMovies = [
          ...previousMovies,
          ...data,
        ];
        return combinedMovies.filter(
          (movie, index, self) =>
            index ===
            self.findIndex(
              (item) => item.id === movie.id
            )
        );
      });
    }
  }, [data, page]);

  // Save movies and page to sessionStorage
  useEffect(() => {
    if (movies.length > 0) {
      try {
        const cached = sessionStorage.getItem(cacheKey);
        const currentCache = cached ? JSON.parse(cached) : {};
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({
            ...currentCache,
            movies,
            page,
          })
        );
      } catch (e) {
        console.error("Failed to write cache", e);
      }
    } else if (navType !== "POP") {
      sessionStorage.removeItem(cacheKey);
    }
  }, [movies, page, cacheKey, navType]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        root: null, // relative to viewport
        rootMargin: "250px", // trigger loading next page 250px before sentinel enters viewport
        threshold: 0.1,
      }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [loading, hasMore]);

  // Browser title
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div>

      <main className="container">

        {/* HOME HERO */}
        {showHero && (
          <section
            className="hero-section mb-5 mt-3"
            style={{
              backgroundImage: `url(${movieHero})`,
            }}
          >
            <div className="hero-content">

              <div className="hero-text">

                <h2>Welcome to</h2>

                <h1>
                  <span>Cine</span>{" "}
                  <strong>No</strong>
                  <i className="bi bi-camera-reels"></i>
                </h1>

                <p>
                  Discover movies you'll love with
                  personalized suggestions, curated
                  collections, and quick searches -
                  your guide to finding great films.
                </p>

                <button
                  onClick={() =>
                    navigator("/movies/top-rated")
                  }
                  className="hero-button"
                >
                  Explore Movies
                </button>

              </div>

            </div>
          </section>
        )}

        {/* SLIDER */}
        {sliderApiPath && (
          <Slider
            apiPath={sliderApiPath}
            type={sliderType}
          />
        )}

        {/* PAGE TITLE WITH INTEGRATED BACK ARROW */}
        <h5 className="text-danger py-2 border-bottom mt-4 d-flex align-items-center">
          {parentPath && (
            <Link to={parentPath} className="me-2 back-arrow-title" aria-label={`Back to ${parentName}`}>
              <i className="bi bi-arrow-left"></i>
            </Link>
          )}
          <span>{title}</span>
        </h5>

        <div className="row row-cols-3 g-2 g-md-4 py-2">

          {movies.map((movie) => (
            <Card
              key={movie.id}
              movie={movie}
            />
          ))}

        </div>

        {/* INFINITE SCROLL SENTINEL & LOADER */}
        <div ref={sentinelRef} className="d-flex justify-content-center align-items-center py-4 my-3" style={{ minHeight: "60px" }}>
          {loading && (
            <div className="spinner-border text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
          {!loading && !hasMore && movies.length > 0 && (
            <div className="end-of-results-container">
              <span className="end-of-results-dot"></span>
              <span>End of results</span>
            </div>
          )}
        </div>
        {/* ANIME STREAMING WEBSITES */}
{showAnimeStreaming && <AnimeStreaming />}

      </main>

    </div>
  );
};