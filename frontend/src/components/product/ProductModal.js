// 필요한 모듈과 라이브러리 import
import React, { Fragment, useState } from "react"; // React, Fragment, useState import
import PropTypes from "prop-types"; // PropTypes import
import { EffectFade, Thumbs } from "swiper"; // Swiper 모듈
import { Modal } from "react-bootstrap"; // Bootstrap Modal import
import { useDispatch, useSelector } from "react-redux"; // Redux Hooks import
import Rating from "./sub-components/ProductRating"; // Rating 컴포넌트 import
import Swiper, { SwiperSlide } from "../../components/swiper"; // Swiper 컴포넌트 import
import { getProductCartQuantity } from "../../helpers/product"; // Helper function import
import { addToCart } from "../../store/slices/cart-slice"; // Redux 액션 import
import { addToWishlist } from "../../store/slices/wishlist-slice"; // Redux 액션 import
import { addToCompare } from "../../store/slices/compare-slice"; // Redux 액션 import

// ProductModal 컴포넌트 정의
function ProductModal({
  product,
  currency,
  discountedPrice,
  finalProductPrice,
  finalDiscountedPrice,
  show,
  onHide,
  wishlistItem,
  compareItem,
}) {
  const variationExists = product?.variation?.length > 0; // variation이 존재하는지 확인
  const defaultColor = variationExists ? product.variation[0]?.color : ""; // 색상 기본값
  const defaultSize =
    variationExists && product.variation[0]?.size?.length > 0
      ? product.variation[0].size[0]?.name
      : ""; // 크기 기본값
  const defaultStock =
    variationExists && product.variation[0]?.size?.length > 0
      ? product.variation[0].size[0]?.stock
      : product?.stock || 0; // 재고 기본값

  // React Hooks
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedProductColor, setSelectedProductColor] = useState(defaultColor);
  const [selectedProductSize, setSelectedProductSize] = useState(defaultSize);
  const [productStock, setProductStock] = useState(defaultStock);
  const [quantityCount, setQuantityCount] = useState(1);

  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const productCartQty = product
    ? getProductCartQuantity(cartItems, product, selectedProductColor, selectedProductSize)
    : 0;

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

  const onCloseModal = () => {
    setThumbsSwiper(null);
    onHide();
  };

  // 데이터가 없는 경우 기본 메시지 표시
  if (!product) {
    return <div>Product data is missing.</div>;
  }

  return (
    <Modal show={show} onHide={onCloseModal} className="product-quickview-modal-wrapper">
      <Modal.Header closeButton></Modal.Header>

      <div className="modal-body">
        <div className="row">
          <div className="col-md-5 col-sm-12 col-xs-12">
            <div className="product-large-image-wrapper">
              <Swiper options={gallerySwiperParams}>
                {(product.image || []).map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="single-image">
                      <img
                        src={process.env.PUBLIC_URL + img}
                        className="img-fluid"
                        alt="Product"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="product-small-image-wrapper mt-15">
              <Swiper options={thumbnailSwiperParams}>
                {(product.image || []).map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className="single-image">
                      <img
                        src={process.env.PUBLIC_URL + img}
                        className="img-fluid"
                        alt="Thumbnail"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          <div className="col-md-7 col-sm-12 col-xs-12">
            <div className="product-details-content quickview-content">
              <h2>{product.name}</h2>
              <div className="product-details-price">
                {discountedPrice !== null ? (
                  <Fragment>
                    <span>{currency.currencySymbol + finalDiscountedPrice}</span>
                    <span className="old">{currency.currencySymbol + finalProductPrice}</span>
                  </Fragment>
                ) : (
                  <span>{currency.currencySymbol + finalProductPrice}</span>
                )}
              </div>
              {product.rating && product.rating > 0 && (
                <div className="pro-details-rating-wrap">
                  <Rating ratingValue={product.rating} />
                </div>
              )}
              <div className="pro-details-list">
                <p>{product.shortDescription}</p>
              </div>
              {/* 추가 UI */}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// PropTypes 정의
ProductModal.propTypes = {
  currency: PropTypes.shape({
    currencySymbol: PropTypes.string.isRequired,
  }).isRequired,
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  onHide: PropTypes.func.isRequired,
  product: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.array,
    variation: PropTypes.array,
    stock: PropTypes.number,
    shortDescription: PropTypes.string,
  }),
  show: PropTypes.bool.isRequired,
  wishlistItem: PropTypes.object,
  compareItem: PropTypes.object,
};

export default ProductModal;
