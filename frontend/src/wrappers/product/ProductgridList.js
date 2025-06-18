import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import ProductGridListSingle from "../../components/product/ProductGridListSingle";

const ProductGridList = ({
  products,
  spaceBottomClass
}) => {
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  
  return (
    <Fragment>
      {products?.map(product => {
        return (
          <div className="col-xl-4 col-sm-6" key={product.productId}>
            <ProductGridListSingle
              spaceBottomClass={spaceBottomClass}
              product={product}
              currency={currency}
              cartItem={
                cartItems.find(cartItem => cartItem.productId === product.productId)
              }
              wishlistItem={
                wishlistItems.find(
                  wishlistItem => wishlistItem.productId === product.productId
                )
              }
              compareItem={
                compareItems.find(
                  compareItem => compareItem.productId === product.productId
                )
              }
            />
          </div>
        );
      })}
    </Fragment>
  );
};

ProductGridList.propTypes = {
  products: PropTypes.array,
  spaceBottomClass: PropTypes.string,
};

export default ProductGridList;

