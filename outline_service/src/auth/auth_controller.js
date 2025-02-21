import {config} from 'dotenv'; config();
import User from './user_schema.js';
import {fetchData, convertTimestampToISOString, convertToMilliseconds, convertToTimestamp} from '../helper.js';
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import jwt from 'jsonwebtoken'

const articleService = process.env.ARTICLE_SERVICE;
const secretKey = process.env.TOKEN_SECRET_KEY;
//[Get]/login
export const login = async (req, res) => {
	try
	{//outline_service\public\components\login.html
		res.sendFile(path.join(__dirname, '../../public/components/login.html'))
	} catch (e)
	{
		console.log(e)
		res.json({status: false, message: 'failure', payload: e.message});
	}
}


//[post]/authentication
export const authentication = async (req, res) => {
	try
	{
		console.time('authentication')
		const userName = req.body.username;
		const password = req.body.password;
		
		const user = await User.findOne({userName, password}); // Tìm người dùng với tài khoản và mật khẩu 
		if (!user)
			{
			console.timeEnd('authentication')
			return res.status(401).json({status: false, message: 'failure', payload:'E001at'});
		}
		// Tạo JWT
		const token = jwt.sign({userId: user._id}, secretKey, {expiresIn: '1h'});
		const ref = jwt.sign({userId: user._id}, secretKey, {expiresIn: '35d'});
		// Lưu JWT vào cookies
		res.cookie('_cook_1', token, {httpOnly: true});
		res.cookie('_cook_2', ref, {httpOnly: true});
		// Chuyển hướng đến trang '/'
		res.json({status: true, message: 'success', payload: req.cookies._cook_3})
		console.timeEnd('authentication')
	} catch (e)
	{
		console.log(e)
		res.json({status: false, message: 'failure', payload:'E002at'})
		console.timeEnd('authentication')
	}
}