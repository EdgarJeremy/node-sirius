/**
* File : ./models/article.js
* Tanggal Dibuat : 2018-7-16 19:17:30
* Penulis : zero
*/

export default (sequelize, DataTypes) => {

    const Article = sequelize.define("article", {
        /**
         * Kolom tabel disini..
         */
    }, {
        underscored: true
    });

    Article.associate = (models) => {
        /**
         * Definisi relasi tabel disini
         */
    }

    return Article;

}