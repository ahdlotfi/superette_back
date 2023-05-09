const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT * 
            FROM article LIMIT ?,?`
        , [offset, config.listPerPage]);
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

async function create(article) {
    const result = await db.query(
        `INSERT INTO article 
      (designation,prix,qte_stock) 
      VALUES 
      (?, ?, ?)`
        , [article.designation, article.prix, article.qte_stock]);

    let message = 'Error in creating the article';
    let success = false;

    if (result.affectedRows) {
        message = 'Article created successfully';
        success = true;
    }

    return { message, success };
}

module.exports = {
    getMultiple,
    create
}