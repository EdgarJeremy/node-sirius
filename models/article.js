export default (sequelize, DataTypes) => {

    const Article = sequelize.define("article", {
        title: {
            type: DataTypes.STRING,
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