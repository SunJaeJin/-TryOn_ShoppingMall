const Sequelize = require('sequelize');

module.exports = class AIModel extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        AIModelId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        AIimageUrl: {
            type: Sequelize.STRING(200),
            allowNull: false
          },
        TopproductId: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
        TopproductName: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        TopproductPrice: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true
        },
        TopimageUrl: {
          type: Sequelize.STRING(200),
          allowNull: false
        },
        BottomproductId: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          BottomproductName: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        BottomproductPrice: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true
        },
        BottomimageUrl: {
          type: Sequelize.STRING(200),
          allowNull: false
        },
        IsShared: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        LikeCount: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
      },
      {
        sequelize,
        timestamps: true, // createdAt, updatedAt 컬럼 자동 생성
        underscored: false,
        modelName: 'AIModel',
        tableName: 'AIModels',
        paranoid: false, // deletedAt 컬럼 사용 여부 (false: 사용 안 함)
        charset: 'utf8mb4',  // utf8mb4로 설정하여 이모지까지 지원
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    // 연관 관계가 필요하다면 이곳에서 설정
    db.AIModel.belongsTo(db.User, { foreignKey: 'UserId', as: 'user' });
    db.AIModel.hasMany(db.Comment, { foreignKey: 'AIModelId', as: 'Comments' });
    db.AIModel.hasMany(db.Like, { foreignKey: 'AIModelId', as: 'Likes' });
  }
};