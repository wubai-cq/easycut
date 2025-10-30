const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

const AES_KEY = Buffer.from('EasyCutEncryptKey-ReplaceMe-32ch', 'utf8'); 
const AES_IV = Buffer.from('EasyCut-IV-1frf1', 'utf8'); 

function decryptPassword(encrypted) {
  // encrypted: base64 密文
  const decipher = crypto.createDecipheriv('aes-256-cbc', AES_KEY, AES_IV);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

let pool = null;

function loadConfig() {
	// Prefer env vars; optional local config file `db.config.json`
	const configFromFilePath = path.join(__dirname, 'db.config.json');
	let fileCfg = {};
	if (fs.existsSync(configFromFilePath)) {
		try {
			fileCfg = JSON.parse(fs.readFileSync(configFromFilePath, 'utf8'));
		} catch {}
	}
	const cfg = {
		host: process.env.MYSQL_HOST || fileCfg.host || '42.121.253.186',
		port: Number(process.env.MYSQL_PORT || fileCfg.port || 3306),
		user: process.env.MYSQL_USER || fileCfg.user,
		password: process.env.MYSQL_PASSWORD || fileCfg.password,
		database: process.env.MYSQL_DATABASE || fileCfg.database,
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0
	};
	// 如标记为加密密码，则解密
	if (fileCfg.passwordEncrypted && fileCfg.password) {
		cfg.password = decryptPassword(fileCfg.password);
	}
	return cfg;
}

function assertBasicConfig(cfg) {
	if (!cfg.user || !cfg.password || !cfg.database) {
		throw new Error('数据库连接未配置完全，请设置 MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE 或在 db.config.json 中配置');
	}
}

async function getPool() {
	if (pool) return pool;
	const cfg = loadConfig();
	assertBasicConfig(cfg);
	pool = mysql.createPool(cfg);
	return pool;
}



async function query(sql, params) {
	const p = await getPool();
	const [rows] = await p.execute(sql, params);
	return rows;
}

module.exports = {
	getPool,
	query,
    decryptPassword
};


