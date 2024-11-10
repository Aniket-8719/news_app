import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Newsitem from "./Newsitem";
import Loading from "./Loading";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updateNews = async () => {
    if (props.setProgress) {
      props.setProgress(10);
    }
    const url = `${import.meta.env.VITE_APP_API_URL}?country=us&category=${props.category}&apiKey=${import.meta.env.VITE_APP_NEWS_API_KEY}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    try {
      let data = await fetch(url);
      if (props.setProgress) {
        props.setProgress(30);
      }
      let parsedData = await data.json();
      if (props.setProgress) {
        props.setProgress(70);
      }

      setArticles(parsedData.articles);
      setTotalResults(parsedData.totalResults);
      setLoading(false);

      if (props.setProgress) {
        props.setProgress(100);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      if (props.setProgress) {
        props.setProgress(100);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = `${capitalize(props.category)} - NewsMonkey`;
    updateNews();
  }, [props.category, props.pageSize, props.country]);

  const fetchMoreData = async () => {
    setPage((prevPage) => prevPage + 1); // Update page first

    const url = `${import.meta.env.VITE_APP_API_URL}?country=us&category=${props.category}&apiKey=${import.meta.env.VITE_APP_NEWS_API_KEY}&page=${page + 1}&pageSize=${props.pageSize}`;

    try {
      let data = await fetch(url);
      let parsedData = await data.json();
      console.log(parsedData); // Check if new data is being fetched properly

      setArticles((prevArticles) => prevArticles.concat(parsedData.articles)); // Concatenate new articles
      setTotalResults(parsedData.totalResults); // Update totalResults to reflect the new total
    } catch (error) {
      console.error("Error fetching more data:", error);
    }
  };

  return (
    <div className="container my-3">
      <h1
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        NewsMonkey - Top{" "}
        <span className="text-success">{capitalize(props.category)}</span>{" "}
        Headlines
      </h1>

      {loading && <Loading />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults} // Ensure it fetches until all results are loaded
        loader={<Loading />}
        endMessage={
          <p style={{ textAlign: "center" }}>No more articles to load</p>
        }
      >
        <div className="container overflow-hidden">
          <div className="row">
            {articles.map((element) => {
              return (
                <div key={element.url} className="col-md-4">
                  <Newsitem
                    title={element.title || ""}
                    description={element.description || ""}
                    imgUrl={
                      element.urlToImage ||
                      "https://c.ndtvimg.com/2023-09/b9pbn91_sunil-chhetri_625x300_19_September_23.png?im=FaceCrop,algorithm=dnn,width=806,height=605"
                    }
                    newsUrl={element.url}
                    author={element.author || "Unknown"}
                    date={element.publishedAt}
                    channel={element.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

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
