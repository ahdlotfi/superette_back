const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT * 
            FROM tp4_article LIMIT ?,?`
        , [offset, config.listPerPage]);
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

async function getOne(id) {
    const rows = await db.query(
        `SELECT * 
            FROM tp4_article WHERE id=?`
        , [id]);
    const data = helper.emptyOrObject(rows);
    console.log(data)

    return {
        data,
    }
}

async function create(article) {
    const result = await db.query(
        `INSERT INTO tp4_article 
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

async function update(article) {
    const result = await db.query(
        `UPDATE tp4_article 
      SET designation=? ,prix=? ,qte_stock=? 
      WHERE id=? `
        , [article.designation, article.prix, article.qte_stock, article.id]);

    let message = 'Error in updating the article';
    let success = false;

    if (result.affectedRows) {
        message = 'Article updated successfully';
        success = true;
    }

    return { message, success };
}

module.exports = {
    getMultiple,
    getOne,
    update,
    create
}