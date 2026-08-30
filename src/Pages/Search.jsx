import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card } from "../Components";
import { useFetch } from "../hooks/useFetch";
import { useScrollRestoration } from "../hooks/useScrollRestoration";

export const Search = ({ apiPath }) => {
  const [searchParams] = useSearchParams();

  const queryTerm = searchParams.get("q") || "";

  const { data: movies=[] } = useFetch(
    apiPath,
    `&query=${encodeURIComponent(queryTerm)}`
  );

  useScrollRestoration(movies.length > 0);

  useEffect(() => {
    document.title = `Search result for ${queryTerm}`;
  }, [queryTerm]);

  return (
    <main className="container py-4">
      {/* PAGE TITLE WITH INTEGRATED BACK ARROW */}
      <h5 className="text-danger py-2 border-bottom mt-4 d-flex align-items-center">
        <Link to="/" className="me-2 back-arrow-title" aria-label="Back to Home">
          <i className="bi bi-arrow-left"></i>
        </Link>
        <span>
          {movies.length === 0
            ? `No result found for ${queryTerm}`
            : `Result for ${queryTerm}`}
        </span>
      </h5>

      <div className="row row-cols-3 g-2 g-md-3 py-2">
        {movies.map((movie) => (
          <Card   key={`${movie.media_type}-${movie.id}`}
            movie={movie} />
        ))}
      </div>
    </main>
  );
};

 
