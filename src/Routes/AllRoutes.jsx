import React from "react";
import { Routes, Route } from "react-router-dom";
import { MovieDetails, MovieList, PageNotFound, Search, Home, MoviesSection, TvSection, AnimeSection } from "../Pages";
 

 export const AllRoutes = () => {
  return (
    <Routes>

      {/* ==================================
          HOME
      ================================== */}
      <Route
        path="/"
        element={
          <Home />
        }
      />

      {/* ==================================
          MOVIES
      ================================== */}
 
<Route
  path="/movies"
  element={
    <MoviesSection />
  }
/>
<Route
  path="/movies/popular"
  element={
    <MovieList
      title="Popular Movies 🎬"
      apiPath="movie/popular"
      parentPath="/movies"
      parentName="Movies"
    />
  }
/>

<Route
  path="/movies/top-rated"
  element={
    <MovieList
      title="Top Rated Movies ⭐"
      apiPath="movie/top_rated"
      parentPath="/movies"
      parentName="Movies"
    />
  }
/>

<Route
  path="/movies/upcoming"
  element={
    <MovieList
      title="Upcoming Movies ❤️"
      apiPath="movie/upcoming"
      parentPath="/movies"
      parentName="Movies"
    />
  }
/>
      {/* ==================================
          TV SERIES
      ================================== */}

      <Route
        path="/tvshows"
        element={
          <TvSection />
        }
      />
      {/* =========================
    TV POPULAR
========================= */}

<Route
  path="/tvshows/popular"
  element={
    <MovieList
      title="Popular TV Shows 📺"
      apiPath="tv/popular"
      parentPath="/tvshows"
      parentName="TV Series"
    />
  }
/>


{/* =========================
    TV TOP RATED
========================= */}

<Route
  path="/tvshows/top-rated"
  element={
    <MovieList
      title="Top Rated TV Shows ⭐"
      apiPath="tv/top_rated"
      parentPath="/tvshows"
      parentName="TV Series"
    />
  }
/>


{/* =========================
    TV UPCOMING
========================= */}

<Route
  path="/tvshows/upcoming"
  element={
    <MovieList
      title="Upcoming TV Shows ❤️"
      apiPath="tv/upcoming"
      parentPath="/tvshows"
      parentName="TV Series"
    />
  }
/>

  {/* =========================
    ANIME
========================= */}

<Route
  path="/anime/popular"
  element={
    <MovieList
      title="Popular Anime 🔥 "
      apiPath="anime/popular"
      parentPath="/anime"
      parentName="Anime"
    />
  }
/>

<Route
  path="/anime/top-rated"
  element={
    <MovieList
      title="Top Rated Anime ⭐"
      apiPath="anime/top-rated"
      parentPath="/anime"
      parentName="Anime"
    />
  }
/>

<Route
  path="/anime/upcoming"
  element={
    <MovieList
      title="Upcoming Anime ❤️"
      apiPath="anime/upcoming"
      parentPath="/anime"
      parentName="Anime"
    />
  }
/>
      {/* ==================================
          MOVIE DETAILS
      ================================== */}

      <Route
        path="/movie/:id"
        element={
          <MovieDetails type="movie" />
        }
      />

      {/* ==================================
          TV / ANIME DETAILS
      ================================== */}

      <Route
        path="/tv/:id"
        element={
          <MovieDetails type="tv" />
        }
      />
      {/* search  */}
<Route
  path="/search"
  element={<Search apiPath="search/multi" />}
/>
<Route
  path="/anime"
  element={
    <AnimeSection />
  }
/>
<Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};
