const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const Product = require('./Product');
const ProductImage = require('./ProductImage');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');
const Variation = require('./Variation');
const VariationSize = require('./VariationSize');
const Cart = require('./Cart');
const AIModel = require('./AIModel');
const Comment = require('./Comment');
const Recomment = require('./Recomment');
const Like = require('./Like');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Product = Product;
db.ProductImage = ProductImage;
db.Tag = Tag;
db.ProductTag = ProductTag;
db.Variation = Variation;
db.VariationSize = VariationSize;
db.Cart = Cart;
db.AIModel = AIModel;
db.Comment = Comment;
db.Recomment = Recomment;
db.Like = Like;

User.init(sequelize);
Product.init(sequelize);
ProductImage.init(sequelize);
Tag.init(sequelize);
ProductTag.init(sequelize);
Variation.init(sequelize);
VariationSize.init(sequelize);
Cart.init(sequelize);
AIModel.init(sequelize);
Comment.init(sequelize);
Recomment.init(sequelize);
Like.init(sequelize);

// 관계 설정
User.associate(db);
Product.associate(db);
ProductImage.associate(db);
Tag.associate(db);
Variation.associate(db);
VariationSize.associate(db);
Cart.associate(db);
AIModel.associate(db);
Comment.associate(db);
Recomment.associate(db);
Like.associate(db);


module.exports = db;
