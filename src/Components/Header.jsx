import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export const Header = () => {
  const navigator = useNavigate();
  const location = useLocation();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Autocomplete suggestions states
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const key = import.meta.env.VITE_API_KEY;

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Close menus when route changes
  useEffect(() => {
    setShowMobileSearch(false);
    setShowSuggestions(false);
    setQuery("");
    const menu = document.getElementById("Menu");
    if (menu && menu.classList.contains("show")) {
      menu.classList.remove("show");
    }
  }, [location]);

  // Debounced multi-search fetching for suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${key}&query=${encodeURIComponent(
            query.trim()
          )}`
        );
        if (response.ok) {
          const data = await response.json();
          // Filter out people, only keep movies/tv shows
          const filtered = (data.results || [])
            .filter((item) => item.media_type === "movie" || item.media_type === "tv")
            .slice(0, 5); // show top 5 suggestions for clean UI
          setSuggestions(filtered);
        }
      } catch (error) {
        console.error("Suggestions fetch error:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query, key]);

  // Dismiss suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isOutsideDesktop =
        desktopSearchRef.current && !desktopSearchRef.current.contains(e.target);
      const isOutsideMobile =
        mobileSearchRef.current && !mobileSearchRef.current.contains(e.target);

      if (isOutsideDesktop && isOutsideMobile) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Classifies suggestions as Movie, TV Show, or Anime
  const getMediaInfo = (item) => {
    const isAnimation = item.genre_ids?.includes(16);
    const isJapanese = item.original_language === "ja";

    let type = "movie";
    let typeLabel = "Movie";
    let badgeClass = "badge-movie";

    if (item.media_type === "tv") {
      if (isAnimation && isJapanese) {
        type = "tv";
        typeLabel = "Anime";
        badgeClass = "badge-anime";
      } else {
        type = "tv";
        typeLabel = "TV Show";
        badgeClass = "badge-tv";
      }
    } else if (item.media_type === "movie") {
      if (isAnimation && isJapanese) {
        type = "movie";
        typeLabel = "Anime";
        badgeClass = "badge-anime";
      } else {
        type = "movie";
        typeLabel = "Movie";
        badgeClass = "badge-movie";
      }
    }

    return { type, typeLabel, badgeClass };
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const queryTerm = e.target.search.value.trim();

    if (!queryTerm) return;

    // Reset autocomplete states
    setQuery("");
    setShowSuggestions(false);
    setShowMobileSearch(false);

    e.target.reset();
    navigator(`/search?q=${queryTerm}`);
  };

  // Renders the autocomplete dropdown list
  const renderSuggestions = (isMobile) => {
    if (!query.trim()) return null;

    return (
      <div className={isMobile ? "suggestions-dropdown-mobile" : "suggestions-dropdown"}>
        {loading && (
          <div className="suggestions-loading">
            <div className="spinner-border spinner-border-sm text-info" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span>Finding titles...</span>
          </div>
        )}

        {!loading && suggestions.length === 0 && (
          <div className="suggestions-empty">
            No results found for "{query}"
          </div>
        )}

        {!loading && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((item) => {
              const { type, typeLabel, badgeClass } = getMediaInfo(item);
              const titleText = item.title || item.name;
              const releaseDate = item.release_date || item.first_air_date || "";
              const year = releaseDate ? releaseDate.slice(0, 4) : "";
              const thumbUrl = item.poster_path
                ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                : null;

              const detailsUrl = `/${type}/${item.id}`;

              return (
                <li key={`${item.media_type}-${item.id}`} className="suggestion-item">
                  <NavLink
                    to={detailsUrl}
                    className="suggestion-link"
                    onClick={() => {
                      setQuery("");
                      setShowSuggestions(false);
                      setShowMobileSearch(false);
                    }}
                  >
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={titleText}
                        className="suggestion-thumb"
                      />
                    ) : (
                      <div className="suggestion-thumb-fallback">
                        <i className="bi bi-camera-reels"></i>
                      </div>
                    )}
                    <div className="suggestion-info">
                      <h6 className="suggestion-title">{titleText}</h6>
                      <div className="suggestion-meta">
                        <span className={`suggestion-badge ${badgeClass}`}>
                          {typeLabel}
                        </span>
                        {year && <span>{year}</span>}
                      </div>
                    </div>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top navbar-dark pt-2 pb-3 flex-column">
      <div className="container-fluid">

        {/* Desktop Logo (visible on lg devices) */}
        <NavLink to="/" className="navbar-brand d-none d-lg-block ">
          Cine <span className="header-title">No</span>{" "}
          <i className="bi bi-camera-reels header-icon fs-3"></i>
        </NavLink>

        {/* Mobile Header Layout (visible on small devices) */}
        <div className="d-flex d-lg-none align-items-center justify-content-between w-100 mobile-header-row">
          {/* Left side: Menu toggle with text Menu */}
          <button
            className="navbar-mobile-toggle-btn"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#Menu"
            aria-controls="Menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            Menu
          </button>

          {/* Center: Website name */}
          <NavLink to="/" className="navbar-brand m-0">
            Cine <span className="header-title">No</span>{" "}
            <i className="bi bi-camera-reels header-icon fs-4"></i>
          </NavLink>

          {/* Right side: Search Icon */}
          <button
            className="navbar-mobile-search-btn"
            type="button"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            aria-label="Toggle search"
          >
            <i className={`bi ${showMobileSearch ? "bi-x" : "bi-search"} fs-4`}></i>
          </button>
        </div>

        {/* Collapsible menu items */}
        <div className="collapse navbar-collapse" id="Menu">

          <ul className="navbar-nav me-auto mb-2 mb-lg-0 mt-lg-2 gap-2">

            {/* HOME */}
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>

            {/* MOVIES */}
            <li className="nav-item">
              <NavLink to="/movies" className="nav-link">
                Movies
              </NavLink>
            </li>

            {/* TV SERIES */}
            <li className="nav-item">
              <NavLink to="/tvshows" className="nav-link">
                TV Series
              </NavLink>
            </li>

            {/* ANIME */}
            <li className="nav-item">
              <NavLink to="/anime" className="nav-link">
                Anime
              </NavLink>
            </li>

          </ul>

          {/* SEARCH FOR DESKTOP */}
          <div className="search-wrapper-desktop d-none d-lg-block" ref={desktopSearchRef}>
            <form onSubmit={handleSearch}>
              <input
                type="search"
                className="form-control"
                placeholder="Search..."
                name="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                autoComplete="off"
              />
            </form>
            {showSuggestions && renderSuggestions(false)}
          </div>

        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      {showMobileSearch && (
        <div className="mobile-search-bar w-100 d-lg-none px-3 mt-2" ref={mobileSearchRef}>
          <div className="mobile-search-wrapper">
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search movies, TV shows, anime..."
                  name="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  autoFocus
                  autoComplete="off"
                />
                <button className="btn btn-outline-info" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
            {showSuggestions && renderSuggestions(true)}
          </div>
        </div>
      )}
    </nav>
  );
};