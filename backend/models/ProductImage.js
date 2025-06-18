const Sequelize = require('sequelize');

module.exports = class ProductImage extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        imageId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        imageUrl: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'ProductImage',
        tableName: 'product_images',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    db.ProductImage.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });
  }
};