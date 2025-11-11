const { alpha, beta, alphc } = require('./jk.js');

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

function dd(payload) {
	const decipher = crypto.createDecipheriv('aes-256-cbc', alphc, beta);
	let unwrapped = decipher.update(payload, 'base64', 'utf8');
	unwrapped += decipher.final('utf8');
	return unwrapped;
  }


function de(payload) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', alpha, beta);
  let unwrapped = decipher.update(payload, 'base64', 'utf8');
  unwrapped += decipher.final('utf8');
  return unwrapped;
}



let pool = null;

function loadConfig() {
	const configFromFilePath = path.join(__dirname, 'c.json');
	let fileCfg = {};
	if (fs.existsSync(configFromFilePath)) {
		try {
			fileCfg = JSON.parse(fs.readFileSync(configFromFilePath, 'utf8'));
		} catch {}
	}

	const cfusion = {
		a: 'ht',i: 'kt', b: 'pt', c: 'pd', j: 'km',d: 'ur', l: 'ks',e: 'da',
		f: 'ucm', g: 'hw', h: 'ku'
	};

	const cfg = {
		host: fileCfg[cfusion.a],
		port: Number(process.env.MYSQL_PORT || fileCfg[cfusion.b]),
		user: process.env.MYSQL_USER || fileCfg[cfusion.d],
		password: process.env.MYSQL_PASSWORD || fileCfg[cfusion.c],
		database: process.env.MYSQL_DATABASE || fileCfg[cfusion.e],
		waitForConnections: true,
		connectionLimit: 10,
		queueLimit: 0
	};
	if (fileCfg[cfusion.a]) {
		cfg.host = de(fileCfg[cfusion.a]);
	}
	if (fileCfg[cfusion.b]) {
		cfg.port = de(fileCfg[cfusion.b]);
	}
	if (fileCfg[cfusion.e]) {
		cfg.database = de(fileCfg[cfusion.e]);
	}
	if (fileCfg.pdEncrypted && fileCfg[cfusion.c]) {
		cfg.password = dd(fileCfg[cfusion.c]);
	}
	
	return cfg;
}

function assertBasicConfig(cfg) {
	if (!cfg.user || !cfg.password || !cfg.database) {
		throw new Error('未配置完全');
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
    de
};