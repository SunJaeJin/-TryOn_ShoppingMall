import PropTypes from "prop-types";

import { setActiveLayout } from "../../helpers/product";

const ShopTopAction = ({
  getLayout,
  getFilterSortParams,
  productCount,
  sortedProductCount
}) => {
  const handleSearch = () => {
    console.log('검색어: 테스트');

    // 여기서 원하는 함수를 호출하거나 API 요청을 수행하세요.
  };
  return (
    <div className="shop-top-bar mb-35">
      <div className="select-shoing-wrap">
        <div className="shop-select">
          <select
            onChange={e => getFilterSortParams("filterSort", e.target.value)}
          >
            <option value="default">Default</option>
            <option value="priceHighToLow">Price - High to Low</option>
            <option value="priceLowToHigh">Price - Low to High</option>
          </select>
        </div>
        <p>
          Showing {sortedProductCount} of {productCount} result
        </p>
      </div>
      {/* 
      <div className="shop-tab">
        <button
          onClick={e => {
            getLayout("grid two-column");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-th-large" />
        </button>
        <button
          onClick={e => {
            getLayout("grid three-column");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-th" />
        </button>
        <button
          onClick={e => {
            getLayout("list");
            setActiveLayout(e);
          }}
        >
          <i className="fa fa-list-ul" />
        </button>
      </div>
       */}
    </div>
  );
};

ShopTopAction.propTypes = {
  getFilterSortParams: PropTypes.func,
  getLayout: PropTypes.func,
  productCount: PropTypes.number,
  sortedProductCount: PropTypes.number
};

export default ShopTopAction;
