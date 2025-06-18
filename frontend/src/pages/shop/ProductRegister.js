import React, { useState, useEffect } from "react";
import "./ProductRegister.css";
import axios from "axios"; // Axios 임포트 추가
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useNavigate } from "react-router-dom";

const ProductRegister = () => {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDiscountedPrice, setProductDiscountedPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState(""); // 상세 설명 상태 추가
  const [productCategory, setProductCategory] = useState("");
  const [productTag, setProductTag] = useState("");
  const [productVariation, setProductVariation] = useState([
    { color: "", size: [{ name: "", stock: 0 }] },
  ]);
  const [affiliateLink, setAffiliateLink] = useState("");
  const [imageFiles, setImageFiles] = useState([null, null]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const userid = localStorage.getItem("UserID");
  const navigate = useNavigate();

  // 로그인 상태 검증
  useEffect(() => {
    const userID = localStorage.getItem("UserID");
    if (!userID) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login-register");
    }
  }, [navigate]);

  const handleImageChange = (index, file) => {
    const newImages = [...imageFiles];
    newImages[index] = file;
    setImageFiles(newImages);
  };

  const handleAddImageSlot = () => {
    setImageFiles([...imageFiles, null]);
  };

  const handleDeleteImage = (index) => {
    const newImages = [...imageFiles];
    newImages.splice(index, 1); // 해당 이미지를 삭제
    setImageFiles(newImages);
  };

  const handleAddVariation = () => {
    setProductVariation([
      ...productVariation,
      { color: "", size: [{ name: "", stock: 0 }] },
    ]);
  };

  const handleSizeChange = (index, sizeIndex, field, value) => {
    const newVariations = [...productVariation];
    newVariations[index].size[sizeIndex][field] = value;
    setProductVariation(newVariations);
  };

  const handleAddSize = (index) => {
    const newVariations = [...productVariation];
    newVariations[index].size.push({ name: "", stock: 0 });
    setProductVariation(newVariations);
  };

  const handleDeleteSize = (index, sizeIndex) => {
    const newVariations = [...productVariation];
    newVariations[index].size.splice(sizeIndex, 1); // 특정 사이즈 삭제
    setProductVariation(newVariations);
  };

  const handleResetForm = () => {
    setProductName("");
    setProductPrice("");
    setProductDiscountedPrice("");
    setProductStock("");
    setShortDescription("");
    setDetailedDescription(""); // 상세 설명 초기화
    setProductCategory("");
    setProductTag("");
    setProductVariation([{ color: "", size: [{ name: "", stock: 0 }] }]);
    setAffiliateLink("");
    setImageFiles([null, null]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !productPrice || !productStock || !detailedDescription) {
      setError("모든 필수 필드를 채워주세요.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("price", productPrice);
    formData.append("discountedPrice", productDiscountedPrice);
    formData.append("stock", productStock);
    formData.append("shortDescription", shortDescription);
    formData.append("detailedDescription", detailedDescription); // 상세 설명 추가
    formData.append("category", productCategory);
    formData.append("tag", productTag.split(",").map((tag) => tag.trim()));
    formData.append("variation", JSON.stringify(productVariation));
    formData.append("affiliateLink", affiliateLink);
    formData.append("userId", userid);
    imageFiles.forEach((file, index) => {
      if (file) {
        formData.append(`imageFiles`, file);
      }
    });

    try {
      const response = await axios.post(
        "http://ceprj.gachon.ac.kr:60011/api/products",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        console.log("상품 등록 성공:", response.data);
        handleResetForm();
        alert("상품 등록 성공");
        navigate("/");
      } else {
        setError("상품 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("상품 등록 중 오류 발생:", error);
      setError("상품 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutOne headerTop="visible">
      <SEO titleTemplate="Product Register" description="Register a new product" />
      <Breadcrumb
        pages={[
          { label: "Home", path: process.env.PUBLIC_URL + "/" },
          { label: "Shop", path: process.env.PUBLIC_URL + "/shop" },
          { label: "Product Register", path: process.env.PUBLIC_URL + "/product-register" },
        ]}
      />

      <div className="product-register">
        <h2>상품 등록</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* 이미지 업로드 */}
          <div className="image-upload">
            <label>이미지 등록</label>
            {imageFiles.map((file, index) => (
              <div key={index} className="image-dropzone">
                {file ? (
                  <>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`미리보기 ${index + 1}`}
                      className="image-preview"
                    />
                    <button
                      type="button"
                      className="delete-image-btn"
                      onClick={() => handleDeleteImage(index)}
                    >
                      X
                    </button>
                  </>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e.target.files[0])}
                  />
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddImageSlot}>
              이미지 추가
            </button>
          </div>

          {/* 상품명 입력 */}
          <div className="form-field">
            <label>상품명</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          {/* 상세 설명 입력 추가 */}
          <div className="form-field">
            <label>상세 설명</label>
            <textarea
              rows="6"
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              placeholder="상세 설명을 입력하세요"
            />
          </div>

          {/* 기타 필드 */}
          <div className="form-field">
            <label>가격</label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>재고</label>
            <input
              type="number"
              value={productStock}
              onChange={(e) => setProductStock(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>카테고리</label>
            <select
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
            >
              <option value="">카테고리를 선택하세요</option>
              <option value="상의">상의</option>
              <option value="하의">하의</option>
            </select>
          </div>

          <div className="form-field">
            <label>태그 (쉼표로 구분)</label>
            <input
              type="text"
              value={productTag}
              onChange={(e) => setProductTag(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label>변형</label>
            {productVariation.map((variation, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="색상"
                  value={variation.color}
                  onChange={(e) => {
                    const newVariations = [...productVariation];
                    newVariations[index].color = e.target.value;
                    setProductVariation(newVariations);
                  }}
                />
                {variation.size.map((size, sizeIndex) => (
                  <div key={sizeIndex} className="size-group">
                    <input
                      type="text"
                      placeholder="사이즈"
                      value={size.name}
                      onChange={(e) =>
                        handleSizeChange(index, sizeIndex, "name", e.target.value)
                      }
                    />
                    <input
                      type="number"
                      placeholder="재고"
                      value={size.stock}
                      onChange={(e) =>
                        handleSizeChange(
                          index,
                          sizeIndex,
                          "stock",
                          e.target.value
                        )
                      }
                    />
                    <button
                      type="button"
                      className="delete-size-btn"
                      onClick={() => handleDeleteSize(index, sizeIndex)}
                    >
                      사이즈 삭제
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => handleAddSize(index)}>
                  사이즈 추가
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddVariation}>
              변형 추가
            </button>
          </div>

          <div className="form-field">
            <label>판매 링크</label>
            <input
              type="text"
              value={affiliateLink}
              onChange={(e) => setAffiliateLink(e.target.value)}
            />
          </div>

          <div className="form-field">
            <button type="button" className="reset-form-btn" onClick={handleResetForm}>
              상품 등록 초기화
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "상품 등록 중..." : "상품 등록"}
          </button>
        </form>
      </div>
    </LayoutOne>
  );
};

export default ProductRegister;
