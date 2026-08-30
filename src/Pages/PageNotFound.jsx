import React from "react";
import { Link } from "react-router-dom";

export const PageNotFound = () => {
  return (
    <div className="pagenotfound-wrapper d-flex align-items-center justify-content-center">
      <div className="pagenotfound-card text-center">
        <div className="pagenotfound-glow"></div>
        <div className="pagenotfound-content">
          <h1 className="pagenotfound-code">4<span className="glow-cyan">0</span>4</h1>
          <h2 className="pagenotfound-title">🎬 Cut from the Script!</h2>
          <p className="pagenotfound-text">
            This scene ended up on the cutting room floor, or the link you followed doesn't exist in our timeline.
            Let's get you back to the main feature!
          </p>
          <div className="mt-4">
            <Link to="/" className="pagenotfound-btn">
              <i className="bi bi-house-door-fill me-2"></i> Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
