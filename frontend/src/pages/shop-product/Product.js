import React, { useState, useEffect, Fragment } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const { id } = useParams(); // URL에서 상품 ID 가져오기
  const { pathname } = useLocation();
  const [product, setProduct] = useState(null); // 상품 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
const navigate = useNavigate();

  // API에서 상품 데이터 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://ceprj.gachon.ac.kr:60011/api/product/${id}`);
        console.log("API Response:", response.data);

        if (response.data?.data) {
          const parsedData = JSON.parse(response.data.data);

          // 기본값 설정
          parsedData.productName = parsedData.productName || "Default Product Name";
          parsedData.productDescription =
            parsedData.productDescription || "이 제품은 최고의 품질과 디자인을 자랑합니다.";

          // 이미지 경로 정적 URL로 변환
          parsedData.images = parsedData.images?.map((img) => ({
            ...img,
            imageUrl: `/uploads/${decodeURIComponent(img.imageUrl.split("/").pop())}`,
          })) || [];

          setProduct(parsedData);
        } else {
          setError("데이터를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("상품 데이터를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 삭제 버튼 핸들러
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const postId = window.location.pathname.split("/").pop(); // URL에서 ID 추출
        const response = await axios.delete(
          `http://ceprj.gachon.ac.kr:60011/api/product/${postId}`
        );
        console.log(response);
        console.log(response.data);
        if (response.data.success) {
          alert("Podcut deleted successfully.");
          navigate("/shop-grid-no-sidebar"); // 커뮤니티 페이지로 리다이렉트
        } else {
          console.error("Failed to delete post:", response.statusText);
          alert("Failed to delete the post. Please try again.");
        }
      } catch (error) {
        console.error("Error while deleting post:", error);
        alert("An error occurred while deleting the post.");
      }
    }
  };

  // 로딩 및 에러 처리
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // 상품 페이지 렌더링
  return (
    <Fragment>
      <SEO
        titleTemplate={product?.productName || "Product"}
        description={product?.productDescription || "Product description"}
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Shop Product", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        
        {product ? (
          <ProductImageDescription
            spaceTopClass="pt-100"
            spaceBottomClass="pb-100"
            product={product}
          />
        ) : (
          <div>No product available</div>
        )}
        <ProductDescriptionTab
          spaceBottomClass="pb-90"
          productFullDesc={product?.productDescription}
        />
         
          {/* 수정 버튼 섹션 */}
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        {/*Post의 소유자 Id와 사용자Id가 같을경우만 보여줌 */}
        {(localStorage.getItem("UserID")==product.UserId||localStorage.getItem('isAdmin'))&&(
        <button
          onClick={()=>navigate(`/shop/product-Modify/${id}`)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#666",
            cursor: "pointer",
            fontSize: "14px",
            textDecoration: "underline",
          }}
        >
          Modify Product
        </button>
          )}
      </div>
        {/* 삭제 버튼 섹션 */}
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        {/*Post의 소유자 Id와 사용자Id가 같을경우만 보여줌 */}
        {(localStorage.getItem("UserID")==product.UserId||localStorage.getItem('isAdmin'))&&(
        <button
          onClick={handleDelete}
          style={{
            backgroundColor: "transparent",
            border: "none",
            color: "#666",
            cursor: "pointer",
            fontSize: "14px",
            textDecoration: "underline",
          }}
        >
          Delete Product
        </button>
          )}
      </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Product;
