const API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;

export const getWatchSources = async (type, id) => {
  console.log("Watchmode key exists:", !!API_KEY);
  console.log("Watchmode type:", type);
  console.log("TMDB ID:", id);

  const watchmodeType = type === "tv" ? "tv" : "movie";

  const url = `https://api.watchmode.com/v1/title/${watchmodeType}-${id}/sources/?apiKey=${API_KEY}&regions=IN`;

  console.log(
    "Watchmode URL:",
    url.replace(API_KEY, "HIDDEN")
  );

  const response = await fetch(url);

  console.log("Watchmode status:", response.status);

  const responseText = await response.text();

  console.log("Watchmode response:", responseText);

  if (!response.ok) {
    throw new Error(`Watchmode error: ${response.status}`);
  }

  return JSON.parse(responseText);
};