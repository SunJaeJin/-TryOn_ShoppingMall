import { Fragment, useState, useEffect } from "react"; 
import { useLocation, useNavigate } from "react-router-dom"; 
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
  const [AccountDetail, setAccountDetail] = useState(null); // 사용자 데이터 상태
  const [isDisabled, setIsDisabled] = useState(true); // 편집 모드 여부
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    email: "",
    telephone: "",
    profileImage:
    "", // 기본 프로필 사진
  });
  const [previewImage, setPreviewImage] = useState(null);//미리보기 이미지
  const [userProducts, setUserProducts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [isEditingImage, setIsEditingImage] = useState(false); // 이미지 편집 모드
  //유저 정보 불러오기
  const navigate = useNavigate();
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
            profileImage: AccountData.imageUrl||"/uploads/usericon.png"
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
        

        if (response.data?.data) {

          const parsedData = JSON.parse(response.data.data);
          console.log("API AccountDetail:", parsedData);
          setAccountDetail(parsedData);
          
        } else {
          
        }
      } catch (err) {
        console.error("Error fetching product:", err);
       
      } finally {

      }
    };

    fetchProduct();
  }, [id]);

  const putUserInfo = async (e) => {
    e.preventDefault();

    // FormData 객체 생성
    const formData = new FormData();
    formData.append("nickname", userInfo.nickname);
    formData.append("email", userInfo.email);
    formData.append("telephone", userInfo.telephone);
    console.log("file: "+userInfo.profileImage);
    formData.append("profileImage", userInfo.profileImage);
    formData.append("userId", localStorage.getItem("UserID"));

    try {
      const response = await axios.put("http://ceprj.gachon.ac.kr:60011/api/userinfo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

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
  const toggleEdit = (e) => {
    if(isDisabled==false){//편집중이었다면
      putUserInfo(e);
    }
    setIsDisabled(!isDisabled); // 비활성화/활성화 상태 토글
    setIsEditingImage(isDisabled); // 이미지 편집 모드 비활성화
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result); // 미리보기 이미지를 업데이트
        setUserInfo({ ...userInfo, profileImage: file }); // 선택한 파일을 상태에 저장
      };
      reader.readAsDataURL(file); // 파일 읽기
    }
  };
  /*안만든 api입니다  AccountDetail에 다 들어있으니 그거 사용해주세요
  // 유저의 등록한 상품 가져오기
  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const response = await axios.get(`http://ceprj.gachon.ac.kr:60011/api/user-products/${id}`);
        setUserProducts(response.data.products || []);
      } catch (err) {
        console.error("Error fetching user products:", err);
      }
    };

    fetchUserProducts();
  }, [id]);

  // 유저의 작성한 글 가져오기
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(`http://ceprj.gachon.ac.kr:60011/api/user-posts/${id}`);
        setUserPosts(response.data.posts || []);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    };

    fetchUserPosts();
  }, [id]);
*/
  const styles = {
    sectionHeader: {
      marginBottom: "15px",
      fontSize: "18px",
      fontWeight: "bold",
    },
    entriesWrapper: {
      marginTop: "20px",
    },
    singleProduct: {
      padding: "10px",
      marginBottom: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      backgroundColor: "#f9f9f9",
    },
    singlePost: {
      padding: "10px",
      marginBottom: "10px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      backgroundColor: "#f1f1f1",
    },
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
                          {/* Left Column */}
                          <div className="col-lg-4 col-md-4">
                            <div className="left-info">
                              <p>프로필 사진</p>
                              {isEditingImage ? (
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  style={{ display: "block", marginBottom: "10px",
                                    }}
                                />
                                {previewImage && (
                                  <img
                                    src={previewImage}
                                    alt="Profile Preview"
                                    className="img-fluid"
                                    
                                  />
                                )}
                              </div>
                            ) : (
                              <img
                                src={
                                  userInfo.profileImage
                                }
                                alt="Profile"
                                className="img-fluid"
                                style={{
                                  cursor: isDisabled ? "default" : "pointer",
                                  border: isEditingImage ? "2px solid #007BFF" : "none",
                                }}
                              />
                            )}
                          </div>
                        </div>
                          {/* Right Column */}
                          <div className="col-lg-8 col-md-8">
                            {/* Nickname */}
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
                            {/* Email */}
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
                            {/* Telephone */}
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
                    <Accordion.Item eventKey="2" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>3 .</span> VIEW YOUR REGISTERED PRODUCTS AND POSTS
                      </Accordion.Header>
                      <Accordion.Body>
                        {/* 등록한 상품 섹션 */}
                        <div className="myaccount-info-wrapper">
                          <div style={styles.sectionHeader}>REGISTERED PRODUCTS</div>
                          <div style={styles.entriesWrapper}>
                            {AccountDetail?.products?.length > 0 ? (
                              AccountDetail.products.map((product) => {
                                const imageUrl = product.images[0]?.imageUrl.startsWith("../frontend/public")
                                  ? `http://ceprj.gachon.ac.kr:60011${product.images[0]?.imageUrl.replace("../frontend/public", "")}`
                                  : product.images[0]?.imageUrl.startsWith("/")
                                    ? `http://ceprj.gachon.ac.kr:60011${product.images[0]?.imageUrl}`
                                    : product.images[0]?.imageUrl;
                                  console.log(`Product ID: ${product.productId}, Image URL: ${imageUrl}`); // 최종 URL 출력
                                return (
                                  <div
                                    key={product.productId}
                                    style={styles.singleProduct}
                                    onClick={() => navigate(`/product/${product.productId}`)} // 상세 페이지 이동
                                  >
                                    <h5>Product Name: {product.productName}</h5>
                                    <p>Price: {product.productPrice} 원</p>
                                    <p>Image:</p>
                                    {product.images?.length > 0 && product.images[0]?.imageUrl ? (
                                      <img
                                        src={imageUrl}
                                        alt={product.productName}
                                        style={{
                                          maxWidth: "200px",
                                          maxHeight: "200px",
                                          borderRadius: "8px",
                                          display: "block",
                                          marginTop: "8px",
                                        }}
                                      />
                                    ) : (
                                      <p>No image available</p>
                                    )}
                                  </div>
                                );
                              })
                            ) : (
                              <p>No registered products found.</p>
                            )}
                          </div>
                        </div>
                        {/* 작성한 글 섹션 */}
                        <div className="myaccount-info-wrapper">
                          <div style={styles.sectionHeader}>REGISTERED POSTS</div>
                          <div style={styles.entriesWrapper}>
                            {AccountDetail?.AIModels?.length > 0 ? (
                              AccountDetail.AIModels.map((post) => (
                                <div key={post.AIModelId} style={styles.singlePost} onClick={() => navigate(`/blog-details-standard/${post.AIModelId}`)}>
                                  <h5>Post ID: {post.AIModelId}</h5>
                                  <p>Top: {post.TopproductName}</p>
                                  <p>Bottom: {post.BottomproductName}</p>
                                  <p>AI Image:{" "}</p>
                                  <img
                                      src={`http://ceprj.gachon.ac.kr:60011${post.AIimageUrl}`}
                                      alt={`AI Post ${post.AIModelId}`}
                                      style={{
                                        maxWidth: "200px",
                                        maxHeight: "200px",
                                        borderRadius: "8px",
                                        display: "block",
                                        marginTop: "8px",
                                      }}
                                    />
                                </div>
                              ))
                            ) : (
                              <p>No registered posts found.</p>
                            )}
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
