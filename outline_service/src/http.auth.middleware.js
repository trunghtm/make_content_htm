import User from './auth/user_schema.js';
import jwt from 'jsonwebtoken';
const secretKey = process.env.TOKEN_SECRET_KEY;

var decodeToken = async (token, secretKey) => {
	try
	{
		return jwt.verify(token, secretKey, {
			ignoreExpiration: true,
		});
	} catch (error)
	{
		console.log(`Error in decode access token: ${ error }`);
		return null;
	}
};

/**
 * Identify the user or request.
 * 
 * This function is intended to identify the user or request in the authentication middleware.
 * 
 * @returns {void}
 */
export async function id(req, res, next) {
	console.time('identify');
	const token = req.cookies._cook_1;
	const ref = req.cookies._cook_2;
	if (token)
	{
		const userId = await decodeToken(token, secretKey);
		req.__identify = {
			isCrew: true, token, ref, userId: userId.userId,
		};
	} else
	{
		req.__identify = {isCrew: false};
	}
	next();
	console.timeEnd('identify');
}

export function authorization(authRole, docType) {
	return async (req, res, next) => {
		console.time('authorization');
		try
		{
			const user = await User.findOne({_id: req.__identify.userId});
			req.__identify.userdata = user;
			const doc = await docType.findOne({_id: req.body.id}) || {};

			if (Object.keys(doc).length !== 0)
			{
				const permits = doc.specialPermit || [];
				if (permits.length > 0 && permits.includes(user.permit))
				{
					console.timeEnd('authorization');
					return next();
				}
			}

			const userLv = user.level || false;
			const docLv = doc.level || false;
			if (userLv && docLv && userLv >= docLv)
			{
				console.timeEnd('authorization');
				return next();
			}

			if (user.role === doc.role)
			{
				console.timeEnd('authorization');
				return next();
			}

			if (user.role !== authRole)
			{
				throw new Error('Forbidden');
			}

			console.timeEnd('authorization');
			next();

		} catch (e)
		{
			console.log(e);
			console.timeEnd('authorization');
			return res.status(403).json({
				status: false, message: 'failure', payload: 'E001atxh'
			});
		}
	};
}

export function notPublic(req, res, next) {
	console.time('private filter');
	if (req.__identify.isCrew)
	{
		console.timeEnd('private filter');
		return next();
	} else
	{
		res.redirect('/login');
		console.timeEnd('private filter');
	}
}
