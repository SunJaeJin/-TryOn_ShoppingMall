import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const BlogPost = ({ AIimageUrl, TopimageUrl, BottomimageUrl, TopproductId, BottomproductId, PostOwner, LikeCount, postId }) => {
  const authorName = "userId";
  // 좋아요 상태 관리
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false); // 현재 좋아요 상태
  const [alertMessage, setalertMessage] = useState(""); // 현재 좋아요 상태
  const [likeCount, setLikeCount] = useState(0); // 좋아요 수
  // 좋아요 버튼 클릭 핸들러
  useEffect(async() => {
    try {
      const response = await axios.get('http://ceprj.gachon.ac.kr:60011/api/like-status', {
        params: {
          userId: localStorage.getItem("UserID"),
          AIModelId: postId,
        },headers: {
          "Cache-Control": "no-cache", // 캐싱 방지
        }
      });

      if (response.data.success) {
        console.log(response.data.isLiked);
        setLiked(response.data.isLiked); // 좋아요 상태 업데이트
      } else {
        console.error('서버 응답 오류:', response.data.message);
      }
    } catch (error) {
      console.error('좋아요 상태 가져오기 오류:', error);
    } finally {
    } // 컴포넌트가 렌더링될 때 좋아요 상태 가져오기
  }, []);
    const toggleLike = async () => {
    if(!localStorage.getItem("isLoggedIn")){
      alert("먼저 로그인 해주세요")
    }
    try {
      const response = await axios.post('http://ceprj.gachon.ac.kr:60011/api/like', {
        userId: localStorage.getItem("UserID"),
        AIModelId: postId,
      });

      if (response.data.success) {
        const updatedResponse = await axios.get(`http://ceprj.gachon.ac.kr:60011/api/community/${postId}`);
        const updatedPost = JSON.parse(updatedResponse.data.data); // 최신 포스트 데이터 가져오기
        setLikeCount(updatedPost.LikeCount); // LikeCount를 업데이트
        setLiked(!liked); // 좋아요 상태 반전
      //   setLiked(!liked);
      //   // 좋아요 수 업데이트
      //   if (liked) {
      //     setLikeCount(likeCount - 1); // 좋아요 취소 시 감소
      //   } else {
      //     setLikeCount(likeCount + 1); // 좋아요 추가 시 증가
      //   }
      // } else {
      //   console.error('서버 응답 오류:', response.data.message);
      }
    } catch (error) {
      console.error('좋아요 요청 오류:', error);
    }
  };
  
   // 삭제 버튼 핸들러
   const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const postId = window.location.pathname.split("/").pop(); // URL에서 ID 추출
        const response = await fetch(
          `http://ceprj.gachon.ac.kr:60011/api/community/${postId}`,
          {
            method: "DELETE",
          }
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


  return (
    <Fragment>
      {/* Blog 제목 섹션 */}
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "24px",
          color: "#222",
          marginBottom: "30px",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        by {authorName}
      </div>
      
      {/* Blog 메인 이미지 섹션 */}
      <div className="blog-details-top">
        <div className="blog-details-img">
          <img src={AIimageUrl} alt="Main AI Model" />
        </div>
        <div className="blog-details-content">
          <div className="blog-meta-2"
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "18px",
              marginTop: "15px",
              color: "#333",
              lineHeight: "1.5",
            }}
          >
            Featured Items
          </div>
        </div>
      </div>

      {/* Blog 본문 이미지 섹션 */}
      <div className="dec-img-wrapper"
        style={{ maxWidth: "800px", margin: "30px auto" }}
      >
        <div className="row">
          <div className="col-md-6">
            <div className="dec-img"
              style={{ marginBottom: "20px" }}
            >
              {/*상의 제품 링크*/}
              <a href={"/product/"+TopproductId}>
              <img src={TopimageUrl} alt="Top Product" />
              </a>
            </div>
          </div>
          <div className="col-md-6">
            <div className="dec-img"
              style={{ marginBottom: "20px" }}
            >
              {/*하의 제품 링크*/}
              <a href={"/product/"+BottomproductId}>
              <img src={BottomimageUrl} alt="Bottom Product" />
              </a>
            </div>
          </div>
        </div>
        {/* <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in reprehendrit
          in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p> */}
      </div>

      {/* 좋아요 버튼 섹션 */}
      <div
        className="like-button-section"
        style={{ textAlign: "center", marginTop: "10px", marginBottom: "15px" }}
      >
        <button
          onClick={toggleLike}
          style={{
            backgroundColor: liked ? "pink" : "#f5f5f5", // 조건에 따라 색상 변경
            color: "#333", // 좋아요 상태에서 텍스트 색상 변경
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease",

          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = liked ? "#ffb6c1" : "#e9e9e9"; // 마우스 오버 시 색상 변경
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = liked ? "pink" : "#f5f5f5"; // 마우스 아웃 시 복원
          }}  >
          <i className="fa fa-heart" style={{ backgroundColor: liked ? "pink" : "#f5f5f5",marginRight: "5px" }}></i>
          {liked ? 'Unlike' : 'Like'}
          {likeCount+LikeCount > 0 && `(${likeCount+LikeCount})`}
        </button>
        {alertMessage && (
          <p style={{ color: "red", marginTop: "10px" }}>{alertMessage}</p>
        )}
      </div>

      {/* 삭제 버튼 섹션 */}
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        {/*Post의 소유자 Id와 사용자Id가 같을경우만 보여줌 */}
        {(localStorage.getItem("UserID")==PostOwner||localStorage.getItem('isAdmin'))&&(
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
          Delete Post
        </button>
          )}
      </div>

      {/* 이전/다음 포스트 섹션 */}
      <div className="next-previous-post">
        <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
          {" "}
          <i className="fa fa-angle-left" /> prev post
        </Link>
        <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
          next post <i className="fa fa-angle-right" />
        </Link>
      </div>
    </Fragment>
  );
};

export default BlogPost;
