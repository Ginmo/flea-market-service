let mysql = require("mysql");
let pool = null;

const db = {
    init: (databaseName) => {
        return new Promise((resolve, reject) => {
            try {
                pool = mysql.createPool({
                    connectionLimit: 10,
                    host: 'localhost',
                    user: 'root',
                    password: 'test',
                    database: databaseName
                });
                resolve();
            } catch (error) {
                console.log('Mysql pool create failed');
                console.log(error);
                reject(error)
            }
        });
    },
    checkConnection: () => {
        return new Promise((resolve, reject) => {
            db.query("SELECT version()").then(results => {
                resolve(results);
            }).catch(error => {
                reject(error);
            });
        });
    },
    query: (query, ...parameters) => {
        let promise = new Promise(function (resolve, reject) {
            pool.query(query, ...parameters, (error, results, fields) => {
                if (error) {
                    reject(error)
                };

                resolve(results);
            })
        });

        return promise;
    },
    closeAll: () => {
        pool.end();
    }
};

module.exports = db;