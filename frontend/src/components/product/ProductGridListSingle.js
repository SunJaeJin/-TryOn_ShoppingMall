import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import ProductModal from "./ProductModal";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";

const ProductGridListSingle = ({
  product,
  currency,
  cartItem,
  wishlistItem,
  compareItem,
  spaceBottomClass
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [quantity, setQuantity] = useState(cartItem?.quantity || 0); // 수량 상태 추가
  const discountedPrice = getDiscountPrice(product.productPrice, product.discount);
  const finalProductPrice = +(product.productPrice * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = discountedPrice
    ? +(discountedPrice * currency.currencyRate).toFixed(2)
    : null;
  const dispatch = useDispatch();

  // Extract image URLs
  const imageUrlBase = "http://ceprj.gachon.ac.kr:60011";
  const mainImage = product.images?.[0]?.imageUrl
    ? `${imageUrlBase}${product.images[0].imageUrl}`
    : `${imageUrlBase}/uploads/154_shop1_5203481733412560581.jpg`;

  const hoverImage = product.images?.[1]?.imageUrl
    ? `${imageUrlBase}${product.images[1].imageUrl}`
    : null;

  // 수량 증가 함수
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
    dispatch(addToCart({ ...product, quantity: quantity + 1 }));
  };

  // 수량 감소 함수
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      dispatch(addToCart({ ...product, quantity: quantity - 1 }));
    }
  };

  return (
    <Fragment>
      <div className={clsx("product-wrap", spaceBottomClass)}>
        <div className="product-img">
          <Link to={process.env.PUBLIC_URL + "/product/" + product.productId}>
            <img className="default-img" src={mainImage} alt={product.productName} />
            {hoverImage && <img className="hover-img" src={hoverImage} alt={product.productName} />}
          </Link>
          {(product.discount || product.new) && (
            <div className="product-img-badges">
              {product.discount && <span className="pink">-{product.discount}%</span>}
              {product.new && <span className="purple">New</span>}
            </div>
          )}

          <div className="product-action">
            <div className="pro-same-action pro-wishlist">
              <button
                className={wishlistItem !== undefined ? "active" : ""}
                disabled={wishlistItem !== undefined}
                title={wishlistItem ? "Added to wishlist" : "Add to wishlist"}
                onClick={() => dispatch(addToWishlist(product))}
              >
                <i className="pe-7s-like" />
              </button>
            </div>
            <div className="pro-same-action pro-cart">
              {product.affiliateLink ? (
                <a href={product.affiliateLink} rel="noopener noreferrer" target="_blank">
                  buy now
                </a>
              ) : product.variations && product.variations.length > 0 ? (
                <Link to={`${process.env.PUBLIC_URL}/product/${product.productId}`}>
                  Select Option
                </Link>
              ) : product.productStock > 0 ? (
                <div className="quantity-controls">
                  <button onClick={decreaseQuantity} disabled={quantity <= 1}>
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={increaseQuantity} disabled={quantity >= product.productStock}>
                    +
                  </button>
                </div>
              ) : (
                <button disabled className="active">
                  Out of Stock
                </button>
              )}
            </div>
            <div className="pro-same-action pro-quickview">
              <button onClick={() => setModalShow(true)} title="Quick View">
                <i className="pe-7s-look" />
              </button>
            </div>
          </div>
        </div>
        <div className="product-content text-center">
          <h3>
            <Link to={process.env.PUBLIC_URL + "/product/" + product.productId}>
              {product.productName}
            </Link>
          </h3>
          {product.rating && product.rating > 0 && (
            <div className="product-rating">
              <Rating ratingValue={product.rating} />
            </div>
          )}
          <div className="product-price">
            {finalDiscountedPrice ? (
              <Fragment>
                <span>{currency.currencySymbol + finalDiscountedPrice}</span>
                <span className="old">{currency.currencySymbol + finalProductPrice}</span>
              </Fragment>
            ) : (
              <span>{currency.currencySymbol + finalProductPrice}</span>
            )}
          </div>
        </div>
      </div>
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        discountedPrice={discountedPrice}
        finalProductPrice={finalProductPrice}
        finalDiscountedPrice={finalDiscountedPrice}
        wishlistItem={wishlistItem}
        compareItem={compareItem}
      />
    </Fragment>
  );
};

ProductGridListSingle.propTypes = {
  cartItem: PropTypes.shape({
    quantity: PropTypes.number, // quantity 속성 추가
  }),
  compareItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  product: PropTypes.shape({
    productId: PropTypes.number.isRequired,
    productName: PropTypes.string.isRequired,
    productPrice: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        imageUrl: PropTypes.string.isRequired,
      })
    ),
    productStock: PropTypes.number.isRequired, // 재고 관리 추가
  }),
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.shape({}),
};

export default ProductGridListSingle;
