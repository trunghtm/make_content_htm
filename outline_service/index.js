import express from 'express';
const app = express();

import cors from 'cors';
import cookieParser from 'cookie-parser';

import {config} from 'dotenv'; config();

import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import route from './src/route.js';
import Database_Connect from './src/db.js';

//kết nối data base
Database_Connect.atlas()

//app Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(cookieParser());
app.use((req, res, next) => {
	const forwarded = req.headers['x-forwarded-for'];
	const ip = forwarded ? forwarded.split(/, /)[0] : req.ip;
	console.log(`[${ ip }] ${ req.method } ${ req.originalUrl }`)
	req.clientIp = ip; // Lưu địa chỉ IP vào đối tượng req để sử dụng sau này
	next()
});
// Cấu hình thư mục public làm mặc định cho các tệp tĩnh
/**
 * chú úy không để đường dẫn static trùng với route
 */
app.use(express.static(path.join(__dirname, 'public')));

// Sử dụng route từ file route.js 
route(app)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`----\nOutline service is running on http://localhost:${ PORT }`);
});


