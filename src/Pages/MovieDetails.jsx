import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import background from "../assets/background.jpg";
import { convertMinutes } from "../utils/utils";
import { getWatchSources } from "../hooks/useWatchmode";
import { useStreamingAvailability } from "../hooks/useStreamingAvailability";

export const MovieDetails = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [movie, setMovie] = useState({});
  const [credits, setCredits] = useState({});
  const [externalIds, setExternalIds] = useState({});
  const [watchProviders, setWatchProviders] = useState({});
  const [watchmodeSources, setWatchmodeSources] = useState([]);
  const [videos, setVideos] = useState([]);

  const key = import.meta.env.VITE_API_KEY;

  // =====================================================
  // STREAMING AVAILABILITY API
  // =====================================================

  const {
    streamingOptions = [],
    loading: streamingLoading,
    error: streamingError,
  } = useStreamingAvailability(type, id);

  // =====================================================
  // API TYPE
  // =====================================================

  const apiPath = type === "tv" ? "tv" : "movie";

  // =====================================================
  // TMDB URLS
  // =====================================================

  const url =
    `https://api.themoviedb.org/3/${apiPath}/${id}` +
    `?api_key=${key}`;

  const creditsUrl =
    `https://api.themoviedb.org/3/${apiPath}/${id}/credits` +
    `?api_key=${key}`;

  const externalIdsUrl =
    `https://api.themoviedb.org/3/${apiPath}/${id}/external_ids` +
    `?api_key=${key}`;

  const providersUrl =
    `https://api.themoviedb.org/3/${apiPath}/${id}/watch/providers` +
    `?api_key=${key}`;

  const videosUrl =
    `https://api.themoviedb.org/3/${apiPath}/${id}/videos` +
    `?api_key=${key}&language=en-US`;

  // =====================================================
  // MOVIE DATA
  // =====================================================

  const {
    poster_path,
    title,
    release_date,
    vote_average,
    vote_count,
    overview,
    first_air_date,
    name,
    genres,
  } = movie;

  const displayTitle = title || name || "Unknown Title";

  const displayDate = release_date || first_air_date;

  const image = poster_path
    ? `https://image.tmdb.org/t/p/original${poster_path}`
    : background;

  // =====================================================
  // LANGUAGE NAME CONVERTER
  // =====================================================

  const languageNames = {
    eng: "English",
    tam: "Tamil",
    hin: "Hindi",
    tel: "Telugu",
    mal: "Malayalam",
    kan: "Kannada",
    mar: "Marathi",
    ben: "Bengali",
    pan: "Punjabi",
    guj: "Gujarati",
    ara: "Arabic",
    fra: "French",
    deu: "German",
    spa: "Spanish",
    jpn: "Japanese",
    kor: "Korean",
    chi: "Chinese",
    por: "Portuguese",
    rus: "Russian",
    ita: "Italian",
    tur: "Turkish",
    tha: "Thai",
    vie: "Vietnamese",
    ind: "Indonesian",
    pol: "Polish",
    nld: "Dutch",
    swe: "Swedish",
    dan: "Danish",
    nor: "Norwegian",
  };

  const getLanguageName = (code) => {
    if (!code) return "Unknown";

    const normalizedCode = code
      .toString()
      .toLowerCase()
      .split("-")[0]
      .split("_")[0];

    return (
      languageNames[normalizedCode] ||
      code.toString().toUpperCase()
    );
  };

  // =====================================================
  // FETCH MOVIE / TV DETAILS
  // =====================================================

  useEffect(() => {
    let active = true;
    const fetchDetails = async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const data = await response.json();

        if (active) {
          setMovie(data);
          console.log("MOVIE DETAILS:", data);
        }
      } catch (error) {
        console.error("DETAILS ERROR:", error);
      }
    };

    if (id && key) {
      fetchDetails();
    }

    return () => {
      active = false;
    };
  }, [url, id, key]);

  // =====================================================
  // FETCH CREDITS
  // =====================================================

  useEffect(() => {
    let active = true;
    const fetchCredits = async () => {
      try {
        const response = await fetch(creditsUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch credits");
        }

        const data = await response.json();

        if (active) {
          setCredits(data);
          console.log("CREDITS:", data);
        }
      } catch (error) {
        console.error("CREDITS ERROR:", error);
      }
    };

    if (id && key) {
      fetchCredits();
    }

    return () => {
      active = false;
    };
  }, [creditsUrl, id, key]);

  // =====================================================
  // FETCH EXTERNAL IDS
  // =====================================================

  useEffect(() => {
    let active = true;
    const fetchExternalIds = async () => {
      try {
        const response = await fetch(externalIdsUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch external IDs");
        }

        const data = await response.json();

        if (active) {
          setExternalIds(data);
          console.log("EXTERNAL IDS:", data);
        }
      } catch (error) {
        console.error("EXTERNAL IDS ERROR:", error);
      }
    };

    if (id && key) {
      fetchExternalIds();
    }

    return () => {
      active = false;
    };
  }, [externalIdsUrl, id, key]);

  // =====================================================
  // FETCH TMDB WATCH PROVIDERS - INDIA
  // =====================================================

  useEffect(() => {
    let active = true;
    const fetchWatchProviders = async () => {
      try {
        const response = await fetch(providersUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch watch providers");
        }

        const data = await response.json();

        const indiaProviders = data.results?.IN || {};

        if (active) {
          setWatchProviders(indiaProviders);
          console.log("INDIA WATCH PROVIDERS:", indiaProviders);
        }
      } catch (error) {
        console.error("WATCH PROVIDERS ERROR:", error);
        if (active) {
          setWatchProviders({});
        }
      }
    };

    if (id && key) {
      fetchWatchProviders();
    }

    return () => {
      active = false;
    };
  }, [providersUrl, id, key]);

  // =====================================================
  // FETCH WATCHMODE SOURCES
  // =====================================================

  useEffect(() => {
    let active = true;
    const fetchWatchmodeSources = async () => {
      try {
        const data = await getWatchSources(type, id);

        console.log("WATCHMODE SOURCES:", data);

        if (active) {
          const list = Array.isArray(data) ? data : [];
          const seen = new Set();
          const uniqueList = list.filter((source) => {
            const name = (source.name || source.source_name || "").toLowerCase().trim();
            const typeVal = (source.type || "").toLowerCase().trim();
            const key = `${name}-${typeVal}`;
            if (seen.has(key)) {
              return false;
            }
            seen.add(key);
            return true;
          });
          setWatchmodeSources(uniqueList);
        }
      } catch (error) {
        console.error("WATCHMODE ERROR:", error);
        if (active) {
          setWatchmodeSources([]);
        }
      }
    };

    if (id) {
      fetchWatchmodeSources();
    }

    return () => {
      active = false;
    };
  }, [type, id]);

  // =====================================================
  // FETCH TRAILERS / SCENES / VIDEOS
  // =====================================================

  useEffect(() => {
    let active = true;
    const fetchVideos = async () => {
      try {
        const response = await fetch(videosUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }

        const data = await response.json();

        console.log("VIDEOS:", data);

        if (active) {
          setVideos(data.results || []);
        }
      } catch (error) {
        console.error("VIDEOS ERROR:", error);
        if (active) {
          setVideos([]);
        }
      }
    };

    if (id && key) {
      fetchVideos();
    }

    return () => {
      active = false;
    };
  }, [videosUrl, id, key]);

  // =====================================================
  // PAGE TITLE
  // =====================================================

  useEffect(() => {
    document.title =
      displayTitle !== "Unknown Title"
        ? displayTitle
        : "CineNo";
  }, [displayTitle]);

  // =====================================================
  // FIND BEST TRAILER
  // =====================================================

  const trailer =
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official === true
    ) ||
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer"
    ) ||
    videos.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Teaser"
    );

  // =====================================================
  // FIND SCENES
  // =====================================================

  const sceneVideos = videos
    .filter(
      (video) =>
        video.site === "YouTube" &&
        [
          "Teaser",
          "Clip",
          "Featurette",
          "Behind the Scenes",
        ].includes(video.type)
    )
    .filter(
      (video) => video.key !== trailer?.key
    )
    .slice(0, 6);

  // =====================================================
  // GET AUDIO LANGUAGES
  // =====================================================

  const getAudioLanguages = (option) => {
    if (!Array.isArray(option?.audios)) {
      return [];
    }

    return option.audios
      .map((audio) => {
        return (
          audio?.language ||
          audio?.languageCode ||
          audio?.locale?.language ||
          audio?.locale?.languageCode
        );
      })
      .filter(Boolean);
  };

  // =====================================================
  // CREATE SERVICE + AUDIO LANGUAGE DATA
  // =====================================================

  const serviceLanguages = {};

  streamingOptions.forEach((option) => {
    const serviceName =
      option?.service?.name ||
      option?.service?.id ||
      option?.name ||
      "Streaming Service";

    const languages = getAudioLanguages(option);

    if (!serviceLanguages[serviceName]) {
      serviceLanguages[serviceName] = [];
    }

    languages.forEach((language) => {
      if (
        !serviceLanguages[serviceName].includes(language)
      ) {
        serviceLanguages[serviceName].push(language);
      }
    });
  });

  const servicesWithLanguages =
    Object.entries(serviceLanguages).filter(
      ([, languages]) => languages.length > 0
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="container movie-details-page">

      {/* =================================================
          TITLE
      ================================================= */}

      <h5 className="details-page-title d-flex align-items-center gap-3">
        <i 
          className="bi bi-arrow-left text-light" 
          style={{ cursor: "pointer", fontSize: "28px", transition: "color 0.2s ease" }} 
          onMouseOver={(e) => e.currentTarget.style.color = "#ef3340"}
          onMouseOut={(e) => e.currentTarget.style.color = "#f8fafc"}
          onClick={() => navigate(-1)}
          title="Go Back"
        ></i>
        <span>{displayTitle}</span>
      </h5>

      {/* =================================================
          MAIN DETAILS
      ================================================= */}

      <div className="row movie-details-main">

        {/* POSTER */}

        <div className="col-md-4">
          <div className="details-poster-container">

            <img
              src={image}
              alt={displayTitle}
              className="details-poster"
            />

          </div>
        </div>

        {/* INFORMATION */}

        <div className="col-md-8 details-content">

          <h3 className="details-title">
            {displayTitle}
          </h3>

          {/* OVERVIEW */}

          <p className="details-overview">
            {overview || "No overview available."}
          </p>

          {/* GENRES */}

          {genres?.length > 0 && (
            <div className="details-genres">

              {genres.map((genre) => (
                <span
                  key={genre.id}
                  className="genre-badge"
                >
                  {genre.name}
                </span>
              ))}

            </div>
          )}

          {/* RATING */}

          <div className="details-rating-row">

            <div className="rating-box">

              <i className="bi bi-star-fill"></i>

              <span>
                {typeof vote_average === "number"
                  ? vote_average.toFixed(1)
                  : "N/A"}
              </span>

            </div>

            <div className="reviews-box">

              <i className="bi bi-people-fill"></i>

              <span>
                {vote_count || 0} reviews
              </span>

            </div>

          </div>

          {/* INFORMATION TABLE */}

          <table className="details-table">

            <tbody>

              <tr>
                <th>
                  {type === "tv"
                    ? "First Air Date"
                    : "Release Date"}
                </th>

                <td>
                  {displayDate || "Not available"}
                </td>
              </tr>

              {/* MOVIE */}

              {type === "movie" && (
                <>
                  <tr>
                    <th>Runtime</th>

                    <td>
                      {movie.runtime
                        ? convertMinutes(movie.runtime)
                        : "Not available"}
                    </td>
                  </tr>

                  <tr>
                    <th>Budget</th>

                    <td>
                      {movie.budget
                        ? `$${movie.budget.toLocaleString()}`
                        : "Not available"}
                    </td>
                  </tr>

                  <tr>
                    <th>Revenue</th>

                    <td>
                      {movie.revenue
                        ? `$${movie.revenue.toLocaleString()}`
                        : "Not available"}
                    </td>
                  </tr>
                </>
              )}

              {/* TV */}

              {type === "tv" && (
                <>
                  <tr>
                    <th>Seasons</th>

                    <td>
                      {movie.number_of_seasons || 0}
                    </td>
                  </tr>

                  <tr>
                    <th>Episodes</th>

                    <td>
                      {movie.number_of_episodes || 0}
                    </td>
                  </tr>
                </>
              )}

            </tbody>

          </table>

          {/* IMDb */}

          {externalIds.imdb_id && (
            <a
              className="imdb-button"
              href={`https://www.imdb.com/title/${externalIds.imdb_id}/`}
              target="_blank"
              rel="noreferrer"
            >
              <i className="bi bi-film"></i>{" "}
              View in IMDb
            </a>
          )}

        </div>
      </div>

      {/* =================================================
          OFFICIAL TRAILER
      ================================================= */}

      {trailer && (
        <section className="mt-5">

          <h2 className="details-section-title">
            {trailer.type === "Trailer"
              ? "Official Trailer"
              : trailer.type}
          </h2>

          <div className="trailer-container">

            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title={trailer.name}
              className="trailer-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>

          </div>

          <h5 className="video-name">
            {trailer.name}
          </h5>

        </section>
      )}

      {/* =================================================
          SCENES
      ================================================= */}

      {sceneVideos.length > 0 && (
        <section className="mt-5">

          <h2 className="details-section-title">
            Trailers & Scenes
          </h2>

          <div className="row g-4">

            {sceneVideos.map((video) => (
              <div
                className="col-md-6"
                key={video.id}
              >

                <div className="video-card">

                  <div className="video-wrapper">

                    <iframe
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>

                  </div>

                  <div className="video-card-body">

                    <span className="video-type">
                      {video.type}
                    </span>

                    <h6 className="video-title">
                      {video.name}
                    </h6>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </section>
      )}

      {/* =================================================
          WHERE TO WATCH
      ================================================= */}

      {(watchProviders.flatrate ||
        watchProviders.rent ||
        watchProviders.buy) && (
          <section className="mt-5">

            <h2 className="details-section-title">
              Where to Watch
            </h2>

            {/* STREAMING */}

            {watchProviders.flatrate && (
              <div className="mb-4">

                <h6 className="text-light">
                  Streaming
                </h6>

                <div className="d-flex flex-wrap gap-3">

                  {watchProviders.flatrate.map(
                    (provider, index) => (
                      <div
                        className="watch-provider"
                        key={provider.provider_id || index}
                      >

                        {provider.logo_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                            alt={provider.provider_name}
                            className="watch-provider-logo"
                          />
                        )}

                        <span>
                          {provider.provider_name}
                        </span>

                      </div>
                    )
                  )}

                </div>
              </div>
            )}

            {/* RENT */}

            {watchProviders.rent && (
              <div className="mb-4">

                <h6 className="text-light">
                  Rent
                </h6>

                <div className="d-flex flex-wrap gap-3">

                  {watchProviders.rent.map(
                    (provider, index) => (
                      <div
                        className="watch-provider"
                        key={provider.provider_id || index}
                      >

                        {provider.logo_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                            alt={provider.provider_name}
                            className="watch-provider-logo"
                          />
                        )}

                        <span>
                          {provider.provider_name}
                        </span>

                      </div>
                    )
                  )}

                </div>
              </div>
            )}

            {/* BUY */}

            {watchProviders.buy && (
              <div className="mb-4">

                <h6 className="text-light">
                  Buy
                </h6>

                <div className="d-flex flex-wrap gap-3">

                  {watchProviders.buy.map(
                    (provider, index) => (
                      <div
                        className="watch-provider"
                        key={provider.provider_id || index}
                      >

                        {provider.logo_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                            alt={provider.provider_name}
                            className="watch-provider-logo"
                          />
                        )}

                        <span>
                          {provider.provider_name}
                        </span>

                      </div>
                    )
                  )}

                </div>
              </div>
            )}

          </section>
        )}

      {/* =================================================
          WATCHMODE SOURCES
      ================================================= */}

      {watchmodeSources.length > 0 && (
        <section className="mt-5">

          <h2 className="details-section-title">
            Streaming Services
          </h2>

          <p className="streaming-hint-text">
            Tap a platform below to start watching.
          </p>

          <div className="watchmode-sources-container">

            {watchmodeSources.map(
              (source, index) => (
                <a
                  key={`${source.name || "source"}-${index}`}
                  href={
                    source.web_url ||
                    source.link ||
                    "#"
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="watchmode-source"
                >

                  <strong>
                    {source.name ||
                      source.source_name ||
                      "Streaming Service"}
                  </strong>

                  {source.type && (
                    <small>
                      {" "}
                      • {source.type}
                    </small>
                  )}

                </a>
              )
            )}

          </div>

        </section>
      )}

      {/* =================================================
          ORIGINAL LANGUAGES
      ================================================= */}

      {movie.spoken_languages?.length > 0 && (
        <section className="mt-5">

          <h2 className="details-section-title">
            Original Languages
          </h2>

          <div className="d-flex flex-wrap gap-2">

            {movie.spoken_languages.map(
              (language) => (
                <span
                  key={language.iso_639_1}
                  className="language-badge"
                >
                  {language.english_name}
                </span>
              )
            )}

          </div>

        </section>
      )}

      {/* =================================================
          OTT AUDIO LANGUAGES
      ================================================= */}

      <section className="mt-5">

        <h2 className="details-section-title">
          🎧 Available OTT Audio Languages
        </h2>

        {/* LOADING */}

        {streamingLoading && (
          <p className="text-secondary">
            Checking available audio languages...
          </p>
        )}

        {/* ERROR */}

        {!streamingLoading && streamingError && (
          <>
            <p className="text-warning">
              Unable to load OTT audio languages.
            </p>

            <small className="text-secondary">
              {streamingError}
            </small>
          </>
        )}

        {/* NO DATA */}

        {!streamingLoading &&
          !streamingError &&
          streamingOptions.length === 0 && (
            <div>

              <p className="text-secondary">
                No OTT streaming information found
                for India.
              </p>

              <small className="text-secondary">
                The title may not have streaming
                availability or audio-language
                metadata in the API.
              </small>

            </div>
          )}

        {/* STREAMING OPTIONS EXIST BUT NO AUDIO */}

        {!streamingLoading &&
          !streamingError &&
          streamingOptions.length > 0 &&
          servicesWithLanguages.length === 0 && (
            <div>

              <p className="text-secondary">
                Streaming service found, but audio
                language information was not returned
                by the API.
              </p>

              <small className="text-secondary">
                This does not necessarily mean that
                Tamil, Hindi, Telugu, or other dubbed
                audio is unavailable on the OTT app.
              </small>

            </div>
          )}

        {/* AUDIO LANGUAGES */}

        {!streamingLoading &&
          !streamingError &&
          servicesWithLanguages.length > 0 && (
            <div>

              <p className="text-secondary mb-4">
                Audio languages available on
                streaming services in India.
              </p>

              {servicesWithLanguages.map(
                ([serviceName, languages]) => (
                  <div
                    className="audio-language-card mb-3"
                    key={serviceName}
                  >

                    <div className="audio-service-header">

                      <h5>
                        {serviceName}
                      </h5>

                      <span className="audio-type">
                        India
                      </span>

                    </div>

                    <div className="d-flex flex-wrap gap-2">

                      {languages.map(
                        (languageCode) => (
                          <span
                            key={languageCode}
                            className="audio-language-badge"
                          >
                            🎧{" "}
                            {getLanguageName(
                              languageCode
                            )}
                          </span>
                        )
                      )}

                    </div>

                  </div>
                )
              )}

            </div>
          )}

      </section>



      {/* =================================================
          CAST
      ================================================= */}

      <section className="mt-5">

        <h2 className="details-section-title">
          Cast
        </h2>

        <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-3">

          {credits.cast
            ?.slice(0, 12)
            .map((person) => {

              const profileImage =
                person.profile_path
                  ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                  : background;

              return (
                <div
                  className="col"
                  key={person.id}
                >

                  <div className="cast-card">

                    <img
                      src={profileImage}
                      className="cast-image"
                      alt={person.name}
                    />

                    <div className="cast-card-body">

                      <h6 className="cast-name">
                        {person.name}
                      </h6>

                      <small className="cast-character">
                        {person.character ||
                          "Unknown role"}
                      </small>

                    </div>

                  </div>

                </div>
              );
            })}

        </div>

      </section>

    </main>
  );
};