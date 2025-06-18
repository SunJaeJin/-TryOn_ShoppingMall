import React, { Fragment } from "react";
import { Link } from "react-router-dom";

const BlogPostsNoSidebar = ({ posts, likes, onLike }) => {
 /* const posts = [
     { id: 1, title: "test", date: "22 April, 2024" },
     { id: 2, title: "by userId", date: "23 April, 2024" },
  ];
*/
  // const reversedPosts = [...posts].reverse();

  return (
    <Fragment>
      {posts.map((post) => (
        <div className="col-lg-4 col-md-6 col-sm-12" key={post.AIModelId}>
          <div className="blog-wrap-2 mb-30">
            <div className="blog-img-2">
              {/* 상세 페이지로 이동 시 state에 데이터 전달 */}
              <Link 
                to={{
                  pathname: `/blog-details-standard/${post.AIModelId}`,
                  state: { post },
                }}
              >
                 <img
                 src={post.AIimageUrl}
                  //src={post.AIimageUrl.startsWith("http") ? post.AIimageUrl : `${process.env.PUBLIC_URL}${post.AIimageUrl}`}
                  alt={`Post ${post.AIModelId}`}
                  style={{ width: "100%", height: "auto" }}
                />
              </Link>
            </div>
            <div className="blog-content-2">
              <div className="blog-meta-2">
                <ul>
                  <li>{new Date(post.createdAt).toDateString()}</li>
                  <li>
                    <span
                      style={{
                        background: "none",
                        border: "none",
                        color: "#666",
                        // cursor: "pointer",
                      }}
                      // onClick={() => onLike(post.AIModelId)}
                    >
                      <i
                        className="fa fa-heart"
                        style={{
                          marginRight: "5px",
                          // color: likes[post.id] ? "#ff6347" : "#666",
                        }}
                      /> {post.LikeCount}
                    </span>
                  </li>
                </ul>
              </div>
              <h4
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  margin: "15px 0 0px",
                }}
              >
                <Link
                  to={{
                    pathname: `/blog-details-standard/${post.AIModelId}`,
                    state: { post },
                  }}
                >
                  {post.TopproductName}
                </Link>
              </h4>
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  );
};

export default BlogPostsNoSidebar;
