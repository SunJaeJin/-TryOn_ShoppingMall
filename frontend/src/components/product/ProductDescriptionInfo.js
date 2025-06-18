import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProductCartQuantity } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import { addToCart } from "../../store/slices/cart-slice";
import axios from "axios";




const ProductDescriptionInfo = ({
  product,
  discountedPrice,
  currency,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedProductColor, setSelectedProductColor] = useState(
    product.variations && product.variations.length > 0
      ? product.variations[0].color
      : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product.variations &&
      product.variations.length > 0 &&
      product.variations[0].sizes.length > 0
      ? product.variations[0].sizes[0].name
      : ""
  );
  const [productStock, setProductStock] = useState(
    product.variations &&
      product.variations.length > 0 &&
      product.variations[0].sizes.length > 0
      ? product.variations[0].sizes[0].stock
      : 0
  );
  const [quantityCount, setQuantityCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      if (quantityCount < productStock - productCartQty) {
        setQuantityCount(quantityCount + 1);
      } else {
        alert("재고를 초과할 수 없습니다.");
      }
    } else if (type === "decrement") {
      if (quantityCount > 1) {
        setQuantityCount(quantityCount - 1);
      } else {
        alert("최소 1개 이상의 수량이 필요합니다.");
      }
    }
  };

  const handleAddToCart = async () => {
    if (quantityCount > productStock) {
      setErrorMessage("재고보다 많은 수량을 추가할 수 없습니다.");
      return;
    }
    setLoading(true);
    const Dataform = {
      product: product,
      quantity: quantityCount,
      selectedProductColor: selectedProductColor,
      selectedProductSize: selectedProductSize,
    };
    try {
      const response = await axios.post(
        "http://ceprj.gachon.ac.kr:60011/api/cart",
        Dataform
      );
      if (response.data.success) {
        alert("장바구니에 추가되었습니다.");
      }
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("장바구니 추가 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="product-details-content ml-70">
      <h2>{product.productName || "상품명이 없습니다."}</h2>
      <div className="product-details-price">
        {discountedPrice !== null ? (
          <Fragment>
            <span>{currency.currencySymbol + finalDiscountedPrice}</span>{" "}
            <span className="old">
              {currency.currencySymbol + finalProductPrice}
            </span>
          </Fragment>
        ) : (
          <span>{currency.currencySymbol + finalProductPrice} </span>
        )}
      </div>
      {product.rating && product.rating > 0 ? (
        <div className="pro-details-rating-wrap">
          <div className="pro-details-rating">
            <Rating ratingValue={product.rating} />
          </div>
        </div>
      ) : (
        ""
      )}
      {product.productDescription && (
        <div className="product-description">
          <p>{product.productDescription}</p>
        </div>
      )}

      <div className="pro-details-list">
        <p>{product.shortDescription}</p>
      </div>

      {product.variations ? (
        <div className="pro-details-size-color">
          <div className="pro-details-color-wrap">
            <span>Color</span>
            <div className="pro-details-color-content">
              {product.variations.map((variation, key) => (
                <label
                  key={key}
                  className={`pro-details-color-content--single ${
                    selectedProductColor === variation.color ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    value={variation.color}
                    name="product-color"
                    onChange={() => {
                      setSelectedProductColor(variation.color);
                      setSelectedProductSize(variation.sizes[0].name);
                      setProductStock(variation.sizes[0].stock);
                      setQuantityCount(1);
                    }}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
          </div>
          <div className="pro-details-size">
            <span>Size</span>
            <div className="pro-details-size-content">
              {product.variations.map((variation) =>
                variation.color === selectedProductColor
                  ? variation.sizes.map((size, key) =>
                      size.stock > 0 ? (
                        <label
                          key={key}
                          className={`pro-details-size-content--single ${
                            selectedProductSize === size.name ? "active" : ""
                          }`}
                        >
                          <input
                            type="radio"
                            value={size.name}
                            name="product-size"
                            onChange={() => {
                              setSelectedProductSize(size.name);
                              setProductStock(size.stock);
                              setQuantityCount(1);
                            }}
                          />
                          <span className="size-name">{size.name}</span>
                        </label>
                      ) : null
                    )
                  : null
              )}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="pro-details-quality">
        <div className="cart-plus-minus">
          <button
            onClick={() => handleQuantityChange("decrement")}
            className="dec qtybutton"
            disabled={quantityCount <= 1}
          >
            -
          </button>
          <input
            className="cart-plus-minus-box"
            type="text"
            value={quantityCount}
            readOnly
          />
          <button
            onClick={() => handleQuantityChange("increment")}
            className="inc qtybutton"
            disabled={quantityCount >= productStock}
          >
            +
          </button>
        </div>
        <div className="pro-details-cart btn-hover">
          {productStock && productStock > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={
                loading || quantityCount > productStock || quantityCount <= 0
              }
              className={quantityCount > productStock ? "disabled" : ""}
            >
              {loading ? <span className="spinner"></span> : "Add To Cart"}
            </button>
          ) : (
            <button disabled className="out-of-stock">
              Out of Stock
            </button>
          )}
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

     

      {product.category ? (
        <div className="pro-details-meta">
          <span>Categories :</span>
          <ul>
            <li>
              <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                {product.category}
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        ""
      )}

      {product.tags ? (
        <div className="pro-details-meta">
          <span>Tags :</span>
          <ul>
            {product.tags.map((tag, key) => (
              <li key={key}>
                <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                  {tag.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        ""
      )}

      <div className="pro-details-social">
        <ul>
          <li>
            <a href="#!">
              <i className="fa fa-facebook" />
            </a>
          </li>
          <li>
            <a href="#!">
              <i className="fa fa-dribbble" />
            </a>
          </li>
          <li>
            <a href="#!">
              <i className="fa fa-pinterest-p" />
            </a>
          </li>
          <li>
            <a href="#!">
              <i className="fa fa-twitter" />
            </a>
          </li>
          <li>
            <a href="#!">
              <i className="fa fa-linkedin" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

ProductDescriptionInfo.propTypes = {
  cartItems: PropTypes.array,
  currency: PropTypes.shape({}),
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  product: PropTypes.shape({}),
};

export default ProductDescriptionInfo;
