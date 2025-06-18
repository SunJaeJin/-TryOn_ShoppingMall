const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { isLoggedIn } = require('./middlewares');
const { sequelize, User, Product, ProductImage, Tag, ProductTag, Variation, VariationSize, Cart, AIModel, Comment, Recomment, Like } = require('../models'); 
const router = express.Router();
const createChatCompletion = require('../AI/AI');
const OpenAI = require("openai"); 
require('dotenv').config(); // .env 파일에서 환경 변수 불러오기
const axios = require("axios");


//폴더생성
try {
  fs.readdirSync('../frontend/public/uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('../frontend/public/uploads');
}

//멀터 세팅
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, '../frontend/public/uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

/*
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});*/

const upload2 = multer();

//제품 등록 저장
const saveProductData = async (productData, uploadedFiles) => {
  const t = await sequelize.transaction(); // 트랜잭션 시작
  try {
    // 1. Product 테이블에 데이터 저장
    const product = await Product.create(
      {
        productName: productData.name || "Untitled",
        productDescription: productData.shortDescription || "",
        productPrice: productData.price,
        discountedPrice: productData.discountedPrice || null,
        productStock: productData.stock,
        productDescription: productData.detailedDescription,
        category: productData.category || null,
        affiliateLink: productData.affiliateLink || null,
        UserId: productData.userId || 1
      },
      { transaction: t }
    );
    console.log(product);
    if (!product.productId) {
      throw new Error("Product creation failed. Product ID is null.");
    }
    // 2. 태그 저장
    const tags = productData.tag.split(',').map((tag) => tag.trim());
    for (const tagName of tags) {
      let [tag] = await Tag.findOrCreate({
        where: { name: tagName },
        transaction: t,
      });
      await ProductTag.create(
        { productId: product.productId, tagId: tag.tagId },
        { transaction: t }
      );
    }

    // 3. 변형(variation) 저장
    const variations = JSON.parse(productData.variation);
    for (const variation of variations) {
      const createdVariation = await Variation.create(
        {
          productId: product.productId,
          color: variation.color,
        },
        { transaction: t }
      );

      // 변형의 사이즈 저장
      for (const size of variation.size) {
        await VariationSize.create(
          {
            variationId: createdVariation.variationId,
            name: size.name,
            stock: size.stock,
          },
          { transaction: t }
        );
      }
    }

    // 4. 이미지 저장
    for (const file of uploadedFiles) {
      const filePath = `/uploads/${file.filename}`;
      console.log("이미지주소:" + filePath);
      await ProductImage.create(
        {
          productId: product.productId,
          imageUrl: filePath, // 실제 이미지 경로
        },
        { transaction: t }
      );
    }

    await t.commit(); // 트랜잭션 커밋
    console.log("Product data saved successfully!");
    return
  } catch (error) {
    await t.rollback(); // 트랜잭션 롤백
    console.error("Error saving product data:", error);
  }
};

//제품 등록 수정
const updateProductData = async (productData, uploadedFiles) => {
  const t = await sequelize.transaction(); // 트랜잭션 시작
  try {
    // 1. Product 테이블에 데이터 업데이트
    const product = await Product.findByPk(productData.productId, { transaction: t });
    if (!product) {
      throw new Error("Product not found. Update operation aborted.");
    }

    await product.update(
      {
        productName: productData.name || product.productName,
        productDescription: productData.shortDescription || product.productDescription,
        productPrice: productData.price || product.productPrice,
        discountedPrice: productData.discountedPrice || product.discountedPrice,
        productStock: productData.stock || product.productStock,
        productDescription: productData.detailedDescription || product.productDescription,
        category: productData.category || product.category,
        affiliateLink: productData.affiliateLink || product.affiliateLink,
        UserId: productData.userId || product.UserId,
      },
      { transaction: t }
    );

    console.log("Product updated successfully:", product);

    // 2. 태그 업데이트
    const tags = productData.tag.split(',').map((tag) => tag.trim());
    // 기존 태그 삭제
    await ProductTag.destroy({ where: { productId: product.productId }, transaction: t });
    // 새로운 태그 추가
    for (const tagName of tags) {
      let [tag] = await Tag.findOrCreate({
        where: { name: tagName },
        transaction: t,
      });
      await ProductTag.create(
        { productId: product.productId, tagId: tag.tagId },
        { transaction: t }
      );
    }

    // 3. 변형(variation) 업데이트
    const variations = JSON.parse(productData.variation);
    // 기존 변형 삭제
    const existingVariations = await Variation.findAll({ where: { productId: product.productId }, transaction: t });
    for (const existingVariation of existingVariations) {
      await VariationSize.destroy({ where: { variationId: existingVariation.variationId }, transaction: t });
    }
    await Variation.destroy({ where: { productId: product.productId }, transaction: t });

    // 새로운 변형 추가
    for (const variation of variations) {
      const createdVariation = await Variation.create(
        {
          productId: product.productId,
          color: variation.color,
        },
        { transaction: t }
      );

      for (const size of variation.size) {
        await VariationSize.create(
          {
            variationId: createdVariation.variationId,
            name: size.name,
            stock: size.stock,
          },
          { transaction: t }
        );
      }
    }

    // 4. 이미지 업데이트
    // 기존 이미지 삭제
    await ProductImage.destroy({ where: { productId: product.productId }, transaction: t });
    // 새로운 이미지 추가
    for (const file of uploadedFiles) {
      const filePath = `/uploads/${file.filename}`;
      console.log("이미지주소:" + filePath);
      await ProductImage.create(
        {
          productId: product.productId,
          imageUrl: filePath,
        },
        { transaction: t }
      );
    }

    await t.commit(); // 트랜잭션 커밋
    console.log("Product data updated successfully!");
    return;
  } catch (error) {
    await t.rollback(); // 트랜잭션 롤백
    console.error("Error updating product data:", error);
  }
};
router.post("/products", upload.array("imageFiles", 10), async (req, res) => {
  try {
    // Multer가 처리한 파일
    const files = req.files;

    // 클라이언트에서 보내온 다른 데이터
    const { name, price, stock } = req.body;
    const productData = req.body;
    console.log(req.body);
    console.log("Received Product Data:", { name, price, stock });
    console.log("Uploaded Files:", files);
    saveProductData(productData, files);
    res.status(200).json({
      success: true,
      message: "제품등록 성공.",
    });

  } catch (error) {
    console.error("Error processing upload:", error);
    res.status(500).json({
      success: false,
      message: "파일 처리 중 오류가 발생했습니다.",
    });
  }
});

//장바구니 추가
router.post("/cart", async (req, res) => {
  try {

    // 클라이언트에서 보내온 다른 데이터
    const productData = req.body;
    const product = productData.product;
   console.log("productData:"+productData.quantity);
   console.log(product);
    
   //데이터가 이미 있는지 확인
   const dataExists = await Cart.findOne({
    where: { 
      productId: product.productId,
      UserId: product.UserId
     },
  });
  
  if (dataExists) {
    console.log('Data already exists in the database.');
    res.status(201).json({
      success: false,
      message: "이미 장바구니에 등록된 상품입니다.",
    });
  } else {
    const result = await Cart.create({
      productId: product.productId,
      productName: product.productName,
      productPrice: product.productPrice,
      selectstock:productData.quantity,
      category:product.category,
      imageUrl: product.images[0].imageUrl,
      color: productData.selectedProductColor,
      size: productData.selectedProductSize,
      UserId: product.UserId || 1,
      });
      console.log("Cart inserted:", result.dataValues);
    res.status(200).json({
      success: true,
      message: "장바구니 등록 성공.",
    });
  }
    
  } catch (error) {
    console.error("Error processing upload:", error);
    res.status(500).json({
      success: false,
      message: "파일 처리 중 오류가 발생했습니다.",
    });
  }
});

//AI이미지 생성
router.post("/AICreate", async (req, res) => {
  try {

    // 클라이언트에서 보내온 다른 데이터
    const AIData = req.body;
   console.log(AIData);
   const AIImgPath = await createChatCompletion(AIData.topImage, AIData.bottomImage);
   
    const result = await AIModel.create({
      AIimageUrl: AIImgPath,
      TopproductId: AIData.selectedTopId,
      TopproductName: AIData.selectedTop,
      TopproductPrice:40000,
      TopimageUrl: AIData.topImage,
      BottomproductId: AIData.selectedBottomId,
      BottomproductName: AIData.selectedBottom,
      BottomproductPrice:30000,
      BottomimageUrl: AIData.bottomImage,
      LikeCount : 0,
      IsShared : false,
      UserId: AIData.UserId || 1,
      });

    console.log("AI created:", result.dataValues);
    res.status(200).json({
      success: true,
      message: "AI이미지 생성 성공.",
      data:AIImgPath
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    res.status(500).json({
      success: false,
      message: "파일 처리 중 오류가 발생했습니다.",
    });
  }
});
//댓글생성

router.post("/Comment", async (req, res) => {
  try {
    const CommentData = req.body;
    console.log("req.body 입니다 :" + req.body.Post);
    // 클라이언트에서 보내온 다른 데이터

   
    const result = await Comment.create({
      UserName: "",
      Text: CommentData.Text,
      UserId: CommentData.User || 1,
      AIModelId: CommentData.Post.AIModelId || 1,
      });

    res.status(200).json({
      success: true,
      message: "댓글 작성 성공.",
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    res.status(500).json({
      success: false,
      message: "오류가 발생했습니다.",
    });
  }
});

// 좋아요 토글

router.post('/like', async (req, res) => {
  const { userId, AIModelId } = req.body;

  try {
    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await Like.findOne({
      where: { UserId: userId, AIModelId }
    });

    if (existingLike) {
      // 좋아요 취소
      await existingLike.destroy();

      // LikeCount 감소
      await AIModel.increment({ LikeCount: -1 }, { where: { AIModelId } });

      return res.status(200).json({ success: true, message: '좋아요 취소됨' });
    } else {
      // 좋아요 추가
      await Like.create({ UserId: userId, AIModelId });

      // LikeCount 증가
      await AIModel.increment({ LikeCount: 1 }, { where: { AIModelId } });

      return res.status(200).json({ success: true, message: '좋아요 추가됨' });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ success: false, message: '오류가 발생했습니다.' });
  }
});


//유저 정보 변경
router.put("/userinfo", upload.single("profileImage"), async (req, res) => {
  try {
    const { nickname, email, telephone, userId } = req.body; // 텍스트 데이터
    const file = req.file; // 업로드된 파일

    console.log("Nickname:", nickname);
    console.log("Email:", email);
    console.log("Telephone:", telephone);
    console.log("userId:", userId);

    // 저장된 파일 경로
    const filePath = file ? `/uploads/${file.filename}` : null;
    console.log("Uploaded file:", filePath);
    // 클라이언트에서 보내온 다른 데이터
    const result = await User.update(
      {
        email:email,
        nick:nickname,
        telephone:telephone,
        imageUrl:filePath
      },
      {where: {id:userId}}
      );
     
    res.status(200).json({
      success: true,
      message: "유저정보 변경.",
    });
  
    
  } catch (error) {
    console.error("Error processing upload:", error);
    res.status(500).json({
      success: false,
      message: "파일 처리 중 오류가 발생했습니다.",
    });
  }
});

//장바구니 수량 변경
router.put("/cart", async (req, res) => {
  try {
    // 클라이언트에서 보내온 다른 데이터
  const CartData = req.body;
  console.log("CartData:"+CartData.quantity);
   console.log("CartData:"+CartData.CartId);
    const result = await Cart.update(
      {selectstock:CartData.quantity},
      {where: {CartId:CartData.CartId}}
      );
     
    res.status(200).json({
      success: true,
      message: "장바구니 수량 변경 성공.",
    });
  
    
  } catch (error) {
    console.error("Error processing upload:", error);
    res.status(500).json({
      success: false,
      message: "파일 처리 중 오류가 발생했습니다.",
    });
  }
});

//제품정보 변경
router.put("/products", upload.array("imageFiles", 10), async (req, res) => {
  try {
    // Multer가 처리한 파일
    const files = req.files;

    // 클라이언트에서 보내온 다른 데이터
    const { name, price, stock } = req.body;
    const productData = req.body;
    console.log(req.body);
    console.log("Received Product Data:", { name, price, stock });
    console.log("Uploaded Files:", files);
    updateProductData(productData, files);
    res.status(200).json({
      success: true,
      message: "제품등록 성공.",
    });

  } catch (error) {
    console.error("Error processing upload:", error);
    res.status(500).json({
      success: false,
      message: "파일 처리 중 오류가 발생했습니다.",
    });
  }
});

//AI공개 변경
router.put("/PutCommunity", async (req, res) => {
  try {
    // 클라이언트에서 보내온 다른 데이터
  const CommunityData = req.body;
   console.log("CartData:"+CommunityData.UserId);
   const latestData = await AIModel.findOne({
    where: { UserId:CommunityData.UserId },
    order: [['updatedAt', 'DESC']], // 최신 데이터 정렬
  });
    const result = await AIModel.update(
      {IsShared:true},
      {where: {AIModelId:latestData.AIModelId}}
      );
     
    res.status(200).json({
      success: true,
      message: "장바구니 수량 변경 성공.",
    });
  
    
  } catch (error) {
    console.error("Error processing upload:", error);
    res.status(500).json({
      success: false,
      message: "파일 처리 중 오류가 발생했습니다.",
    });
  }
});

//사용자 정보
router.get('/account/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
const UserId = id;
    try {
      const Userdata = await User.findByPk(UserId);
  
      if (!Userdata) {
        throw new Error(`Product with ID ${UserId} not found.`);
      }
  
      console.log("Product data:", Userdata);
      res.status(200).json({
        success: true,
        data: Userdata
      });
    } catch (error) {
      console.error("Error fetching User:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch Users',
        error: error.message,
      });
    }
  });

  //사용자 정보 상세
router.get('/account-detail/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
const UserId = id;
    try {
      const Userdata = await User.findByPk(UserId,{
        include: [
          { model: Product,
            as: 'products',
            include: [
              {
                model: ProductImage,
                as: 'images', // Product 모델에서 설정한 alias
              },
              {
                model: Tag,
                as: 'tags',
                through: { attributes: [] }, // 중간 테이블의 데이터는 제외
              },
              {
                model: Variation,
                as: 'variations',
                include: [
                  {
                    model: VariationSize,
                    as: 'sizes',
                  },
                ],
              },
            ]
           },
           {
            model: AIModel,
            as: 'AIModels'
           }
        ],
      }

      );
  
      if (!Userdata) {
        throw new Error(`Product with ID ${UserId} not found.`);
      }
  
      console.log("Product data:", Userdata);
      res.status(200).json({
        success: true,
        data: JSON.stringify(Userdata, null, 2),
      });
    } catch (error) {
      console.error("Error fetching User:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch Users',
        error: error.message,
      });
    }
  });

  //사용자목록
  router.get('/accounts', async (req, res) => {
      try {
        const Userdata = await User.findAll({where: {type:'user'}});
    
        if (!Userdata) {
          throw new Error(`Product with ID ${UserId} not found.`);
        }
    
        console.log("Product data:", Userdata);
        res.status(200).json({
          success: true,
          data: Userdata
        });
      } catch (error) {
        console.error("Error fetching User:", error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch Users',
          error: error.message,
        });
      }
    });
