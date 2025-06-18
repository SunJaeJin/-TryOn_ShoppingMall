import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import clsx from "clsx";
import { getDiscountPrice } from "../../helpers/product";
import ProductImageGallery from "../../components/product/ProductImageGallery";
import ProductDescriptionInfo from "../../components/product/ProductDescriptionInfo";
import ProductImageGallerySideThumb from "../../components/product/ProductImageGallerySideThumb";
import ProductImageFixed from "../../components/product/ProductImageFixed";

const ProductImageDescription = ({ spaceTopClass, spaceBottomClass, galleryType, product }) => {
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  const wishlistItem = wishlistItems.find(item => item.id === product.productId);
  const compareItem = compareItems.find(item => item.id === product.productId);

  // 상품 가격 계산 및 기본값 설정
  const productPrice = parseFloat(product.productPrice) || 0; // 기본값 0 설정
  const discountedPrice = getDiscountPrice(productPrice, product.discount || 0); // 할인율 계산
  const currencyRate = currency?.currencyRate || 1; // 기본값 1 설정
  const finalProductPrice = +(productPrice * currencyRate).toFixed(2);
  const finalDiscountedPrice = +(discountedPrice * currencyRate).toFixed(2);

  return (
    <div className={clsx("shop-area", spaceTopClass, spaceBottomClass)}>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            {/* Product Image Gallery */}
            {galleryType === "leftThumb" ? (
              <ProductImageGallerySideThumb
                product={product}
                thumbPosition="left"
              />
            ) : galleryType === "rightThumb" ? (
              <ProductImageGallerySideThumb product={product} />
            ) : galleryType === "fixedImage" ? (
              <ProductImageFixed product={product} />
            ) : (
              <ProductImageGallery product={product} />
            )}
          </div>
          <div className="col-lg-6 col-md-6">
            {/* Product Description Info */}
            <ProductDescriptionInfo
              product={product}
              discountedPrice={discountedPrice}
              currency={currency}
              finalDiscountedPrice={finalDiscountedPrice}
              finalProductPrice={finalProductPrice}
              cartItems={cartItems}
              wishlistItem={wishlistItem}
              compareItem={compareItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ProductImageDescription.propTypes = {
  galleryType: PropTypes.string,
  product: PropTypes.shape({
    productId: PropTypes.number,
    productName: PropTypes.string,
    productPrice: PropTypes.string,
    discount: PropTypes.number,
    images: PropTypes.array,
  }),
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
};

export default ProductImageDescription;
