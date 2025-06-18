const Sequelize = require('sequelize');

module.exports = class VariationSize extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        sizeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        stock: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'VariationSize',
        tableName: 'variation_sizes',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    db.VariationSize.belongsTo(db.Variation, { foreignKey: 'variationId', as: 'variation' });
  }
};