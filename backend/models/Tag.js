const Sequelize = require('sequelize');

module.exports = class Tag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        tagId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: 'Tag',
        tableName: 'tags',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    db.Tag.belongsToMany(db.Product, { through: db.ProductTag, foreignKey: 'tagId', as: 'products' });
  }
};