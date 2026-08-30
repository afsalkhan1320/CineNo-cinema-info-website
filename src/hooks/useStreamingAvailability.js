import { useEffect, useState } from "react";
export const useStreamingAvailability = (type, id) => {
  const [streamingOptions, setStreamingOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_STREAMING_API_KEY;

  useEffect(() => {
    const fetchStreamingAvailability = async () => {S
      // Check API key
      if (!apiKey) {
        setError("Streaming API key is missing.");
        return;
      }

      // Check movie / TV ID
      if (!id) {
        setError("Movie or TV ID is missing.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        /*
          TMDB ID format

          Movie:
          movie/123

          TV:
          tv/123
        */

        const tmdbId = `${type}/${id}`;

        const url =
          `https://api.movieofthenight.com/v4/shows/${tmdbId}` +
          `?country=in`;

        console.log("=================================");
        console.log("STREAMING API");
        console.log("=================================");
        console.log("Type:", type);
        console.log("TMDB ID:", id);
        console.log("URL:", url);

        const response = await fetch(url, {
          headers: {
            "X-API-Key": apiKey,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Streaming API Error: ${response.status}`
          );
        }

        const data = await response.json();

        console.log("FULL STREAMING API RESPONSE:");
        console.log(data);

        /*
          Get India streaming options
        */

        const indiaOptions =
          data.streamingOptions?.in || [];

        console.log("INDIA STREAMING OPTIONS:");
        console.log(indiaOptions);

        setStreamingOptions(indiaOptions);
      } catch (err) {
        console.error(
          "STREAMING AVAILABILITY ERROR:",
          err
        );

        setError(err.message);
        setStreamingOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamingAvailability();
  }, [type, id, apiKey]);

  return {
    streamingOptions,
    loading,
    error,
  };
};