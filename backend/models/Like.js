const Sequelize = require('sequelize');

module.exports = class Like extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        LikeId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        UserId: { // 좋아요를 누른 유저 ID
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        AIModelId: { // 좋아요를 받은 AIModel ID
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true, // createdAt, updatedAt 자동 생성
        underscored: false,
        modelName: 'Like',
        tableName: 'Likes',
        paranoid: false, // deletedAt 컬럼 사용 여부
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    db.Like.belongsTo(db.User, { foreignKey: 'UserId', as: 'user' });
    db.Like.belongsTo(db.AIModel, { foreignKey: 'AIModelId', as: 'AIModel' });
  }
};