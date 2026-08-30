import { useEffect, useState } from "react";

export const useFetch = (apiPath, queryTerm = "", page = 1) => {
  const [data, setData] = useState([]);

  const key = import.meta.env.VITE_API_KEY;

  let url = `https://api.themoviedb.org/3/${apiPath}?api_key=${key}&page=${page}${queryTerm}`;

  // ==============================
  // UPCOMING MOVIES
  // ==============================
  if (apiPath === "movie/upcoming") {
    url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&page=${page}&region=IN`;
  }

  // ==============================
  // UPCOMING TV SHOWS
  // ==============================
  if (apiPath === "tv/upcoming") {
    const today = new Date().toISOString().split("T")[0];

    url =
      `https://api.themoviedb.org/3/discover/tv` +
      `?api_key=${key}` +
      `&page=${page}` +
      `&sort_by=first_air_date.asc` +
      `&first_air_date.gte=${today}`;
  }
  // ==============================
  // ANIME
  // ==============================
  // Anime is fetched from TMDB using
  // Japanese animation genre = 16
  if (apiPath === "anime/popular") {
    url =
      `https://api.themoviedb.org/3/discover/tv` +
      `?api_key=${key}` +
      `&page=${page}` +
      `&with_genres=16` +
      `&sort_by=popularity.desc`;
  }

  if (apiPath === "anime/top-rated") {
    url =
      `https://api.themoviedb.org/3/discover/tv` +
      `?api_key=${key}` +
      `&page=${page}` +
      `&with_genres=16` +
      `&sort_by=vote_average.desc` +
      `&vote_count.gte=100`;
  }

  if (apiPath === "anime/upcoming") {
    url =
      `https://api.themoviedb.org/3/discover/tv` +
      `?api_key=${key}` +
      `&page=${page}` +
      `&with_genres=16` +
      `&sort_by=first_air_date.asc` +
      `&first_air_date.gte=${new Date().toISOString().split("T")[0]}`;
  }

  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const jsonData = await response.json();

        let results = jsonData.results || [];

        // ==============================
        // FILTER UPCOMING MOVIES
        // ==============================
        if (apiPath === "movie/upcoming") {
          const today = new Date()
            .toISOString()
            .split("T")[0];

          results = results.filter((movie) => {
            return (
              movie.release_date &&
              movie.release_date >= today
            );
          });
        }

        // ==============================
        // FILTER UPCOMING TV
        // ==============================
        if (apiPath === "tv/on_the_air") {
          const today = new Date()
            .toISOString()
            .split("T")[0];

          results = results.filter((show) => {
            return (
              show.first_air_date &&
              show.first_air_date >= today
            );
          });
        }

        // ==============================
        // FILTER ANIME UPCOMING
        // ==============================
        if (apiPath === "anime/upcoming") {
          const today = new Date()
            .toISOString()
            .split("T")[0];

          results = results.filter((show) => {
            return (
              show.first_air_date &&
              show.first_air_date >= today
            );
          });
        }

        if (active) {
          setData(results);
        }

      } catch (error) {
        console.error("useFetch Error:", error);
        if (active) {
          setData([]);
        }
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [url, apiPath]);

  return { data };
};
 
