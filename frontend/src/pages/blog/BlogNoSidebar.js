import React, { useState, Fragment, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogPagination from "../../wrappers/blog/BlogPagination";
import BlogPostsNoSidebar from "../../wrappers/blog/BlogPostsNoSidebar";
import axios from "axios";

const BlogNoSidebar = () => {
  const [communitysItems, setCommunitysItems] = useState([]); // JSON 데이터를 저장할 state
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://ceprj.gachon.ac.kr:60011/api/communitys");
        let data = response.data.data;
        setCommunitysItems(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching products:", error);

      }
    };

    fetchProducts();
  }, []);

  let { pathname } = useLocation();

  // const [likes, setLikes] = useState({});

  // const handleLike = async(postId) => {
  //   try {
  //     // 좋아요 요청
  //     const response = await axios.post('http://ceprj.gachon.ac.kr:60011/api/like', {
  //       userId: localStorage.getItem("UserID"),
  //       AIModelId: postId,
  //     });
  
  //     if (response.data.success) {
  //       // 서버에서 최신 데이터 가져오기
  //       const updatedResponse = await axios.get("http://ceprj.gachon.ac.kr:60011/api/communitys");
  //       const updatedData = updatedResponse.data.data;
  //       setCommunitysItems(updatedData); // 최신 데이터를 목록에 반영
  //     }
  //   } catch (error) {
  //     console.error("좋아요 요청 오류:", error);
  //   }
  // };

  return (
    <Fragment>
      <SEO
        titleTemplate="Blog"
        description="Blog of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Blog", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />
        <div className="blog-area pt-100 pb-100 blog-no-sidebar">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="mr-20">
                  <div className="row">
                    {/* blog posts */}
                    <BlogPostsNoSidebar posts={communitysItems} />
                  </div>

                  {/* blog pagination */}
                  <BlogPagination />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default BlogNoSidebar;
