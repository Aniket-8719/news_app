import React, { useState } from "react";

const Newsitem = ({ title, description, imgUrl, newsUrl, author, date, channel }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleImageLoad = () => {
    setImgLoaded(true); // Set to true when image is fully loaded
  };

  const handleImageError = () => {
    setImgError(true); // Fallback if image fails to load
  };

  // Set a placeholder image if the image fails to load or if no image is provided
  const placeholderImage = "https://via.placeholder.com/150";

  return (
    <div className="card mb-3">
      <img
        src={imgError ? placeholderImage : (imgUrl || placeholderImage)}
        alt={title}
        className={`card-img-top ${imgLoaded ? "opacity-100" : "opacity-50"}`} // Fade in effect when image loads
        loading="lazy" // Native lazy loading for images
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      {!imgLoaded && !imgError && (
        <div className="img-placeholder">
          {/* Placeholder spinner or skeleton loader */}
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>
        <a href={newsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Read more
        </a>
        <p className="card-text"><small className="text-muted">By {author} on {new Date(date).toLocaleDateString()}</small></p>
        <p className="card-text"><small className="text-muted">Source: {channel}</small></p>
      </div>
    </div>
  );
};

export default Newsitem;