//제품 상세
router.get('/product/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
const productId = id;
    try {
      const product = await Product.findByPk(productId, {
        include: [
          {
            model: ProductImage,
            as: 'images', // Product 모델에서 설정한 alias
          },
          {
            model: Tag,
            as: 'tags',
            through: { attributes: [] }, // 중간 테이블의 데이터는 제외
          },
          {
            model: Variation,
            as: 'variations',
            include: [
              {
                model: VariationSize,
                as: 'sizes',
              },
            ],
          },
        ],
      });
  
      if (!product) {
        throw new Error(`Product with ID ${productId} not found.`);
      }
  
      console.log("Product data:", product);
      res.status(200).json({
        success: true,
        data: JSON.stringify(product, null, 2),
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      });
    }
  });

  //유저가 등록한 제품들
  router.get('/user_products/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
  const userId = id;
      try {
        const product = await Product.findAll({
          where: { userId }, 
          include: [
            {
              model: ProductImage,
              as: 'images', // Product 모델에서 설정한 alias
            },
            {
              model: Tag,
              as: 'tags',
              through: { attributes: [] }, // 중간 테이블의 데이터는 제외
            },
            {
              model: Variation,
              as: 'variations',
              include: [
                {
                  model: VariationSize,
                  as: 'sizes',
                },
              ],
            },
          ],
        });
    
        if (!product) {
          throw new Error(`Product with ID ${userId} not found.`);
        }
    
        console.log("Product data:", product);
        res.status(200).json({
          success: true,
          data: JSON.stringify(product, null, 2),
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch products',
          error: error.message,
        });
      }
    });

    //유저가 등록한 포스트들
  router.get('/user_posts/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
  const userId = id;
      try {
        const posts = await AIModel.findAll({
          where: { UserId:userId },
        });
    
        if (!posts) {
          throw new Error(`Product with ID ${userId} not found.`);
        }
    
        console.log("Product data:", posts);
        res.status(200).json({
          success: true,
          data: JSON.stringify(posts, null, 2),
        });
      } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch products',
          error: error.message,
        });
      }
    });
  //제품 목록
  router.get('/products', async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: ProductImage,
            as: 'images', // Product 모델에서 설정한 alias
          },
          {
            model: Tag,
            as: 'tags',
            through: { attributes: [] }, // 중간 테이블의 데이터는 제외
          },
          {
            model: Variation,
            as: 'variations',
            include: [
              {
                model: VariationSize,
                as: 'sizes',
              },
            ],
          },
        ],
      });
  
      // products는 배열 형태로 반환됩니다.
      // JSON.stringify를 사용하지 않고 바로 products를 반환해도 되지만,
      // 여기서는 가독성을 위해 stringify를 사용했습니다.
      res.status(200).json({
        success: true,
        data: JSON.stringify(products, null, 2),
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      });
    }
  });

  
  //장바구니 정보 불러오기
  router.get('/carts/:id', async (req, res) => {
    const { id } = req.params;
const IdData = id;
    console.log("ID: "+ IdData);
    if(!IdData){
      IdData = 1;
    }
    try {
      const carts = await Cart.findAll({
        where: { UserId: IdData }
      });
  
      // products는 배열 형태로 반환됩니다.
      // JSON.stringify를 사용하지 않고 바로 products를 반환해도 되지만,
      // 여기서는 가독성을 위해 stringify를 사용했습니다.
      res.status(200).json({
        success: true,
        data: carts,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      });
    }
  });

  //댓글목록
  router.get('/community/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const AIModelId = id;
        try {
          const Comments = await AIModel.findByPk(AIModelId, {
            include: [
              {
                model: Comment,
                as: 'Comments',
                include: [
                  {
                    model: Recomment,
                    as: 'Recomments',
                  },
                ],
              },
            ],
          });
      
          if (!AIModelId) {
            throw new Error(`Product with ID ${AIModelId} not found.`);
          }
      
          console.log("Product data:", Comments);
          res.status(200).json({
            success: true,
            data: JSON.stringify(Comments, null, 2),
          });
        } catch (error) {
          console.error("Error fetching product:", error);
          res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
            error: error.message,
          });
        }
      });

  //커뮤니티상세
