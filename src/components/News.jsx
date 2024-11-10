import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import Newsitem from "./Newsitem";
import Loading from "./Loading";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);

  const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const updateNews = async () => {
    if (props.setProgress) props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${props.category}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
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
    setPage(prevPage => prevPage + 1); // Increment page
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=${props.category}&apiKey=${import.meta.env.VITE_NEWS_API_KEY}&page=${page + 1}&pageSize=${props.pageSize}`;
    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles(prevArticles => prevArticles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults);
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
                  imgUrl={element.urlToImage || "default_image_url_here"}
                  newsUrl={element.url}
                  author={element.author || "Unknown"}
                  date={element.publishedAt}
                  channel={element.source.name}
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
