import {config} from 'dotenv'; config();
import Outline from './outline_schema.js';
import Campaign from '../campaign/campaign_schema.js'
import MakeOutline from '../make-outline.js'
import Article from '../article/article_schema.js';
import {fetchData, convertToMilliseconds, convertTimestampToISOString, convertToTimestamp} from '../helper.js';
const articleService = process.env.ARTICLE_SERVICE;
//[post]/create-outline
export const createOutline = async (req, res) => {
	try
	{
		console.time('createOutline')
		let data = {
			parentId: req.body.parentId,
			tags: req.body.tags,
			platform: req.body.platform,
			order: req.body.order,
		}

		let campaign = await Campaign.findOne({_id: data.parentId}).lean()


		delete campaign.platforms
		delete campaign.outlineId
		delete campaign._id
		delete campaign.__v
		delete campaign.createdAt
		delete campaign.updatedAt

		const dataSet = campaign
		dataSet.parentId = data.parentId
		dataSet.tags = data.tags
		dataSet.platform = data.platform
		dataSet.name = campaign.name + ' - ' + data.platform

		let newOutline = new Outline(dataSet);
		const outline = await newOutline.save()
		if (!outline) throw new Error('E001o');

		let aDataSet = []
		let parent = newOutline
		// console.log('bash article', typeof parent.startDate, parent.startDate)
		let postTime = convertToMilliseconds(parent.postTime)
		let startDate = convertToTimestamp(parent.startDate.toISOString().split('T')[0])
		let countDay = 1
		const articles = []

		let articlesData = parent.frame
		for (const article of articlesData)
		{
			let day = countDay * (24 * 60 * 60 * 1000)
			let bookTimestamp = startDate + day + postTime
			countDay++
			article.parentId = parent._id
			article.platform = parent.platform
			article.bookDate = convertTimestampToISOString(bookTimestamp)
			articles.push(article)
		};
		const articleFrames = await Article.insertMany(articles)
		if (!articleFrames) throw new Error('E004c')
		Array.prototype.push.apply(aDataSet, articleFrames);

		//Tạo các article khi có yêu cầu
		/*editing*/
		if (!data.order)
		{
			let articles = aDataSet
			let url = articleService + '/bash'
			fetchData(url, articles)
		}
		console.timeEnd('createOutline')
		res.json({status: true, message: 'success', payload: outline});
	} catch (e)
	{
		console.log(e)
		console.timeEnd('createOutline')
		res.json({status: false, message: 'failure', payload: e.message});
	}
}
//[post]/outline/
export const listOutline = (req, res) => {
	Outline.find()
		.then(r => {
			res.json({status: true, message: 'success', payload: r});
		})
		.catch(e => {
			res.json({status: false, message: 'failure', payload: e.message});
		});
}

//[post]/trash-outline/
export const trashOutline = (req, res) => {
	Outline.find({deleted: true}, null, {withDeleted: true})
		.then(r => {
			res.json({status: true, message: 'success', payload: r});
		})
		.catch(e => {
			res.json({status: false, message: 'failure', payload: e.message});
		});
}

//[post]/read-outline/
export const readOutline = async (req, res) => {
	console.time('read outline')
	try
	{
		const outline = await Outline.findOne({_id: req.body.id})
		const articles = await Article.find({parentId: outline._id})
		console.timeEnd('read outline')
		res.json({
			status: true, message: 'success', payload: {
				outline, articles
			}
		});
	} catch (e)
	{
		console.timeEnd('read outline')
		res.json({status: false, message: 'failure', payload: e.message});
	}
}

//[post]/update-outline/
export const updateOutline = async (req, res) => {
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
				const outline = await Outline.updateOne({_id: req.body.id}, updateObject)
				if (outline.modifiedCount > 0)
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
				const outline = await Outline.updateOne({_id: req.body.id}, updateObject)
				if (outline.modifiedCount > 0)
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
			const outline = await Outline.updateOne({_id: req.body.id}, updateObject)
			if (outline.modifiedCount > 0)
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

//[post]/recycle-outline/
export const recycleOutline = async (req, res) => {
	try
	{
		const outline = await Outline.deleteById(req.body.id)
		if (outline.modifiedCount >= 1)
		{
			res.json({
				status: true, message: 'success', payload: req.body.id
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

//[post]/restore-outline/
export const restoreOutline = async (req, res) => {
	try
	{
		console.time('restoreOutline')
		const outline = await Outline.restore({_id: req.body.id})
		if (outline.modifiedCount >= 1)
		{
			console.timeEnd('restoreOutline', ':', req.body.id)
			res.json({
				status: true, message: 'success', payload: req.body.id
			});
		} else
		{
			throw new Error('khôi phục tài liệu thất bại')
		}
	} catch (e)
	{
		console.log('restoreOutline:', false)
		console.timeEnd('restoreOutline')
		res.json({status: false, message: 'failure', payload: e.message});
	}
}

//[post]/delete-outline/
export const deleteOutline = async (req, res) => {
	try
	{
		const outline = await Outline.deleteOne({id: req.body.id})
		if (outline.modifiedCount >= 1)
		{
			res.json({
				status: true, message: 'success', payload: req.body.id
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
