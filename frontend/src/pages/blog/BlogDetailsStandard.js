import React, { useState, Fragment, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom"; 
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
import BlogComment from "../../wrappers/blog/BlogComment";
import BlogPost from "../../wrappers/blog/BlogPost";
import axios from "axios";


const BlogDetailsStandard = () => {
  let location = useLocation();
  const { id } = useParams(); // URL에서 ID 가져오기
  const UserId = localStorage.getItem('UserID');
  const { pathname, state } = location; // pathname과 state를 구조분해 할당
   
  const [post, setCommunityItems] = useState([]); // JSON 데이터를 저장할 state
   useEffect(() => {
     const fetchProducts = async () => {
       try {
         const response = await axios.get("http://ceprj.gachon.ac.kr:60011/api/community/"+id);
         let data = response.data.data;
         const jsonData = JSON.parse(data);
         await setCommunityItems(jsonData);
         console.log(jsonData);
       } catch (error) {
         console.error("Error fetching products:", error);

       }
     };

     fetchProducts();
   }, []);

  
  if (!post) {
    console.log("no post"); //<div>No post data available</div>;
  }
  return (
    <Fragment>
      <SEO
        titleTemplate="Community Post"
        description="Community Post Details"
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Blog Post", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row flex-row-reverse">
              <div className="col-lg-12">
                <div className="blog-details-wrapper ml-20"
                  style={{
                    maxWidth: "800px", // 가로 길이를 제한
                    margin: "0 auto", // 중앙 정렬
                    padding: "20px", // 내부 여백
                  }}
                >
                  {/* blog post */}
                  <BlogPost
                    AIimageUrl={post.AIimageUrl}
                    TopimageUrl={post.TopimageUrl}
                    BottomimageUrl={post.BottomimageUrl}
                    TopproductId={post.TopproductId}
                    BottomproductId={post.BottomproductId}
                    PostOwner={post.UserId}
                    LikeCount={post.LikeCount}
                    postId={id}
                  />

                  {/* blog post comment */}
                  <BlogComment 
                    UserID={UserId}
                    Post={post}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default BlogDetailsStandard;
