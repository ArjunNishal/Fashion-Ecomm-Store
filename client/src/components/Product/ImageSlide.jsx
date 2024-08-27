import React, { useState } from "react";

const ImageSlide = ({ handlemobsliderchange, index, imageurl }) => {
  const magnifyRef = React.useRef(null);
  const [magnify, setMagnify] = useState(false);
  const [lensStyle, setLensStyle] = useState({});
  const [magnifyStyle, setMagnifyStyle] = useState({});

  const handleMouseEnter = () => {
    setMagnify(true);
  };

  const handleMouseLeave = () => {
    setMagnify(false);
    setLensStyle({});
    setMagnifyStyle({});
  };
  const handleMouseMove = (e, src) => {
    const rect = magnifyRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = Math.round((x / rect.width) * 100);
    const yPercent = Math.abs(Math.round((y / rect.height) * 100));

    const lensSize = 400; // Size of the lens
    const lensX = x - 50;
    const lensY = Math.round(y) - 50;

    console.log(yPercent, "yPercent", y);
    console.log(
      "100 - ",
      Math.round((y / rect.height) * 100),
      " << Math.round((y / rect.height) * 100)",
      Math.abs(Math.round((y / rect.height) * 100)),
      "Math.abs(Math.round((y / rect.height) * 100))"
    );
    // console.log(lensY, "lensY", Math.round(y), e.clientY, rect.top);

    setLensStyle({
      top: `${lensY}px`,
      left: `${lensX}px`,
      width: `100px`,
      height: `100px`,
      backgroundImage: `url(${src})`,
      backgroundPosition: `${xPercent}% ${yPercent}%`,
      backgroundSize: `250%`,
    });

    setMagnifyStyle({
      backgroundImage: `url(${src})`,
      backgroundPosition: `${xPercent}% ${yPercent}%`,
    });
  };
  return (
    <>
      <div
        className="details_image position-relative d-md-block d-none"
        ref={magnifyRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={(e) => handleMouseMove(e, imageurl)}
      >
        <img className="product-active-image" src={imageurl} alt="img" />
        {magnify && (
          <>
            <div className="lens " style={lensStyle}></div>
            <div className="magnify-image " style={magnifyStyle}></div>
          </>
        )}
      </div>
      <div
        className="details_image position-relative d-md-none d-block"
        // ref={magnifyRef}
        onClick={() => handlemobsliderchange(index)}
        data-toggle="modal"
        data-target="#productimages"
      >
        <img className="product-active-image" src={imageurl} alt="img" />
      </div>
    </>
  );
};

export default ImageSlide;
