const Sequelize = require('sequelize');

module.exports = class Product extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        productId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        productName: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        productDescription: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        productPrice: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        discountedPrice: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
        },
        productStock: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        category: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        affiliateLink: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Product',
        tableName: 'products',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    db.Product.hasMany(db.ProductImage, { foreignKey: 'productId', as: 'images' });
    db.Product.belongsToMany(db.Tag, { through: db.ProductTag, foreignKey: 'productId', as: 'tags' });
    db.Product.hasMany(db.Variation, { foreignKey: 'productId', as: 'variations' });
    db.Product.belongsTo(db.User, { foreignKey: 'UserId', as: 'user' });
  }
};