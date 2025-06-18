import { Fragment, useState,useEffect } from "react"; 
import { useLocation } from "react-router-dom"; 
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axios from "axios";

const MyAccount = () => {
  let { pathname } = useLocation();
  const id =localStorage.getItem("UserID"); // URL에서 상품 ID 가져오기
  const [Account, setAccount] = useState(null); // 사용자 데이터 상태
  const [Accounts, setAccounts] = useState(null); // 사용자 목록
  const [isDisabled, setIsDisabled] = useState(true); // 편집 모드 여부
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    email: "",
    telephone: "",
  });
  //유저 정보 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://ceprj.gachon.ac.kr:60011/api/account/${id}`);
        console.log("API Account:", response.data);

        if (response.data?.data) {
          const AccountData = response.data.data;
          setAccount(AccountData);
          setUserInfo({
            nickname:AccountData.nick,
            email: AccountData.email,
            telephone: AccountData.telephone,
          });
        } else {
          
        }
      } catch (err) {
        console.error("Error fetching product:", err);
       
      } finally {

      }
    };

    fetchProduct();
  }, [id]);
  //유저 정보+제품 글 정보
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://ceprj.gachon.ac.kr:60011/api/account-detail/${id}`);
        console.log("API Account:", response.data);

        if (response.data?.data) {
          const AccountData = response.data.data;
          setAccount(AccountData);
          setUserInfo({
            nickname:AccountData.nick,
            email: AccountData.email,
            telephone: AccountData.telephone,
          });
        } else {
          
        }
      } catch (err) {
        console.error("Error fetching product:", err);
       
      } finally {

      }
    };

    fetchProduct();
  }, [id]);

  //사용자 목록 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://ceprj.gachon.ac.kr:60011/api/accounts`);
        console.log("API Accounts:", response.data);

        if (response.data?.data) {
          const AccountData = response.data.data;
          setAccounts(AccountData);
        
        } else {
          
        }
      } catch (err) {
        console.error("Error fetching product:", err);
       
      } finally {

      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };
  const toggleEdit = () => {
    setIsDisabled(!isDisabled); // 비활성화/활성화 상태 토글
  };
  return (
    <Fragment>
      <SEO
        titleTemplate="My Account"
        description="My Account page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "My Account", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        
        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ms-auto me-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>1 .</span> Edit your account information{" "}
                      </Accordion.Header>
                      <Accordion.Body>
                      <div className="myaccount-info-wrapper">
                        <div className="account-info-wrapper">
                          <h4>My Account Information</h4>
                          <h5>Your Personal Details</h5>
                        </div>
                        <div className="row">
                          {/* Nickname */}
                          <div className="col-lg-12 col-md-12">
                            <div className="billing-info">
                              <label>Nick Name</label>
                              <input
                                type="text"
                                name="nickname"
                                value={userInfo.nickname}
                                onChange={handleInputChange}
                                disabled={isDisabled} // 비활성화 상태 제어
                              />
                            </div>
                          </div>
                          {/* Email */}
                          <div className="col-lg-12 col-md-12">
                            <div className="billing-info">
                              <label>Email Address</label>
                              <input
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleInputChange}
                                disabled={isDisabled} // 비활성화 상태 제어
                              />
                            </div>
                          </div>
                          {/* Telephone */}
                          <div className="col-lg-12 col-md-12">
                            <div className="billing-info">
                              <label>Telephone</label>
                              <input
                                type="text"
                                name="telephone"
                                value={userInfo.telephone}
                                onChange={handleInputChange}
                                disabled={isDisabled} // 비활성화 상태 제어
                              />
                            </div>
                          </div>
                        </div>
                        <div className="billing-back-btn">
                          <div className="billing-btn">
                            <button type="button" onClick={toggleEdit}>
                              {isDisabled ? "Edit" : "Save"}
                            </button>
                          </div>
                        </div>
                      </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                          <span>2 .</span> Change your password
                      </Accordion.Header>
                      <Accordion.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Change Password</h4>
                              <h5>Your Password</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password</label>
                                  <input type="password" />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password Confirm</label>
                                  <input type="password" />
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit">Continue</button>
                              </div>
                            </div>
                          </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    {/*사용하지 않는 아이템
                    <Accordion.Item eventKey="2" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                          <span>3 .</span> Modify your address book entries
                      </Accordion.Header>
                      <Accordion.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Address Book Entries</h4>
                            </div>
                            <div className="entries-wrapper">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-info text-center">
                                    <p>John Doe</p>
                                    <p>Paul Park </p>
                                    <p>Lorem ipsum dolor set amet</p>
                                    <p>NYC</p>
                                    <p>New York</p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-edit-delete text-center">
                                    <button className="edit">Edit</button>
                                    <button>Delete</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit">Continue</button>
                              </div>
                            </div>
                          </div>
                      </Accordion.Body>
                    </Accordion.Item>
                    */}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default MyAccount;
