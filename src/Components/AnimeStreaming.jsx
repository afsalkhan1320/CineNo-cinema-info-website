const AnimeStreaming = () => {
  const streamingSites = [
    {
      name: "AnimeSalt",
      description: "Watch anime with multiple language options.",
      url: "https://animesalt.to/",
    },
    {
      name: "Gogoanime",
      description: "Popular anime streaming site with English subbed and dubbed options.",
      url: "https://gogoanime.or.at/",
    },
    {
      name: "Crunchyroll",
      description: "Official anime streaming platform with subtitles and dubs.",
      url: "https://www.crunchyroll.com/",
    },
  ];

  return (
    <section className="anime-streaming-section mt-5">

      <h2 className="details-section-title">
        🎬 Watch Anime Online
      </h2>

      <p className="text-secondary">
        Find anime with different language and subtitle options.
      </p>

      <div className="row g-4 mt-2">

        {streamingSites.map((site) => (
          <div className="col-6 col-lg-4" key={site.name}>

            <div className="anime-streaming-card">

              <div className="anime-streaming-icon">
                🎥
              </div>

              <h4>
                {site.name}
              </h4>

              <p>
                {site.description}
              </p>

              <a
                href={site.url}
                target="_blank"
                rel="noreferrer"
                className="anime-watch-button"
              >
                Watch Anime →
              </a>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
};

export default AnimeStreaming;