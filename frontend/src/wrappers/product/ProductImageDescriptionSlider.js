import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";

const ProductDescriptionInfoSlider = ({ product }) => {
  const currency = useSelector((state) => state.currency);

  const discountedPrice = getDiscountPrice(product?.productPrice, product?.discount);
  const finalProductPrice = +(product?.productPrice * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = discountedPrice
    ? +(discountedPrice * currency.currencyRate).toFixed(2)
    : null;

  return (
    <div className="product-description-info">
      <h1>{product?.productName || "No Product Name"}</h1>
      <div className="price">
        {finalDiscountedPrice ? (
          <>
            <span>{currency.currencySymbol + finalDiscountedPrice}</span>
            <span className="old">
              {currency.currencySymbol + finalProductPrice}
            </span>
          </>
        ) : (
          <span>{currency.currencySymbol + finalProductPrice}</span>
        )}
      </div>
      <div className="product-categories">
        {/* category 처리 */}
        {Array.isArray(product?.category) ? (
          product.category.map((cat, index) => (
            <span key={index} className="badge badge-info">
              {cat}
            </span>
          ))
        ) : product?.category ? (
          <span className="badge badge-info">{product.category}</span>
        ) : (
          <span>No categories available</span>
        )}
      </div>
    </div>
  );
};

ProductDescriptionInfoSlider.propTypes = {
  product: PropTypes.shape({
    productName: PropTypes.string,
    productPrice: PropTypes.string,
    discount: PropTypes.number,
    category: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  }).isRequired,
};

export default ProductDescriptionInfoSlider;
