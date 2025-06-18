const Sequelize = require('sequelize');

module.exports = class Cart extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        CartId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        productId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        productName: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        productPrice: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        selectstock: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        category: {
          type: Sequelize.STRING(100),
          allowNull: true
        },
        imageUrl: {
          type: Sequelize.STRING(200),
          allowNull: true
        },
        color: {
          type: Sequelize.STRING(50),
          allowNull: true
        },
        size: {
          type: Sequelize.STRING(50),
          allowNull: true
        }
      },
      {
        sequelize,
        timestamps: true, // createdAt, updatedAt 컬럼 자동 생성
        underscored: false,
        modelName: 'Cart',
        tableName: 'Carts',
        paranoid: false, // deletedAt 컬럼 사용 여부 (false: 사용 안 함)
        charset: 'utf8mb4',  // utf8mb4로 설정하여 이모지까지 지원
        collate: 'utf8mb4_general_ci',
      }
    );
  }

  static associate(db) {
    // 연관 관계가 필요하다면 이곳에서 설정
    db.Cart.belongsTo(db.User, { foreignKey: 'UserId', as: 'user' });
  }
};