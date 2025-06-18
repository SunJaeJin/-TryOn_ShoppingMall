import React, { Fragment } from "react";
import { Link, useLocation } from "react-router-dom"; 
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  let { pathname } = useLocation();
  const navigate = useNavigate();
  //상태 관리: 사용자 입력 값
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [joinerrorMessage, setjoinErrorMessage] = useState(''); // 회원가입 에러 메시지 상태 추가
  const [loginerrorMessage, setloginErrorMessage] = useState(''); // 로그인 에러 메시지 상태 추가

  //폼 제출 처리-로그인
  const login = async (event) => {
    event.preventDefault();

    // 제출할 데이터 객체 생성
    const userData = {
      email: userEmail,
      password: userPassword,
      userName : userName
    };

    try {
      // API POST 요청
      console.log('userData:', userData);
      const response = await axios.post('http://ceprj.gachon.ac.kr:60011/auth/admin-login', userData);
      // 응답 처리
      // 예를 들어, 성공 메시지나 리디렉션 추가 가능
      console.log("Server Response:", response.data);
      console.log("Server Response:", response.data.userid);
      if(response.data.success){
      localStorage.setItem('UserID', response.data.userid);
      //const userEmail2 = localStorage.getItem("UserEmail");
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('isAdmin', true);
      navigate('/')
      }else{
        setloginErrorMessage(response.data.message); // 에러 메시지 설정
      }
    } catch (error) {
      if (error.response) {
        // 서버가 응답했지만 2xx 범위가 아닌 상태 코드
        console.error("Error message:", error.response.data.message); // 서버에서 보낸 메시지
        setloginErrorMessage(error.response.data.message); // 상태에 저장하여 화면에 표시
      } else {
        // 네트워크 오류 등 서버에서 응답하지 않음
        console.error("Network error:", error.message);
        setloginErrorMessage("A network error occurred.");
      }
      // 에러 처리, 예: 에러 메시지 표시
    }
  };


  return (
    <Fragment>
      <SEO
        titleTemplate="Login"
        description="Login page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Login Register", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="admin-login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="admin-login">
                          <h4>Admin Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="admin-login">
                        <div className="login-form-container">
                          <div className="login-register-form">
                            <form form onSubmit={login}>
                            <input
                                type="text"
                                name="user-name"
                                placeholder="Username"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                              />
                              <input
                                type="password"
                                name="user-password"
                                placeholder="Password"
                                value={userPassword}
                                onChange={(e) => setUserPassword(e.target.value)}
                              />
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input type="checkbox" checked/>
                                  <label className="ml-10">Remember me</label>
                                  <Link to={process.env.PUBLIC_URL + "/"}>
                                    Forgot Password?
                                  </Link>
                                </div>
                                {loginerrorMessage && (
                                <div style={{ color: 'red', marginTop: '10px' }}>
                                  {loginerrorMessage}
                                </div>
                              )}
                                <button type="submit">
                                  <span>Login</span>
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </Tab.Pane>

                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default AdminLogin;
