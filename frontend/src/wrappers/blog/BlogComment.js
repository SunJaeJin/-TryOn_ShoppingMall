import React, { Fragment, useState, useEffect } from "react";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";

const BlogComment = ({ UserID, Post }) => {
  const [commentText, setCommentText] = useState(""); //입력 텍스트
  const [comments, setComments] = useState([]);

  const navigate = useNavigate();

  // 초기 로드: Post에서 댓글 데이터 가져오기
  useEffect(() => {
    if (Post && Post.Comments) {
      setComments(Post.Comments);
    }
  }, [Post]);

  //댓글등록
  const postComment = async (e) => {
    e.preventDefault();
    if (!commentText) {
      return;
    }
    let formData = {
      User: UserID,
      Post: Post,
      Text: commentText,
    };
    try {
      const response = await axios.post(
        "http://ceprj.gachon.ac.kr:60011/api/Comment",
        formData);
        
      if (response.data.success) {
        // console.log("댓글 등록 성공:", response.data);
        //페이지 새로고침
        navigate(0);
        
        const newComment = {
          CommentId: response.data.comment.CommentId, // API에서 반환된 댓글 ID
          UserName: response.data.comment.UserName || "Anonymous", // 유저 이름
          Text: response.data.comment.Text, // 등록된 댓글 텍스트
          createdAt: new Date().toISOString(), // 현재 시간
          Recomments: [],
        };
        setComments((prevComments) => [...prevComments, newComment]);
        setCommentText("");
        
      } else {

      }
    } catch (error) {
      console.error("댓글 등록 중 오류 발생:", error);

    } finally {

    }
  };

  return (
    <Fragment>
      <div className="blog-comment-wrapper mt-55">
        <h4 className="blog-dec-title">comments : {comments.length}</h4>
        {comments.map((comment) => (
          <div
            className="single-comment-wrapper mt-35"
            key={comment.CommentId}
          >
            <div className="blog-comment-img">
              <img
                src={
                  `${process.env.PUBLIC_URL}/assets/img/blog/comment-1.jpg`
                }
                alt="Comment User"
              />
            </div>
            <div className="blog-comment-content">
              <h4>{comment.UserName || "Anonymous"}</h4>
              <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
              <p>{comment.Text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="blog-reply-wrapper mt-50">
        <h4 className="blog-dec-title">Post a comment</h4>
        <form className="blog-form">
          {/*유저 아이디로 고정(닉네임으로 교체 예정)*/ }
          <div className="row">
            <div className="col-md-6">
              <div className="leave-form">
                <input type="text" placeholder={UserID} disabled/>
              </div>
            </div>
            {/*<div className="col-md-6"> 사용하지 않는 스페이스
              <div className="leave-form">
                <input type="email" placeholder="Email Address " />
              </div>
            </div>*/}
            <div className="col-md-12">
              <div className="text-leave">
              <textarea
                  placeholder="Message"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <input
                  type="submit"
                  value="Post Comment"
                  onClick={postComment}
                />
                {/* <textarea placeholder="Message" defaultValue={""} onChange={(e) => setCommentText(e.target.value)}/>
                <input type="submit" defaultValue="SEND MESSAGE" onClick={postComment}/> */}
              </div>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default BlogComment;
