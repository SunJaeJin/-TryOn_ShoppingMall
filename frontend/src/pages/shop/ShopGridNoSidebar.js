import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Paginator from "react-hooks-paginator";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import ShopProducts from "../../wrappers/product/ShopProducts";

const ShopGridNoSidebar = () => {
  const [layout, setLayout] = useState("grid three-column"); // 레이아웃 기본값
  const [offset, setOffset] = useState(0); // 페이징 오프셋
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [currentData, setCurrentData] = useState([]); // 현재 페이지 데이터
  const [product3, setProduct3] = useState([]); // 전체 상품 데이터
  const pageLimit = 15; // 한 페이지에 표시할 상품 수
  const { pathname } = useLocation(); // 현재 경로 가져오기

  // 상품 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://ceprj.gachon.ac.kr:60011/api/products");
        let data = response.data.data;

        console.log("API Response Data (raw):", data);

        // JSON 형식 데이터 확인 및 파싱
        if (typeof data === "string") {
          try {
            data = JSON.parse(data);
          } catch (error) {
            console.error("JSON 파싱 실패:", error);
            data = [];
          }
        }

        // 유효한 데이터 필터링 및 이미지 경로 처리
        if (Array.isArray(data)) {
          const validProducts = data.filter(
            (item) => item && item.productName && item.productPrice
          );

          validProducts.forEach((product) => {
            if (product.images && product.images.length > 0) {
              product.images = product.images.map((image) => ({
                ...image,
                imageUrl: image.imageUrl.replace("../frontend/public", ""),
              }));
            }
          });

          console.log("Filtered valid products:", validProducts);
          setProduct3(validProducts); // 유효한 상품 데이터를 상태에 저장
        } else {
          console.error("잘못된 데이터 형식:", data);
          setProduct3([]);
        }
      } catch (error) {
        console.error("상품 데이터를 가져오는 중 오류 발생:", error);
        setProduct3([]);
      }
    };

    fetchProducts();
  }, []);

  // 현재 페이지 데이터 계산
  useEffect(() => {
    const paginatedData = product3.slice(offset, offset + pageLimit);
    console.log("Paginated Data:", paginatedData);
    setCurrentData(paginatedData);
  }, [offset, product3]);

  // 레이아웃 변경 함수
  const getLayout = (newLayout) => {
    setLayout(newLayout);
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Shop Page"
        description="Shop page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Shop", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
              <div className="same-style header-search d-none d-lg-block">
        <div className="search-content" style={{ display: "flex"}}>
          <form /*onSubmit={handleSearch}*/ style={{ display: "flex"}}>
            <input type="text" placeholder="Search" />
            <button className="button-search"style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
            <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div>
                <ShopTopbar
                  getLayout={getLayout}
                  productCount={product3.length}
                  sortedProductCount={currentData.length}
                />
                {/* ShopProducts에 현재 페이지 데이터 전달 */}
                <ShopProducts layout={layout} products={currentData} />
                <div className="pro-pagination-style text-center mt-30">
                  <Paginator
                    totalRecords={product3.length}
                    pageLimit={pageLimit}
                    pageNeighbours={2}
                    setOffset={setOffset}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageContainerClass="mb-0 mt-0"
                    pagePrevText="«"
                    pageNextText="»"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default ShopGridNoSidebar;
