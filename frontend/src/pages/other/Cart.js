import { Fragment, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation} from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import {
  addToCart,
  decreaseQuantity,
  deleteFromCart,
  deleteAllFromCart,
} from "../../store/slices/cart-slice";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // JSON 데이터를 저장할 state
  const [tops, setTops] = useState([]);
  const [bottoms, setBottoms] = useState([]);
  const [selectedTop, setSelectedTop] = useState("");
  const [selectedTopId, setSelectedTopId] = useState("");
  const [selectedBottom, setSelectedBottom] = useState("");
  const [selectedBottomId, setSelectedBottomId] = useState("");
  const [topImage, setTopImage] = useState(null);
  const [bottomImage, setBottomImage] = useState(null);
  const [tryOnImage, setTryOnImage] = useState(null);
  const [cartTotalPrice, setCartTotalPrice] = useState(0); // 총 가격 상태
  const dispatch = useDispatch();
  let { pathname } = useLocation();
  const userid = localStorage.getItem("UserID"); //로그인 id불러오기
  const [isLoading, setIsLoading] = useState(false);//AI로딩 상태
  const [buttonText, setButtonText] = useState("Try On with AI");//AI 실행버튼 텍스트

//로그인 상태검증 
const navigate = useNavigate();
const userID = localStorage.getItem("UserID");
useEffect(() => {
  const userID = localStorage.getItem("UserID");
  if (!userID) {
    alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
    navigate("/login-register"); // React Router를 사용한 리디렉션
  }
}, [navigate]);

  
//AI이미지 생성
  const  AIImageCreate = async () => {
    // 제출할 데이터 객체 생성
    const AIData = {
      selectedTopId: selectedTopId,
      selectedTop: selectedTop,
      topImage: topImage,
      selectedBottomId: selectedBottomId,
      selectedBottom: selectedBottom,
      bottomImage: bottomImage,
      UserId: localStorage.getItem('UserID'),
    };

    try {
      // API POST 요청
      setIsLoading(true);
      setButtonText("AI Generating..");
      const response = await axios.post('http://ceprj.gachon.ac.kr:60011/api/AICreate', AIData);
      console.log(response.data);
      // 응답 처리
      if(response.data.success){
        // console.log(response.data);
        const aiImageUrl = `http://ceprj.gachon.ac.kr:60011${response.data.data}`;
        setTryOnImage(aiImageUrl); // 상태 업데이트
        console.log("AI Image URL Set:", aiImageUrl);
      }else{
        
      }
      // 예를 들어, 성공 메시지나 리디렉션 추가 가능
      
    } catch (error) { // 에러 메시지 설정
      if (error.response) {
        // 서버가 응답했지만 2xx 범위가 아닌 상태 코드
        console.error("Error message:", error.response.data.message); // 서버에서 보낸 메시지
      } else {
        // 네트워크 오류 등 서버에서 응답하지 않음
        console.error("Network error:", error.message);
      }
    } finally {
      setIsLoading(false);
      setButtonText("Try On with AI");
    }
  };

  //AIModel 공개 변경
  const PutCommunity = async (CartId, putstock) => {
    updateCartQuantity(CartId, putstock);
    const putData = {
      UserId: userid,
    };
    try {
      const response = await axios.put(`http://ceprj.gachon.ac.kr:60011/api/PutCommunity`,putData);
      //let data = response.data.success;
      console.log("Full API Response:", response);
      if(response.data.success){
        alert("AI모델이 커뮤니티에 공개로 설정되었습니다.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  //장바구니 아이템 삭제
  const DeleteCartItem = async (cartId) => {
    try {
      const response = await axios.delete( `http://ceprj.gachon.ac.kr:60011/api/cart?CartId=${cartId}`);
      let data = response.data.success;
      if(data){
        navigate(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  //장바구니 삭제
  const DeleteCartItems = async (UserId) => {
    try {
      const response = await axios.delete( `http://ceprj.gachon.ac.kr:60011/api/carts?UserId=${UserId}`);
      let data = response.data.success;
      if(data){
        navigate(0);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  //장바구니 수량 변경
  const PutCartItem = async (CartId, putstock) => {
    if(putstock<1){
      return
    }
    updateCartQuantity(CartId, putstock);
    const putData = {
      CartId: CartId,
      quantity: putstock,
    };
    try {
      const response = await axios.put(`http://ceprj.gachon.ac.kr:60011/api/cart`, putData);
      //let data = response.data.success;
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  // 수량 업데이트 함수
  const updateCartQuantity = (CartId, newQuantity) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item.CartId === CartId
          ? { ...item, selectstock: Math.max(newQuantity, 0) } // 최소값 0
          : item
      )
    );
  };
  //장바구니 목록 불러오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://ceprj.gachon.ac.kr:60011/api/carts/"+userID);
        let data = response.data.data;
        setCartItems(data);
        
        console.log(data);
      } catch (error) {
        console.error("Error fetching products:", error);

      }
    };

    fetchProducts();
  }, []);
  
  // 가상 데이터 가져오기 (API 호출을 가정)
  

  // 상의와 하의 필터링
  useEffect(() => {
    setTops(cartItems.filter((item) => item.category === "상의"));
    setBottoms(cartItems.filter((item) => item.category === "하의"));
  }, [cartItems]);

  const currency = useSelector((state) => state.currency);

  // 총 가격 업데이트
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      const price = parseFloat(item.productPrice) || 0;
      const quantity = item.selectstock || 1;
      return acc + price * quantity;
    }, 0);
    setCartTotalPrice(total);
  }, [cartItems]);
 
  return (
    <Fragment>
      <SEO
        titleTemplate="Cart"
        description="Cart page of flone react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Cart", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <Fragment>
                <h3 className="cart-page-title">Your cart items</h3>
                <div className="row">
                  <div className="col-12">
                    <div className="table-content table-responsive cart-table-content">
                      <table>
                        <thead>
                          <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Unit Price</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                            <th>action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map((cartItem, key) => (
                            <tr key={key}>
                              <td className="product-thumbnail">
                                <img
                                  className="img-fluid"
                                  src={cartItem.imageUrl}
                                  alt=""
                                />
                              </td>
                              <td className="product-name">{cartItem.productName}</td>
                              <td className="product-price-cart">
                                {cartItem.productPrice} 원
                              </td>
                              <td className="product-quantity">
                                <div className="cart-plus-minus">
                                  <button
                                    className="dec qtybutton"
                                    onClick={() =>
                                      PutCartItem(cartItem.CartId, cartItem.selectstock-1)
                                    }
                                  >
                                    -
                                  </button>
                                  <input
                                    className="cart-plus-minus-box"
                                    type="text"
                                    value={cartItem.selectstock}
                                    readOnly
                                  />
                                  <button
                                    className="inc qtybutton"
                                    onClick={() =>
                                      PutCartItem(cartItem.CartId ,cartItem.selectstock+1)
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="product-subtotal">
                                {(
                                  parseFloat(cartItem.productPrice) *
                                  cartItem.selectstock
                                ).toFixed(2)}
                              </td>
                              <td className="product-remove">
                                <button
                                  onClick={() =>
                                    // dispatch(deleteFromCart(cartItem.productId))
                                    DeleteCartItem(cartItem.CartId)
                                  }
                                >
                                  X
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="cart-shiping-update-wrapper">
                      <div className="cart-shiping-update">
                        <Link
                          to={process.env.PUBLIC_URL + "/shop-grid-no-sidebar"}
                        >
                          Continue Shopping
                        </Link>
                      </div>
                      <div className="cart-clear">
                        <button onClick={() => 
                          // dispatch(deleteAllFromCart())
                          DeleteCartItems(localStorage.getItem("UserID"))
                          }>
                          Clear Shopping Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Try-On Section */}
                <div
                  style={{
                    marginTop: "20px",
                    marginBottom: "40px",
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "8px",
                    textAlign: "center", // 전체 섹션 가운데 정렬
                  }}
                >
                  <h4 style={{ marginBottom: "20px" }}>AI Try-On</h4>

                  {/* Top and Bottom Selection */}
                  <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
                    {/* Top Selection */}
                    <div>
                      <label>Select a Top:</label>
                      <select
                        onChange={(e) => {
                          const selected = tops.find(
                            (item) => item.productId === parseInt(e.target.value)
                          );
                          setSelectedTop(selected?.productName || "");
                          setTopImage(selected?.imageUrl || "");
                          setSelectedTopId(selected?.productId || "");
                        }}
                        style={{
                          marginTop: "10px",
                          padding: "5px",
                          borderRadius: "4px",
                          textAlign: "center",
                          textAlignLast: "center",
                          appearance: "none",
                        }}
                      >
                        <option value="">-- Select a Top --</option>
                        {tops.map((top) => (
                          <option key={top.productId} value={top.productId}>
                            {top.productName}
                          </option>
                        ))}
                      </select>
                      {topImage && (
                        <img
                          src={topImage}
                          alt="Selected Top"
                          style={{
                            width: "100%",
                            maxWidth: "150px",
                            maxHeight: "150px",
                            marginTop: "10px",
                            borderRadius: "8px",
                            objectFit: "contain",
                            border: "1px solid #ddd", // 이미지 테두리
                          }}
                        />
                      )}
                    </div>

                    {/* Bottom Selection */}
                    <div>
                      <label>Select a Bottom:</label>
                      <select
                        onChange={(e) => {
                          const selected = bottoms.find(
                            (item) =>
                              item.productId === parseInt(e.target.value)
                          );
                          setSelectedBottom(selected?.productName || "");
                          setSelectedBottomId(selected?.productId || "");
                          setBottomImage(selected?.imageUrl || "");
                        }}
                        style={{
                          marginTop: "10px",
                          padding: "5px",
                          borderRadius: "4px",
                          textAlign: "center",
                          textAlignLast: "center",
                          appearance: "none",
                        }}
                      >
                        <option value="">-- Select a Bottom --</option>
                        {bottoms.map((bottom) => (
                          <option key={bottom.productId} value={bottom.productId}>
                            {bottom.productName}
                          </option>
                        ))}
                      </select>
                      {bottomImage && (
                        <img
                          src={bottomImage}
                          alt="Selected Bottom"
                          style={{
                            width: "100%",
                            maxWidth: "150px",
                            maxHeight: "150px",
                            marginTop: "10px",
                            borderRadius: "8px",
                            objectFit: "contain",
                            border: "1px solid #ddd",
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* AI Try-On Button */}
                  <button
                    onClick={
                      () => AIImageCreate()
                    } // Simulate Try-On
                    disabled={isLoading}//로딩 중일 때 버튼 비활성화
                    style={{
                      padding: "10px 20px",
                      backgroundColor: isLoading ? "#6c757d" : "#007BFF",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      textAlign: "center",
                      marginBottom: "20px",
                    }}
                  >
                    {buttonText}
                  </button>

                  {/* AI Result */}
                  {tryOnImage && (
                    <div style={{ marginTop: "20px" }}>
                      <img
                        src={tryOnImage}
                        alt="AI Result"
                        style={{
                          width: "100%",
                          maxWidth: "300px",
                          maxHeight: "300px",
                          height: "auto",
                          borderRadius: "8px",
                          objectFit: "contain",
                          border: "1px solid #ddd",
                        }}
                      />

                      {/* Buttons */}
                      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
                        {/* Share Button */}
                        <button
                          onClick={() =>PutCommunity()}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Share to Community
                        </button>

                        {/* Regenerate Button */}
                        <button
                          onClick={
                            () => AIImageCreate()
                          } // Simulate Try-On
                          style={{
                            padding: "10px 20px",
                            backgroundColor: "#ffc107",
                            color: "black",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Regenerate Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="cart-tax">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Estimate Shipping And Tax
                        </h4>
                      </div>
                      <div className="tax-wrapper">
                        <p>
                          Enter your destination to get a shipping estimate.
                        </p>
                        <div className="tax-select-wrapper">
                          <div className="tax-select">
                            <label>* Country</label>
                            <select className="email s-email s-wid">
                              <option>Bangladesh</option>
                              <option>Albania</option>
                              <option>Åland Islands</option>
                              <option>Afghanistan</option>
                              <option>Belgium</option>
                            </select>
                          </div>
                          <div className="tax-select">
                            <label>* Region / State</label>
                            <select className="email s-email s-wid">
                              <option>Bangladesh</option>
                              <option>Albania</option>
                              <option>Åland Islands</option>
                              <option>Afghanistan</option>
                              <option>Belgium</option>
                            </select>
                          </div>
                          <div className="tax-select">
                            <label>* Zip/Postal Code</label>
                            <input type="text" />
                          </div>
                          <button className="cart-btn-2" type="submit">
                            Get A Quote
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-6">
                    <div className="discount-code-wrapper">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gray">
                          Use Coupon Code
                        </h4>
                      </div>
                      <div className="discount-code">
                        <p>Enter your coupon code if you have one.</p>
                        <form>
                          <input type="text" required name="name" />
                          <button className="cart-btn-2" type="submit">
                            Apply Coupon
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-12">
                    <div className="grand-totall">
                      <div className="title-wrap">
                        <h4 className="cart-bottom-title section-bg-gary-cart">
                          Cart Total
                        </h4>
                      </div>
                      <h5>
                        Total products{" "}
                        <span>
                          {/* {currency.currencySymbol + cartTotalPrice.toFixed(2)} */}
                          {`${cartTotalPrice.toLocaleString()} 원`}
                        </span>
                      </h5>

                      <h4 className="grand-totall-title">
                        Grand Total{" "}
                        <span>
                          {/* {currency.currencySymbol + cartTotalPrice.toFixed(2)} */}
                          {`${cartTotalPrice.toLocaleString()} 원`}
                        </span>
                      </h4>
                      <Link to={process.env.PUBLIC_URL + "/checkout"}>
                        Proceed to Checkout
                      </Link>
                    </div>
                  </div>
                </div>
              </Fragment>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cart"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop-grid-no-sidebar"}>
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Cart;
