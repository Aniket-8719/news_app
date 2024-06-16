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

    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=c21c3c8083444bd4a7a2d183e3e43770&page=${page}&pageSize=${props.pageSize}`;

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
    }
  };

  useEffect(() => {
    document.title = `${capitalize(props.category)} - NewsMonkey`
    if (page === 1) {
      updateNews();
    }
  }, [page, props.pageSize, props.country, props.category, props.setProgress]);

  // const handlePrevClick = async () => {
  //   setPage(page - 1);
  //   updateNews();
  // };

  // const handleNextClick = async () => {
  //   setPage(page + 1);
  //   updateNews();
  // };

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=c21c3c8083444bd4a7a2d183e3e43770&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page + 1);
    let data = await fetch(url);
    let parsedData = await data.json();
    console.log(parsedData);
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };

  return (
    <div className="container my-3">
        {!loading && (
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Loading />}
        >
          <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>
            NewsMonkey - Top <span className="text-success">{capitalize(props.category)}</span> Headlines
          </h1>
          <div className="container overflow-hidden">
            <div className="row">
              {articles.map((element) => {
                return (
                  <div key={element.url} className="col-md-4 row-cols-md-5">
                    <Newsitem
                      title={element.title ? element.title : ""}
                      description={element.description ? element.description : ""}
                      imgUrl={element.urlToImage ? element.urlToImage : "https://c.ndtvimg.com/2023-09/b9pbn91_sunil-chhetri_625x300_19_September_23.png?im=FaceCrop,algorithm=dnn,width=806,height=605"}
                      newsUrl={element.url}
                      author={!element.author ? "Unknown" : element.author}
                      date={element.publishedAt}
                      channel={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 5,
  category: "general",
};

News.propTypes = {
  name: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  setProgress: PropTypes.func,
  country: PropTypes.string.isRequired,
};

export default News;
