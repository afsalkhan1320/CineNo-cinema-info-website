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
    // Indian Languages
    tam: "Tamil",
    hin: "Hindi",
    tel: "Telugu",
    mal: "Malayalam",
    kan: "Kannada",
    mar: "Marathi",
    ben: "Bengali",
    pan: "Punjabi",
    guj: "Gujarati",
    urd: "Urdu",
    ori: "Odia",
    asm: "Assamese",
    san: "Sanskrit",
    // International Languages (3-letter)
    eng: "English",
    kor: "Korean",
    jpn: "Japanese",
    chi: "Chinese",
    zho: "Chinese",
    cmn: "Mandarin Chinese",
    yue: "Cantonese",
    spa: "Spanish",
    fra: "French",
    fre: "French",
    deu: "German",
    ger: "German",
    ita: "Italian",
    por: "Portuguese",
    rus: "Russian",
    tur: "Turkish",
    tha: "Thai",
    vie: "Vietnamese",
    ind: "Indonesian",
    pol: "Polish",
    nld: "Dutch",
    dut: "Dutch",
    swe: "Swedish",
    dan: "Danish",
    nor: "Norwegian",
    ces: "Czech",
    cze: "Czech",
    fil: "Filipino",
    tgl: "Tagalog",
    hun: "Hungarian",
    fin: "Finnish",
    ell: "Greek",
    gre: "Greek",
    heb: "Hebrew",
    ron: "Romanian",
    rum: "Romanian",
    ukr: "Ukrainian",
    msa: "Malay",
    may: "Malay",
    fas: "Persian",
    per: "Persian",
    ara: "Arabic",
    kat: "Georgian",
    geo: "Georgian",
    slk: "Slovak",
    slo: "Slovak",
    bul: "Bulgarian",
    hrv: "Croatian",
    srp: "Serbian",
    slv: "Slovenian",
    lit: "Lithuanian",
    lav: "Latvian",
    est: "Estonian",
    isl: "Icelandic",
    cat: "Catalan",
    eus: "Basque",
    glg: "Galician",
    // 2-letter ISO codes
    ta: "Tamil",
    hi: "Hindi",
    te: "Telugu",
    ml: "Malayalam",
    kn: "Kannada",
    mr: "Marathi",
    bn: "Bengali",
    pa: "Punjabi",
    gu: "Gujarati",
    ur: "Urdu",
    en: "English",
    ko: "Korean",
    ja: "Japanese",
    zh: "Chinese",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ru: "Russian",
    tr: "Turkish",
    th: "Thai",
    vi: "Vietnamese",
    id: "Indonesian",
    pl: "Polish",
    nl: "Dutch",
    sv: "Swedish",
    da: "Danish",
    no: "Norwegian",
    cs: "Czech",
    hu: "Hungarian",
    fi: "Finnish",
    el: "Greek",
    he: "Hebrew",
    ro: "Romanian",
    uk: "Ukrainian",
    ms: "Malay",
    fa: "Persian",
    ar: "Arabic",
  };

  const getLanguageName = (code) => {
    if (!code) return "Unknown";

    const normalizedCode = code
      .toString()
      .toLowerCase()
      .split("-")[0]
      .split("_")[0]
      .trim();

    if (languageNames[normalizedCode]) {
      return languageNames[normalizedCode];
    }

    try {
      if (typeof Intl !== "undefined" && Intl.DisplayNames) {
        const displayName = new Intl.DisplayNames(["en"], { type: "language" }).of(normalizedCode);
        if (displayName && displayName.toLowerCase() !== normalizedCode) {
          return displayName;
        }
      }
    } catch {
      // Ignore fallback
    }

    return code.toString().toUpperCase();
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
    const list = [];
    if (Array.isArray(option?.audios)) {
      option.audios.forEach((audio) => {
        const lang = typeof audio === "string"
          ? audio
          : (audio?.language || audio?.languageCode || audio?.code || audio?.locale?.language || audio?.locale?.languageCode);
        if (lang) list.push(lang);
      });
    }
    if (Array.isArray(option?.audioLanguages)) {
      option.audioLanguages.forEach((lang) => {
        if (typeof lang === "string") list.push(lang);
        else if (lang?.code || lang?.language) list.push(lang.code || lang.language);
      });
    }
    if (Array.isArray(option?.audioTracks)) {
      option.audioTracks.forEach((lang) => {
        if (typeof lang === "string") list.push(lang);
        else if (lang?.code || lang?.language) list.push(lang.code || lang.language);
      });
    }
    return [...new Set(list)];
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

  // Fallback / Detected OTT Providers from TMDB & Watchmode
  const detectedOttProviders = [];
  if (watchProviders?.flatrate?.length > 0) {
    watchProviders.flatrate.forEach((p) => {
      if (p.provider_name && !detectedOttProviders.includes(p.provider_name)) {
        detectedOttProviders.push(p.provider_name);
      }
    });
  }
  if (watchmodeSources?.length > 0) {
    watchmodeSources.forEach((s) => {
      const name = s.name || s.source_name;
      if (name && !detectedOttProviders.includes(name)) {
        detectedOttProviders.push(name);
      }
    });
  }

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

        {!streamingLoading && streamingError && servicesWithLanguages.length === 0 && detectedOttProviders.length === 0 && (
          <div>
            <p className="text-warning mb-1">
              Unable to fetch streaming language metadata from live provider API.
            </p>
            <small className="text-secondary">
              {streamingError}
            </small>
          </div>
        )}

        {/* AUDIO LANGUAGES AVAILABLE */}

        {!streamingLoading && servicesWithLanguages.length > 0 && (
          <div>
            <p className="text-secondary mb-4">
              Audio languages available on streaming services in India:
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

        {/* FALLBACK: STREAMING SERVICES DETECTED BUT LIVE AUDIO API HAS NO DETAILED TRACKS */}
        {!streamingLoading && servicesWithLanguages.length === 0 && detectedOttProviders.length > 0 && (
          <div>
            <p className="text-secondary mb-3">
              Confirmed streaming platform(s) available for India:
            </p>

            {detectedOttProviders.map((serviceName) => (
              <div
                className="audio-language-card mb-3"
                key={serviceName}
              >
                <div className="audio-service-header">
                  <h5>{serviceName}</h5>
                  <span className="audio-type">India • Streaming</span>
                </div>

                <div className="d-flex flex-wrap gap-2 mb-2">
                  {movie.spoken_languages?.length > 0 ? (
                    movie.spoken_languages.map((lang) => (
                      <span
                        key={lang.iso_639_1}
                        className="audio-language-badge"
                      >
                        🎧 {lang.english_name} (Original)
                      </span>
                    ))
                  ) : (
                    <span className="audio-language-badge">
                      🎧 {getLanguageName(movie.original_language || "en")}
                    </span>
                  )}
                </div>

                <small className="text-secondary d-block mt-2">
                  💡 Additional audio dubs (such as Tamil, Telugu, Hindi, or English) may also be available directly within the {serviceName} app.
                </small>
              </div>
            ))}
          </div>
        )}

        {/* NO STREAMING SERVICES FOUND AT ALL */}
        {!streamingLoading &&
          !streamingError &&
          servicesWithLanguages.length === 0 &&
          detectedOttProviders.length === 0 && (
            <div>
              <p className="text-secondary">
                No OTT streaming information found for India.
              </p>
              <small className="text-secondary">
                The title may not have streaming availability or audio-language metadata in the API currently.
              </small>
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