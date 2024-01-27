// models/PostModel.js
const {db} = require('../../db/db'); // Adjust the path as needed

class PostModel {
    static async getAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM posts', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM posts WHERE id = ?';
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static async getPostCount() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT COUNT(*) AS count FROM posts';
            db.get(sql, [], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });
    }

    static async getPostsByPagination(startIdx, pageSize) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM posts LIMIT ?, ?';
            db.all(sql, [startIdx, pageSize], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    // Add other methods as needed...
}

module.exports = PostModel;
