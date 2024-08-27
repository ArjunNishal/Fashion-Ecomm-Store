import React, { useState, useEffect } from "react";
import ReviewCardWeb from "./ReviewCardWeb";

const ReviewList = ({
  product,
  decoded,
  setfetchreviews,
  fetchreviews,
  setproduct,
  setshowreviewform,
}) => {
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [OtherReviews, setOtherReviews] = useState([]);
  const [currentChunk, setCurrentChunk] = useState(1);

  useEffect(() => {
    if (product.reviews) {
      const otherReviews = product?.reviews?.filter(
        (review) => review?.user?._id !== decoded?.id
      );
      setOtherReviews(otherReviews);
      const initialReviews = otherReviews?.slice(0, 5);
      setDisplayedReviews(initialReviews);
      setfetchreviews(false);
    }
  }, [product, fetchreviews]);

  const loadMoreReviews = () => {
    const newChunk = currentChunk + 1;
    const additionalReviews = OtherReviews?.slice(
      (newChunk - 1) * 5,
      newChunk * 5
    );
    setDisplayedReviews([...displayedReviews, ...additionalReviews]);
    setCurrentChunk(newChunk);
  };

  const userReviews = product?.reviews?.filter(
    (review) => review?.user?._id === decoded?.id
  );

  const updateproduct = (updated) => {
    setproduct({
      ...product,
      reviews: updated,
    });
  };

  const updaterevForm = (val) => {
    setshowreviewform(val);
  };

  return (
    <div className="product_reviews">
      {userReviews &&
        userReviews.map((rev, index) => (
          <ReviewCardWeb
            setproduct={updateproduct}
            setshowreviewform={updaterevForm}
            rev={rev}
            productId={product._id}
            getproduct={() => {}}
            key={index}
          />
        ))}

      {displayedReviews.map((rev, index) => (
        <ReviewCardWeb
          rev={rev}
          setproduct={updateproduct}
          setshowreviewform={updaterevForm}
          key={index}
          productId={product._id}
          getproduct={() => {}}
        />
      ))}

      {displayedReviews.length !== OtherReviews.length && (
        <div className="text-center">
          <button
            onClick={loadMoreReviews}
            className="custom_btn bg_default_red text-uppercase"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
