import React from "react";
import { useRef } from "react";
import { Card } from "./Card";
import { useFetch } from "../hooks/useFetch";

export const CardSlider = ({ apiPath, type = "movie" }) => {
  const { data: items = [] } = useFetch(apiPath);
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center py-4">
        <div className="spinner-border text-info" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Filter items with valid poster_path to ensure high visual quality
  const validItems = items.filter((item) => item.poster_path);

  return (
    <div className="card-slider-wrapper">
      <button className="slider-arrow left-arrow" onClick={scrollLeft} aria-label="Scroll Left">
        <i className="bi bi-chevron-left"></i>
      </button>
      
      <div className="card-slider-container" ref={sliderRef}>
        {validItems.map((item) => (
          <div className="card-slider-item" key={item.id}>
            <Card movie={{ ...item, media_type: type }} />
          </div>
        ))}
      </div>

      <button className="slider-arrow right-arrow" onClick={scrollRight} aria-label="Scroll Right">
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
};
