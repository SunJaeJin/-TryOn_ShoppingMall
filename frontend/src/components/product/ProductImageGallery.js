import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { EffectFade, Thumbs } from "swiper";
import AnotherLightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Swiper, { SwiperSlide } from "../../components/swiper";

const ProductImageGallery = ({ product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [index, setIndex] = useState(-1);

  // 이미지 슬라이드 데이터 생성
  const slides = product.images
    ? product.images.map((img, idx) => ({
        src: `http://ceprj.gachon.ac.kr:60011${img.imageUrl}`,
        key: idx,
      }))
    : [];

  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: true,
    effect: "fade",
    fadeEffect: { crossFade: true },
    thumbs: { swiper: thumbsSwiper },
    modules: [EffectFade, Thumbs],
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: true,
  };

  return (
    <Fragment>
      <div className="product-large-image-wrapper">
        <Swiper options={gallerySwiperParams}>
          {slides.map((slide, idx) => (
            <SwiperSlide key={slide.key}>
              <button
                className="lightgallery-button"
                onClick={() => setIndex(idx)}
              >
                <i className="pe-7s-expand1"></i>
              </button>
              <div className="single-image">
                <img
                  src={slide.src}
                  className="img-fluid"
                  alt={`Product ${idx}`}
                  onError={(e) => 
                    (e.target.src = "http://ceprj.gachon.ac.kr:60011/uploads/default_image.jpg")} // 기본 이미지 설정
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <AnotherLightbox
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slides={slides}
          plugins={[Thumbnails, Zoom, Fullscreen]}
        />
      </div>
      <div className="product-small-image-wrapper mt-15">
        <Swiper options={thumbnailSwiperParams}>
          {slides.map((slide) => (
            <SwiperSlide key={slide.key}>
              <div className="single-image">
                <img
                  src={slide.src}
                  className="img-fluid"
                  alt={`Thumbnail ${slide.key}`}
                  onError={(e) => 
                    (e.target.src = "http://ceprj.gachon.ac.kr:60011/uploads/default_image.jpg")} // 기본 이미지 설정
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Fragment>
  );
};

ProductImageGallery.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductImageGallery;
