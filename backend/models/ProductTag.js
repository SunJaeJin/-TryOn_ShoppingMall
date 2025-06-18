const Sequelize = require('sequelize');

module.exports = class ProductTag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {},
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'ProductTag',
        tableName: 'product_tags',
      }
    );
  }
};