import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './ProductRegister.css';  // 추가된 CSS 파일
import axios from 'axios';  // axios 추가

const ProductRegister = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productURL, setProductURL] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    // 간단한 입력 검증
    if (!productName || !productDescription || !productPrice || !productURL || !image) {
      setError("모든 필드를 채워주세요.");
      return;
    }

    if (productPrice <= 0) {
      setError("가격은 0보다 커야 합니다.");
      return;
    }
    setLoading(true);
    setError(""); // 에러 메시지 초기화

    // FormData 객체 생성
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productDescription', productDescription);
    formData.append('productPrice', productPrice);
    formData.append('productURL', productURL);
    formData.append('image', image);  // 이미지 파일 추가

    try {
      // 상품 등록 API 호출
      const response = await axios.post('http://localhost:3000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 성공 시 처리
      if (response.data.success) {
        console.log("Product registered:", response.data);
        // 제출 후 입력값 초기화
        setProductName("");
        setProductDescription("");
        setProductPrice("");
        setProductURL("");
        setImage(null);
      } else {
        setError("상품 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error registering product:", error);
      setError("상품 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles[0]);
    },
    accept: 'image/*',
    multiple: false,
  });

  return (
    <div className="product-register">
      <h2>상품 등록</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="image-upload">
          <label>이미지 등록</label>
          <div className="image-dropzone" {...getRootProps()}>
            {image ? (
              <img src={URL.createObjectURL(image)} alt="미리보기" className="image-preview" />
            ) : (
              <div className="image-placeholder">
                <span className="image-icon">📷</span>
              </div>
            )}
            <input {...getInputProps()} />
          </div>
        </div>

        <div className="form-field">
          <label>이름</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="2~15자 이내여야 합니다."
          />
        </div>

        <div className="form-field">
          <label>가격</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            placeholder="숫자만 입력 가능합니다."
          />
        </div>
        <div className="form-field">
          <label>제품 설명</label>
          <input
            type="text"
            value={productDescription}
            onChange={(e) =>setProductDescription(e.target.value)}
            placeholder="상세정보."
          />
        </div>
        <div className="form-field">
          <label>판매 링크</label>
          <input
            type="text"
            value={productURL}
            onChange={(e) => setProductURL(e.target.value)}
            placeholder="URL을 입력해 주세요."
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "상품 등록 중..." : "상품 등록"}
        </button>
      </form>
    </div>
  );
};

export default ProductRegister;