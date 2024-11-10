import React from "react";

const Newsitem = (props) => {
  let { title, description, imgUrl, newsUrl, author, date, channel } = props;
  return (
    <>
      <div className="card my-5" style={{ width: "100%" }}>
        <img 
          src={imgUrl} 
          className="card-img-top img-fluid" 
          alt="..." 
          style={{ objectFit: "cover", height: "14rem" }} // Ensure the image covers the space without distortion
        />
        <span 
          className="position-absolute top-0 translate-middle badge rounded-pill bg-danger" 
          style={{ left: "90%", zIndex: '1' }}
        >
          {channel}
        </span>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <p className="card-text">
            <small className="text-success">by {author} on {new Date(date).toGMTString()}</small>
          </p>
          <a 
            href={newsUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn btn-sm btn-primary"
          >
            Read more
          </a>
        </div>
      </div>
    </>
  );
};

export default Newsitem;
