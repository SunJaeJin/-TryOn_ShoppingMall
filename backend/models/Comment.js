const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        CommentId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        UserName: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        Text: {
          type: Sequelize.STRING(200),
          allowNull: true
        },
       
      },
      {
        sequelize,
        timestamps: true, // createdAt, updatedAt 컬럼 자동 생성
        underscored: false,
        modelName: 'Comment',
        tableName: 'Comments',
        paranoid: false, // deletedAt 컬럼 사용 여부 (false: 사용 안 함)
        charset: 'utf8mb4',  // utf8mb4로 설정하여 이모지까지 지원
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    // 연관 관계가 필요하다면 이곳에서 설정
    db.Comment.belongsTo(db.AIModel, { foreignKey: 'AIModelId', as: 'AIModel' });
    db.Comment.belongsTo(db.User, { foreignKey: 'UserId', as: 'user' });
    db.Comment.hasMany(db.Recomment, { foreignKey: 'RecommentId', as: 'Recomments' });
  }
};