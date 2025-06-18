import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [users, setUsers] = useState([]); // 회원 목록
  const [selectedUser, setSelectedUser] = useState(null); // 선택된 회원
  const [userProducts, setUserProducts] = useState([]); // 회원의 상품 목록
  const [userPosts, setUserPosts] = useState([]); // 회원의 포스트 목록
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // 전체 회원 목록 불러오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://ceprj.gachon.ac.kr:60011/api/accounts");
        if (response.data?.data) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 특정 회원의 상세 정보 불러오기
  const handleUserClick = async (userId) => {
    try {
      setLoading(true);
      setSelectedUser(userId);

      // 회원의 상품 불러오기
      const productResponse = await axios.get(
        `http://ceprj.gachon.ac.kr:60011/api/user_products/${userId}`
      );
      if (productResponse.data?.data) {
        setUserProducts(JSON.parse(productResponse.data.data));
      }

      
      // 회원의 포스트 불러오기
      const postResponse = await axios.get(
        `http://ceprj.gachon.ac.kr:60011/api/user_posts/${userId}`
      );
      if (postResponse.data?.data) {
        console.log(JSON.parse(postResponse.data.data));
        setUserPosts(JSON.parse(postResponse.data.data));
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  // 회원 삭제
  const handleDeleteUser = async (userId) => {
    try {
      const confirmDelete = window.confirm("해당 회원을 삭제하시겠습니까?");
      if (!confirmDelete) return;

      await axios.delete(`http://ceprj.gachon.ac.kr:60011/auth/accounts/${userId}`);
      alert("회원이 삭제되었습니다.");
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  //제품 삭제
  const productDelete = async (productid) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const productId = productid;
        const response = await axios.delete(
          `http://ceprj.gachon.ac.kr:60011/api/product/${productId}`
        );
        if (response.data.success) {
          alert("Post deleted successfully.");
          navigate("/blog-no-sidebar"); // 커뮤니티 페이지로 리다이렉트
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

  //포스트 삭제
  const postDelete = async (postid) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const postId = postid;
        const response = await axios.delete(
          `http://ceprj.gachon.ac.kr:60011/api/community/${postId}`
        );
        if (response.data.success) {
          alert("Post deleted successfully.");
          navigate("/blog-no-sidebar"); // 커뮤니티 페이지로 리다이렉트
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
  const styles = {
    tableContainer: {
      overflowX: "auto",
      maxWidth: "100%", 
      border: "1px solid #ddd", 
      marginBottom: "20px",
      whiteSpace: "nowrap",
    },
    table: {
      width: "100%",
      tableLayout: "fixed",
      borderCollapse: "collapse", 
    },
    tableHeader: {
      backgroundColor: "#f8f8f8", 
      color: "#333", 
      fontWeight: "bold", 
      padding: "10px",
    },
    tableCell: {
      padding: "10px",
      borderBottom: "1px solid #ddd", 
      whiteSpace: "nowrap",
      textOverflow: "ellipsis", // 텍스트가 길 경우 줄임표 추가
      overflow: "hidden",
      maxWidth: "200px", // 셀 최대 폭 제한
      //height: "200px", // 셀의 고정 높이
    },
    button: {
      marginRight: "10px",
      padding: "5px 10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      cursor: "pointer",
    },
    deleteButton: {
      background: "red",
      color: "white",
      border: "1px solid red",
    },
  };

  return (
    <LayoutOne headerTop="visible">
      <SEO titleTemplate="Admin Page" description="Admin management page" />
      <Breadcrumb
        pages={[
          { label: "Home", path: process.env.PUBLIC_URL + "/" },
          { label: "Admin", path: process.env.PUBLIC_URL + "/admin-page" },
        ]}
      />

      <div
        className="admin-page"
        style={{
          maxWidth: "1200px",
          margin: "0 auto", 
          padding: "20px", 
        }}
      >
        <h2>Admin Page</h2>
        {loading && (
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <span className="spinner-border" role="status" aria-hidden="true"></span>
            <p>로딩 중...</p>
          </div>
        )}

        {/* 회원 목록 */}
        <div className="user-list" style={{ marginBottom: "30px" }}>
          <h3>User List</h3>
          <div style={{ overflowX: "auto", marginBottom: "20px" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>ID</th>
                  <th style={styles.tableHeader}>Nickname</th>
                  <th style={styles.tableHeader}>Email</th>
                  <th style={styles.tableHeader}>관리</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={styles.tableCell}>{user.id}</td>
                    <td style={styles.tableCell}>{user.nick}</td>
                    <td style={styles.tableCell}>{user.email}</td>
                    <td style={styles.tableCell}>
                      <button
                        onClick={() => handleUserClick(user.id)}
                        style={styles.button}
                      >View Details</button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        style={{ ...styles.button, ...styles.deleteButton }}
                      >Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>

        {/* 회원 상세 정보 */}
        {selectedUser && (
          <Fragment>
            <h3>회원 상세 정보</h3>

            {/* 등록한 상품 */}
            <div className="user-products" style={{ marginBottom: "20px" }}>
              <h4>Registered Products</h4>
              {userProducts.length > 0 ? (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                      <th style={styles.tableHeader}>Product Image</th>
                        <th style={styles.tableHeader}>Product Name</th>
                        <th style={styles.tableHeader}>Price</th>
                        <th style={styles.tableHeader}>Stock</th>
                        <th style={styles.tableHeader}>Registration Date</th>
                        <th style={styles.tableHeader}>Management</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userProducts.map((product) => (
                        <tr 
                        key={product.productId}
                        style={{ cursor: "pointer" }} // 클릭 가능한 UI 표시
                        onClick={() => navigate(`/product/${product.productId}`)} // 네비게이션 동작
                        >
                          <td style={styles.tableCell}>
                          {/* 이미지 추가 */}
                          <img
                            src={product.images[0].imageUrl} // 상품 이미지 URL
                            alt={product.productName} // 대체 텍스트
                            style={{width: "200px", height: "200px", marginRight: "10px", objectFit: "cover" }} // 이미지 스타일
                          />
                          </td>
                          <td style={styles.tableCell}>{product.productName}</td>
                          <td style={styles.tableCell}>{product.productPrice} 원</td>
                          <td style={styles.tableCell}>{product.productStock}</td>
                          <td style={styles.tableCell}>
                            {new Date(product.updatedAt).toLocaleDateString()}
                          
                          </td>
                          <td>
                          <button
                        onClick={() => productDelete(product.productId)}
                        style={{ ...styles.button, ...styles.deleteButton }}
                      >Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ textAlign: "center", color: "#666" }}>
                  No registered products available
                </p>
              )}
            </div>

            {/* 작성한 글 */}
            <div className="user-posts">
              <h4>Written Posts</h4>
              {userPosts.length > 0 ? (
                <div style={styles.tableContainer}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>PostId</th>
                        <th style={styles.tableHeader}>Date</th>
                        <th style={styles.tableHeader}>보기</th>
                        <th style={styles.tableHeader}>Management</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userPosts.map((post) => (
                        <tr key={post.AIModelId}>
                          <td style={styles.tableCell}>
                          {/* 이미지 추가 */}
                          <img
                            src={post.AIimageUrl} // 상품 이미지 URL
                            alt={post.AIModelId} // 대체 텍스트
                            style={{width: "200px", height: "200px", marginRight: "10px", objectFit: "cover" }} // 이미지 스타일
                          />
                          </td>
                          <td style={styles.tableCell}>
                            {new Date(post.updatedAt).toLocaleDateString()}
                          </td>
                          <td style={styles.tableCell}>
                            <Link to={`/blog-details-standard/${post.AIModelId}`}>보기</Link>
                            
                          </td>
                          <td>
                          <button
                        onClick={() => postDelete(post.AIModelId)}
                        style={{ ...styles.button, ...styles.deleteButton }}
                      >Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ textAlign: "center", color: "#666" }}>
                  No written posts available
                </p>
              )}
            </div>
          </Fragment>
        )}
      </div>
    </LayoutOne>
  );
};

export default AdminPage;
