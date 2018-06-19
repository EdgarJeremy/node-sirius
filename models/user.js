export default (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
        name: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(191),
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(191),
            allowNull: false
        }
    }, {
        underscored: true
    });

    User.associate = (models) => {
        
    }

    return User;
}