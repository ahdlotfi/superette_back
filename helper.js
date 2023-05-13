function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
}

function emptyOrRows(rows) {
    if (!rows) {
        return [];
    }
    return rows;
}

function emptyOrObject(rows) {
    if (!rows) {
        return undefined;
    }
    return rows[0];
}

module.exports = {
    getOffset,
    emptyOrObject,
    emptyOrRows
}