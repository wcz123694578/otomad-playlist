const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'otomad_list'
})

/**
 * 
 * @param {音骂播放列表名字} pname 
 * @param {结果回调，如果有需要加上err} callback 
 */
exports.queryMediaList = (table, callback) => {
    connection.query(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) {
            callback && callback(err, null);
            return;
        }
        callback && callback(null, rows);
    })
}

exports.queryVideos = (pid, callback) => {
    connection.query(`SELECT * FROM videos WHERE pid=${pid}`, (err, rows) => {
        if (err)    {
            callback && callback(err, null);
            return;
        }
        callback && callback(null, rows);
    })
}

exports.AddList = (listInfo, callback) => {
    const sql = 'INSERT INTO media_lists SET ?';
    connection.query(sql, listInfo, (err, res) => {
        if (err)    {
            callback && callback(err, null);
            return;
        }
        callback && callback(null, res);
    })
}

exports.queryPath = (pid, callback) => {
    const sql = `SELECT * FROM media_lists WHERE pid=?`;
    connection.query(sql, pid, (err, res) => {
        if (err)    {
            callback & callback(err, null);
            return;
        }
        callback && callback(null, res);
    })
}

exports.addVideo = (videoInfo, callback) => {
    const sql = `INSERT INTO videos SET ?`;
    connection.query(sql, videoInfo, (err, res) => {
        if (err)    {
            callback && callback(err, null);
            return;
        }
        callback && callback(null, res);
    })
}