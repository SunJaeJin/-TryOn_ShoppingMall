const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      provider: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'local',
      },
      type: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'user',
      },
      telephone: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
      imageUrl: {
      type: Sequelize.STRING(200),
      allowNull: true,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Product, { foreignKey: 'UserId', as: 'products' });
    db.User.hasMany(db.Cart, { foreignKey: 'UserId', as: 'Carts' });
    db.User.hasMany(db.AIModel, { foreignKey: 'UserId', as: 'AIModels' });
    db.User.hasMany(db.Comment, { foreignKey: 'UserId', as: 'Comments' });
    db.User.hasMany(db.Recomment, { foreignKey: 'UserId', as: 'Recomments' });
    db.User.hasMany(db.Like, { foreignKey: 'UserId', as: 'Likes' });
  }
};