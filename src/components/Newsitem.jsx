import React from "react";

const Newsitem = (props) => {
  let { title, description, imgUrl, newsUrl,author, date, channel } = props;
  return (
    <>
      <div className="card my-5" style={{ width: "25rem"}}>
        <img src={imgUrl} style={{ width: "25rem", height: "14rem" }} className="card-img-top" alt="..." />
        <span className="position-absolute top-0  translate-middle badge rounded-pill bg-danger" style={{left: "90%", zIndex: '1'} } >
        {channel}
  </span>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <p className="card-text "><small className="text-success">by {author} on {new Date(date).toGMTString()}</small></p>
          <a href={newsUrl} target="_blank" className="btn btn-sm btn-primary">
            Read more
          </a> 
        </div>
      </div>
    </>
  );
};

export default Newsitem;