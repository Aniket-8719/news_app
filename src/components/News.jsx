import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import Newsitem from "./Newsitem";
import Loading from "./Loading";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // Mediastack uses offset for pagination
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);

  const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const updateNews = async () => {
    if (props.setProgress) props.setProgress(10);
    const apiKey = import.meta.env.VITE_NEWS_API_KEY; // Fetch API key from .env
    const url = `https://api.mediastack.com/v1/news?access_key=${apiKey}&countries=${props.country}&categories=${props.category}&limit=${props.pageSize}&offset=${page}`;
    setLoading(true);
    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles(parsedData.data); // Mediastack returns articles inside "data"
      setTotalResults(parsedData.pagination.total); // Total articles available
      setLoading(false);
      if (props.setProgress) props.setProgress(100);
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Failed to fetch news. Please try again later.");
      if (props.setProgress) props.setProgress(100);
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = `${capitalize(props.category)} - NewsMonkey`;
    updateNews();
  }, [props.category, props.pageSize, props.country, page]);

  const fetchMoreData = async () => {
    setPage(prevPage => prevPage + props.pageSize); // Increment offset by page size
    const apiKey = import.meta.env.VITE_NEWS_API_KEY; // Fetch API key from .env
    const url = `https://api.mediastack.com/v1/news?access_key=${apiKey}&countries=${props.country}&categories=${props.category}&limit=${props.pageSize}&offset=${page + props.pageSize}`;
    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles(prevArticles => prevArticles.concat(parsedData.data));
      setTotalResults(parsedData.pagination.total);
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
  };

  return (
    <div className="container my-3">
      <h1 className="text-center" style={{ margin: "35px 0px", marginTop: "90px" }}>
        NewsMonkey - Top <span className="text-success">{capitalize(props.category)}</span> Headlines
      </h1>

      {loading && <Loading />}
      {error && (
        <div className="alert alert-danger">
          {error}
          <button onClick={updateNews} className="btn btn-warning">Retry</button>
        </div>
      )}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Loading />}
        endMessage={<p style={{ textAlign: "center" }}>No more articles to load </p>}
      >
        <div className="container overflow-hidden">
          <div className="row">
            {articles.map((element) => (
              <div key={element.url} className="col-md-4">
                <Newsitem
                  title={element.title || ""}
                  description={element.description || ""}
                  imgUrl={element.image || "default_image_url_here"} // Mediastack provides 'image'
                  newsUrl={element.url}
                  author={element.author || "Unknown"}
                  date={element.published_at}
                  channel={element.source}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

// PropTypes for type-checking
News.defaultProps = {
  pageSize: 5,
  category: "general",
};

News.propTypes = {
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setProgress: PropTypes.func,
  country: PropTypes.string.isRequired,
};

export default News;
