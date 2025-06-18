const Sequelize = require('sequelize');

module.exports = class Variation extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        variationId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        color: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Variation',
        tableName: 'variations',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    db.Variation.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });
    db.Variation.hasMany(db.VariationSize, { foreignKey: 'variationId', as: 'sizes' });
  }
};