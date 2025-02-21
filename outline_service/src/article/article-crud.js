import {config} from 'dotenv'; config();
import Article from './article_schema.js';
import MakeArticle from '../content/make_content.js';
import {fetchData,convertTimestampToISOString, convertToMilliseconds, convertToTimestamp} from '../helper.js'
const articleService = process.env.ARTICLE_SERVICE;


//[post]/make-ads
export const make_article = async (req, res) => {
	console.time('make article')
	try
	{
		const articleData = req.body

		let text = await MakeArticle.w_Gemini.ads(articleData)
		// let text = await MakeArticle.w_OpenAI.ads(articleData)
		if (!text)
		{
			throw new Error('E0001',text)
		}
		console.timeEnd('make article')
		res.json({status: true, message: 'success', payload: text});
	} catch (e)
	{
		console.log(e)
		console.timeEnd('make article')
		res.json({status: false, message: 'failure', payload: 'error'});
	}
}
//[post]/create-article
export const createArticle = (req, res) => {
	let article = new Article(req.body);
	article.save()
		.then(r => {
			res.json({status: true, message: 'success', payload: r});
		})
		.catch(e => {
			res.json({status: false, message: 'failure', payload: e.message});
		});
}

//[post]/bash
export const bashArticle = async (req, res) => {
	try
	{

		let parent = req.body.outline
		// console.log('bash article', typeof parent, parent)
		let portTime = convertToMilliseconds(parent.portTime)
		let startDate = convertToTimestamp(parent.startDate.split('T')[0])
		let countDay = 1
		let articlesData = req.body.articles
		const articles = []
		for (const article of articlesData)
		{
			let day = countDay * (24 * 60 * 60 * 1000)
			let bookTimestamp = startDate + day + portTime
			countDay++
			article.parentId = parent._id
			article.platform = parent.platform
			article.bookDate = convertTimestampToISOString(bookTimestamp)
			articles.push(article)
		};

		const articleFrames = await Article.insertMany(articles)
		const articleReq = articleFrames.length
		let makeContentSuccess = 0
		for (const frame of articleFrames)
		{
			let text = await MakeArticle.w_OpenAI(frame)
			let result = await Article.updateOne({_id: frame._id}, {content: text})
			if (result)
			{
				makeContentSuccess += 1
			}
		};

		res.json({status: true, message: 'success', payload: `result: ${ makeContentSuccess }/${ articleReq }`});
	} catch (e)
	{
		console.log(e)
		res.json({status: false, message: 'failure', payload: 'error'});
	}
}

//[post]/article/
export const listArticle = (req, res) => {
	Article.find({parentId: req.body.id})
		.then(r => {
			res.json({status: true, message: 'success', payload: r});
		})
		.catch(e => {
			res.json({status: false, message: 'failure', payload: e.message});
		});
}

//[post]/read-article/
export const readArticle = async (req, res) => {
	try
	{
		const article = await Article.findOne({id: req.body.id})
		res.json({
			status: true, message: 'success', payload: article
		});
	} catch (e)
	{
		res.json({status: false, message: 'failure', payload: e.message});
	}
}

//[post]/update-article/
export const updateArticle = async (req, res) => {
	try
	{
		let prop = req.body.prop
		let value = req.body.value
		let action = req.body.action
		if (value.isArray())
		{
			//update khi value là một giá trị nằm trong mảng
			if (action == 'add')
			{
				const updateObject = {$push: {[prop]: value}};
				const article = await Article.updateOne({_id: req.body.id}, updateObject)
				if (article.modifiedCount > 0)
				{
					res.json({
						status: true, message: 'success', payload: ''
					});
				}
				else
				{
					throw 'update failure'
				}
			} else
			{
				const updateObject = {$pull: {[prop]: value}};
				const article = await Article.updateOne({_id: req.body.id}, updateObject)
				if (article.modifiedCount > 0)
				{
					res.json({
						status: true, message: 'success', payload: ''
					});
				}
				else
				{
					throw 'update failure'
				}
			}

		} else
		{
			// update khi value là thuộc tính đon nhất
			const updateObject = {};
			updateObject[prop] = value;
			const article = await Article.updateOne({_id: req.body.id}, updateObject)
			if (article.modifiedCount > 0)
			{
				res.json({
					status: true, message: 'success', payload: ''
				});
			}
			else
			{
				throw 'update failure'
			}
		}
	} catch (e)
	{
		res.json({status: false, message: 'failure', payload: e.message});
	}
}

//[post]/recycle-article/
export const recycleArticle = async (req, res) => {
	try
	{
		const article = await Article.deleteById(req.body.id)
		if (article.deleted)
		{
			res.json({
				status: true, message: 'success', payload: ''
			});
		} else
		{
			throw new Error('xóa tài liệu thất bại')
		}
	} catch (e)
	{
		res.json({status: false, message: 'failure', payload: e.message});
	}
}

//[post]/delete-article/
export const deleteArticle = async (req, res) => {
	try
	{
		const article = await Article.deleteOne({id: req.body.id})
		if (article.deleted)
		{
			res.json({
				status: true, message: 'success', payload: ''
			});
		} else
		{
			throw new Error('xóa tài liệu thất bại')
		}
	} catch (e)
	{
		res.json({status: false, message: 'failure', payload: e.message});
	}
}