/*
  router.get('/community', async (req, res) => {
    const IdData = req.body;
    if(!IdData.UserId){
      IdData.UserId = 1;
    }
    try {
      const community = await AIModel.findOne({
        where: { AIModelId : 1 }
        //IdData.AIModelId
      });
  
     
      res.status(200).json({
        success: true,
        data: community,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      });
    }
  });*/

  //커뮤니티목록
  router.get('/communitys', async (req, res) => {
    const IdData = req.body;
    if(!IdData.UserId){
      IdData.UserId = 1;
    }
    try {
      const communitys = await AIModel.findAll({
        where: { IsShared : true }  
      });
  
     
      res.status(200).json({
        success: true,
        data: communitys,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      });
    }
  });

  //좋아요 상태검사
  router.get('/like-status', async (req, res) => {
    const { userId, AIModelId } = req.query;
    console.log("userId:"+userId)
    console.log("userId:"+userId)
    console.log("userId:"+userId)
    console.log("userId:"+userId)
    console.log("userId:"+userId)
    try {
      const existingLike = await Like.findOne({
        where: { UserId: userId, AIModelId }
      });
  
      const isLiked = !!existingLike;
      console.log("iseid:"+isLiked)
      return res.status(200).json({ success: true, isLiked: isLiked});
    } catch (error) {
      console.error('Error fetching like status:', error);
      res.status(500).json({ success: false, message: '오류가 발생했습니다.' });
    }
  });

  //제품 삭제
  router.delete('/product/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const ProductId = id;
    try {
      const communitys = await Product.destroy({
        where: { productId : ProductId }
        
      });
      res.status(200).json({
        success: true,
        data: communitys,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      });
    }
  });

  //커뮤니티 포스트 삭제
  router.delete('/community/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const AIModelId = id;
    try {
      const communitys = await AIModel.destroy({
        where: { AIModelId : AIModelId }
        
      });
  
      res.status(200).json({
        success: true,
        data: communitys,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      });
    }
  });

  //장바구니 아이템 삭제
  router.delete('/cart', async (req, res) => {
    const {CartId } = req.query;
    console.log("삭제할 id:"+CartId);

    try {
      const CartRes = await Cart.destroy({
        where: { 
          CartId : CartId
         }
        
      });
  
      res.status(200).json({
        success: true,
        data: CartRes,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      });
    }
  });
  //장바구니 전체 삭제
  router.delete('/carts', async (req, res) => {
    const {UserId} = req.query;
    try {
      const CartRes = await Cart.destroy({
        where: { 
          UserId : UserId
         }
        //일단 false가 공개
      });
  
      res.status(200).json({
        success: true,
        data: CartRes,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      });
    }
  });
  /*
    try {
      // Product 테이블에서 모든 데이터를 가져오기
      const products = await Product.findAll();
      const productData = products.map(product => product.toJSON());
      console.log(productData);
      // 성공적으로 데이터를 가져왔을 경우 응답
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      console.error('Error fetching products:', error);
  
      // 에러 발생 시 응답
      res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message,
      });
    }*/

module.exports = router;