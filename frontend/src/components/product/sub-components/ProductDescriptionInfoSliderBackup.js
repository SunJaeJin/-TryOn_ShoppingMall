import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProductCartQuantity } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";
import axios from 'axios';

const login = async (event) => {
  event.preventDefault();

  // 제출할 데이터 객체 생성
  const userData = {
    email: userEmail,
    password: userPassword,
  };

  try {
    // API POST 요청
    console.log('userData:', userData);
    const response = await axios.post('http://ceprj.gachon.ac.kr:60011/auth/login', userData);
    // 응답 처리
    // 예를 들어, 성공 메시지나 리디렉션 추가 가능
    console.log("Server Response:", response.data);
    console.log("Server Response:", response.data.userid);
    if(response.data.success){
    localStorage.setItem('UserID', response.data.userid);
    localStorage.setItem('UserEmail', userEmail);
    //const userEmail2 = localStorage.getItem("UserEmail");
    localStorage.setItem('isLoggedIn', true);
    navigate('/')
    }else{
      setloginErrorMessage(response.data.message); // 에러 메시지 설정
    }
  } catch (error) {
    if (error.response) {
      // 서버가 응답했지만 2xx 범위가 아닌 상태 코드
      console.error("Error message:", error.response.data.message); // 서버에서 보낸 메시지
      setloginErrorMessage(error.response.data.message); // 상태에 저장하여 화면에 표시
    } else {
      // 네트워크 오류 등 서버에서 응답하지 않음
      console.error("Network error:", error.message);
      setloginErrorMessage("A network error occurred.");
    }
    // 에러 처리, 예: 에러 메시지 표시
  }
};
const ProductDescriptionInfoSlider = ({
  product,
  discountedPrice,
  currency,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems,
  wishlistItem,
  compareItem,
}) => {
  const dispatch = useDispatch();
  const [selectedProductColor, setSelectedProductColor] = useState(
    product?.variations ? product.variations[0]?.color : ""
  );
  const [selectedProductSize, setSelectedProductSize] = useState(
    product?.variations ? product.variations[0]?.sizes[0]?.name : ""
  );
  const [productStock, setProductStock] = useState(
    product?.variations ? product.variations[0]?.sizes[0]?.stock : product?.stock
  );
  const [quantityCount, setQuantityCount] = useState(1);

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  return (
    <div className="product-details-content pro-details-slider-content">
      <h2>{product?.productName || "Product Name Unavailable"}</h2>
      <div className="product-details-price justify-content-center">
        {discountedPrice !== null ? (
          <Fragment>
            <span>{currency.currencySymbol + finalDiscountedPrice}</span>{" "}
            <span className="old">
              {currency.currencySymbol + finalProductPrice}
            </span>
          </Fragment>
        ) : (
          <span>{currency.currencySymbol + finalProductPrice}</span>
        )}
      </div>
      {product?.rating && product.rating > 0 && (
        <div className="pro-details-rating-wrap justify-content-center">
          <div className="pro-details-rating mr-0">
            <Rating ratingValue={product.rating} />
          </div>
        </div>
      )}
      <div className="pro-details-list">
        <p>{product?.productDescription || "No description available"}</p>
      </div>
      {product?.variations && (
        <div className="pro-details-size-color justify-content-center">
          {/* Color Selection */}
          <div className="pro-details-color-wrap">
            <span>Color</span>
            <div className="pro-details-color-content">
              {product.variations.map((variation, key) => (
                <label
                  className={`pro-details-color-content--single ${variation.color}`}
                  key={key}
                >
                  <input
                    type="radio"
                    value={variation.color}
                    name="product-color"
                    checked={variation.color === selectedProductColor}
                    onChange={() => {
                      setSelectedProductColor(variation.color);
                      setSelectedProductSize(variation.sizes[0]?.name);
                      setProductStock(variation.sizes[0]?.stock || 0);
                      setQuantityCount(1);
                    }}
                  />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
          </div>
          {/* Size Selection */}
          <div className="pro-details-size">
            <span>Size</span>
            <div className="pro-details-size-content">
              {product.variations
                .filter((v) => v.color === selectedProductColor)
                .flatMap((v) => v.sizes)
                .map((singleSize, key) => (
                  <label className="pro-details-size-content--single" key={key}>
                    <input
                      type="radio"
                      value={singleSize.name}
                      checked={singleSize.name === selectedProductSize}
                      onChange={() => {
                        setSelectedProductSize(singleSize.name);
                        setProductStock(singleSize.stock || 0);
                        setQuantityCount(1);
                      }}
                    />
                    <span className="size-name">{singleSize.name}</span>
                  </label>
                ))}
            </div>
          </div>
        </div>
      )}
      <div className="pro-details-quality justify-content-center">
        <div className="cart-plus-minus">
          <button
            onClick={() =>
              setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
            }
            className="dec qtybutton"
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
            onClick={() =>
              setQuantityCount(
                quantityCount < productStock - productCartQty
                  ? quantityCount + 1
                  : quantityCount
              )
            }
            className="inc qtybutton"
          >
            +
          </button>
        </div>
        <div className="pro-details-cart btn-hover">
          {productStock && productStock > 0 ? (
            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    ...product,
                    quantity: quantityCount,
                    selectedProductColor,
                    selectedProductSize,
                  })
                )
              }
              disabled={productCartQty >= productStock}
            >
              Add To Cart
            </button>
          ) : (
            <button disabled>Out of Stock</button>
          )}
        </div>
      </div>
      {/* Category Rendering */}
      <div className="pro-details-meta justify-content-center">
        <span>Categories :</span>
        <ul>
          {Array.isArray(product?.tags) ? (
            product.tags.map((tag, index) => (
              <li key={index}>
                <Link to={`/shop-grid-standard?tag=${tag.name}`}>{tag.name}</Link>
              </li>
            ))
          ) : (
            <li>{product?.category || "No categories available"}</li>
          )}
        </ul>
      </div>
    </div>
  );
};

ProductDescriptionInfoSlider.propTypes = {
  product: PropTypes.object,
  discountedPrice: PropTypes.number,
  currency: PropTypes.object,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  cartItems: PropTypes.array,
  wishlistItem: PropTypes.object,
  compareItem: PropTypes.object,
};

export default ProductDescriptionInfoSlider;
