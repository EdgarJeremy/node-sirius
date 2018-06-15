export default (sequelize, DataTypes) => {

    const Article = sequelize.define("article", {
        title: {
            type: DataTypes.STRING(191),
            allowNull: false
        },
        body: {
            type: DataTypes.TEXT,
        }
    }, {
        underscored: true
    });

    Article.associate = (models) => {
        Article.belongsTo(models.user, {
            onDelete: "cascade"
        });
    }

    return Article;

}