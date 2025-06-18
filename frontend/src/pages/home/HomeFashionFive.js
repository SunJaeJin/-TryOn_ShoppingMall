import React, { Fragment, useState } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const HomeFurnitureFive = () => {
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productPrice: "",
    productURL: "",
    images: [], // 여러 이미지를 저장하기 위한 배열
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { productName, productDescription, productPrice, productURL, images } = formData;

    if (!productName || !productDescription || !productPrice || !productURL || images.length === 0) {
      setError("모든 필드를 채워주세요.");
      return;
    }

    if (productPrice <= 0) {
      setError("가격은 0보다 커야 합니다.");
      return;
    }

    setLoading(true);
    setError("");

    const form = new FormData();
    form.append("productName", productName);
    form.append("productDescription", productDescription);
    form.append("productPrice", productPrice);
    form.append("productURL", productURL);
    images.forEach((image, index) => {
      form.append(`images[${index}]`, image); // 여러 이미지를 FormData에 추가
    });

    try {
      const response = await axios.post("http://localhost:3000/api/products", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        console.log("Product registered:", response.data);
        setFormData({
          productName: "",
          productDescription: "",
          productPrice: "",
          productURL: "",
          images: [],
        });
      } else {
        setError("상품 등록에 실패했습니다.");
      }
    } catch (err) {
      console.error("Error registering product:", err);
      setError("상품 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 드롭존 핸들러
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...acceptedFiles] }));
    },
    accept: "image/*",
    multiple: true, // 여러 이미지를 허용
  });

  // 이미지 미리보기 삭제
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Furniture Home"
        description="Furniture home of flone react minimalist eCommerce template."
      />
      <LayoutOne
        headerContainerClass="container-fluid"
        headerPaddingClass="header-padding-2"
        headerTop="visible"
      >
        {/* 판매자 등록 폼 */}
        <div className="product-register" style={{ marginTop: "50px", marginBottom: "50px" }}>
          <h2>판매자 상품 등록</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="image-upload">
              <label>이미지 등록</label>
              <div className="image-dropzone" {...getRootProps()}>
                {formData.images.length > 0 ? (
                  <div className="image-preview-grid">
                    {formData.images.map((file, index) => (
                      <div key={index} className="image-preview-item">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`미리보기 ${index + 1}`}
                          className="image-preview"
                        />
                        <button
                          type="button"
                          className="remove-image-button"
                          onClick={() => removeImage(index)}
                        >
                          ✖
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="image-placeholder">
                    <span className="image-icon">📷</span>
                    이미지를 드래그하거나 클릭하세요.
                  </div>
                )}
                <input {...getInputProps()} />
              </div>
            </div>

            <div className="form-field">
              <label>상품 이름</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="2~15자 이내로 입력해주세요."
              />
            </div>

            <div className="form-field">
              <label>가격 (₩)</label>
              <input
                type="number"
                name="productPrice"
                value={formData.productPrice}
                onChange={handleChange}
                placeholder="숫자만 입력 가능합니다."
              />
            </div>

            <div className="form-field">
              <label>제품 설명</label>
              <input
                type="text"
                name="productDescription"
                value={formData.productDescription}
                onChange={handleChange}
                placeholder="상세 정보를 입력해주세요."
              />
            </div>

            <div className="form-field">
              <label>판매 링크</label>
              <input
                type="text"
                name="productURL"
                value={formData.productURL}
                onChange={handleChange}
                placeholder="URL을 입력해주세요."
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "등록 중..." : "상품 등록"}
            </button>
          </form>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFurnitureFive;
