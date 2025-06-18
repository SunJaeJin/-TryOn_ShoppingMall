import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";
import MenuCart from "./sub-components/MenuCart";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
/*
const MyComponent = () => {
  

  
};*/
const IconGroup = ({ iconWhiteClass }) => {
  const navigate = useNavigate();
  const [logouterrorMessage, setlogoutErrorMessage] = useState(''); // 로그아웃 에러 메시지 상태 추가
  useEffect(() => {
    // 로컬 스토리지에서 사용자 로그인 정보 확인

    const userID = localStorage.getItem("UserID");
    //console.log("now: "+userEmail);
    if (userID !== null && userID !== "") {
      console.log("setisloginT");
      localStorage.setItem('isLoggedIn', true);
    } else {
      //console.log("No user email found.");
      localStorage.removeItem('isLoggedIn'); // 유효한 email이 없으면 로그아웃 처리 (옵션)
    }
  }, []);
  const loggedInStatus = localStorage.getItem('isLoggedIn');
  const loggedInID = localStorage.getItem('UserID');
  const handleClick = e => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };
  const navigatecart = e => {
    navigate("/cart");
    //e.currentTarget.nextSibling.classList.toggle("active");
  };
  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };
  //로그아웃
  const logout = async () => {
    try {
      // API POST 요청
      const userEmail = localStorage.getItem("UserEmail");
      const response = await axios.post('http://ceprj.gachon.ac.kr:60011/auth/logout', userEmail);
      // 응답 처리
      // 예를 들어, 성공 메시지나 리디렉션 추가 가능
      
      console.log("Server Response:", response.data);
      if(response.data.success){
        //로컬스토리지 제거
        localStorage.removeItem("UserID");
        localStorage.removeItem("UserEmail");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("isAdmin");
        //localStorage.setItem('isLoggedIn', false);
        console.log("User logged out");
        navigate(0)
      }else{
        setlogoutErrorMessage(response.data.message); // 에러 메시지 설정
      }
    } catch (error) {
      if (error.response) {
        // 서버가 응답했지만 2xx 범위가 아닌 상태 코드
        console.error("Error message:", error.response.data.message); // 서버에서 보낸 메시지
        setlogoutErrorMessage(error.response.data.message); // 상태에 저장하여 화면에 표시
      } else {
        // 네트워크 오류 등 서버에서 응답하지 않음
        console.error("Network error:", error.message);
        setlogoutErrorMessage("A network error occurred.");
      }
      // 에러 처리, 예: 에러 메시지 표시
    }
  };
  const { compareItems } = useSelector((state) => state.compare);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <div className={clsx("header-right-wrap", iconWhiteClass)} >
      {/*헤더 검색 버튼 사용안함
      <div className="same-style header-search d-none d-lg-block">
        <button className="search-active" onClick={e => handleClick(e)}>
          <i className="pe-7s-search" />
        </button>
        <div className="search-content">
          <form action="#">
            <input type="text" placeholder="Search" />
            <button className="button-search">
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div>*/}
      <div className="same-style account-setting d-none d-lg-block">
        <button
          className="account-setting-active"
          onClick={e => handleClick(e)}
        >
          <i className="pe-7s-user-female" />
        </button>
        <div className="account-dropdown">
        <ul>
            {/* 로그인 상태
            에 따라 조건부 렌더링 */}
            {/*console.log('loggedInStatus:', loggedInStatus)} {/* 콘솔로 상태 확인 */}
            {/*console.log('loggedID:', loggedInID)} {/* 콘솔로 상태 확인 */}
            {loggedInStatus == false || loggedInStatus == null ? (
              <>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/login-register"}>Login</Link>
                </li>
                <li>
                  <Link to={process.env.PUBLIC_URL + "/login-register"}>Register</Link>
                </li>
              </>
            ) : (
              <>
              <li>
                  <Link onClick={(e) => {
          e.preventDefault(); // 기본 동작 방지
          logout(); // 로그아웃 함수 호출
    }}>Logout</Link>
                </li>
                <li>
                <Link to={process.env.PUBLIC_URL + "/my-account"}>My Account</Link>
              </li>
              </>
            )}
            
          </ul>
        </div>
      </div>
      {/*
      <div className="same-style header-compare">
        <Link to={process.env.PUBLIC_URL + "/compare"}>
          <i className="pe-7s-shuffle" />
          <span className="count-style">
            {compareItems && compareItems.length ? compareItems.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style header-wishlist">
        <Link to={process.env.PUBLIC_URL + "/wishlist"}>
          <i className="pe-7s-like" />
          <span className="count-style">
            {wishlistItems && wishlistItems.length ? wishlistItems.length : 0}
          </span>
        </Link>
      </div>
      */}
      <div className="same-style cart-wrap d-none d-lg-block">
        <button className="icon-cart" onClick={e => navigatecart(e)}>
          <i className="pe-7s-shopbag" />
          
          <span className="count-style">
            {cartItems && cartItems.length ? cartItems.length : 0}
          </span>
    
        </button>
        {/*menu cart*/} 
        <MenuCart />
      </div>
      <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag" />
          {/*
          <span className="count-style">
            {cartItems && cartItems.length ? cartItems.length : 0}
          </span>
          */}
        </Link>
      </div>
      {/*모바일메뉴 구현안됨
      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>*/}
    </div>
  );
};

IconGroup.propTypes = {
  iconWhiteClass: PropTypes.string,
};



export default IconGroup;
