import PropTypes from "prop-types";
import clsx from "clsx";
import ProductgridList from "./ProductgridList";

const ShopProducts = ({ products, layout }) => {
  // 디버깅: 전달받은 products와 layout을 확인
  console.log("ShopProducts received products:", products);
  console.log("ShopProducts received layout:", layout);

  return (
    <div className="shop-bottom-area mt-35">
      <div className={clsx("row", layout)}>
        {products && products.length > 0 ? (
          <ProductgridList products={products} spaceBottomClass="mb-25" />
        ) : (
          <p>No products available.</p> // 상품이 없는 경우 메시지 표시
        )}
      </div>
    </div>
  );
};

ShopProducts.propTypes = {
  layout: PropTypes.string.isRequired, // layout은 필수
  products: PropTypes.array.isRequired, // products도 필수
};

export default ShopProducts;
