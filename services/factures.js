const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT * 
            FROM tp4_v_facture LIMIT ?,?`
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
            FROM tp4_facture WHERE id=?`
        , [id]);
    const data = helper.emptyOrObject(rows);
    let success = false;
    if (data) {
        success = true;
        const client = await db.query(
            `SELECT * 
            FROM tp4_client WHERE id=?`
            , [data.id_client]);
        data.client = helper.emptyOrObject(client);
        const rows = await db.query(
            `SELECT * 
            FROM tp4_v_ligne_facture WHERE id_facture=?`
            , [id]);
        const lignes = helper.emptyOrRows(rows);
        data.lines = lignes;
    }

    return {
        success,
        data,
    }
}

async function create(facture) {
    if (facture.operation === 'CLOTURE') {
        const result = await db.query(
            `UPDATE tp4_facture SET etat='Clôturée' WHERE id=? `
            , [facture.id]);
        let message = 'Error in closing';
        let success = false;

        if (result.affectedRows) {
            message = 'Order closed successfully';
            success = true;
        }
        return { message, success, insertId: result.insertId };
    }

    const result = await db.query(
        `INSERT INTO tp4_facture 
      (id_client) 
      VALUES (?)`
        , [facture.id_client]);

    let message = 'Error in creating the article';
    let success = false;

    if (result.affectedRows) {
        message = 'Order created successfully';
        success = true;
        const id = result.insertId;
        for (let i = 0; i < facture.lignes.length; i++) {
            const ligne = facture.lignes[i];
            await db.query(
                `INSERT INTO tp4_ligne_facture 
              (id_facture,id_article,qte,prix) 
              VALUES (?,?,?,?)`
                , [id, ligne.id_article, ligne.qte, ligne.prix]);
        }
    }

    return { message, success, insertId: result.insertId };
}

async function update(facture) {

    const result = await db.query(
        `UPDATE tp4_facture 
            SET id_client=? WHERE id=? `
        , [facture.id_client, facture.id]);

    let message = 'Error in creating the article';
    let success = false;

    if (result.affectedRows) {
        message = 'Order updated successfully';
        success = true;
        for (let i = 0; i < facture.lignes.length; i++) {
            const ligne = facture.lignes[i];
            if (ligne.type === 'NEW') {
                await db.query(
                    `INSERT INTO tp4_ligne_facture 
                  (id_facture,id_article,qte,prix) 
                  VALUES (?,?,?,?)`
                    , [ligne.id_facture, ligne.id_article, ligne.qte, ligne.prix]);
            }
            if (ligne.type === 'EDIT') {
                await db.query(
                    `UPDATE tp4_ligne_facture 
                  SET qte=? ,prix=? WHERE id_facture=? AND id_article=? `
                    , [ligne.qte, ligne.prix, ligne.id_facture, ligne.id_article]);
            }
        }
    }

    return { message, success, insertId: result.insertId };
}

module.exports = {
    getMultiple,
    getOne,
    create, update
}