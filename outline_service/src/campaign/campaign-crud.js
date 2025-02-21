import {config} from 'dotenv'; config();
import Campaign from './campaign_schema.js';
import Outline from '../outline/outline_schema.js';
import MakeOutline from '../make-outline.js'
import Article from '../article/article_schema.js';
import {fetchData, convertTimestampToISOString, convertToMilliseconds, convertToTimestamp} from '../helper.js';
const articleService = process.env.ARTICLE_SERVICE;
//[post]/create-campaign
export const createCampaign = async (req, res) => {
	try
	{
		let data = {
			name: req.body.name,
			topic: req.body.topic,
			role: req.body.role,
			tags: req.body.tags,
			postTime: req.body.postTime,
			startDate: req.body.startDate,
			endDate: req.body.endDate,
			articleQty: req.body.articleQty,
			platforms: req.body.platforms,
			order: req.body.order,
			department: req.__identify.userdata.department
		}
		let articles = await MakeOutline.w_Gemini(data)
		if (articles)
		{
			data.frame = articles
		}
		let newCampaign = new Campaign(data);
		const campaign = await newCampaign.save()
		if (!campaign) throw new Error('E001c');

		//tạo các outline nếu được yêu cầu
		let dataSet = []
		if (data.platforms.length > 0)
		{
			for (const element of data.platforms)
			{
				const outline = new Outline({
					name: campaign.name + '_' + element,
					parentId: campaign._id,
					topic: campaign.topic,
					role: campaign.role,
					tags: campaign.tags,
					frame: campaign.frame,
					platform: element,
					postTime: data.postTime,
					articleQty: campaign.articleQty,
					startDate: campaign.startDate,
					endDate: campaign.endDate,
				})

				let thisOutline = await outline.save()
				if (!thisOutline) throw new Error('E002c')

				let parent = thisOutline
				// console.log('bash article', typeof parent.startDate, parent.startDate)
				let postTime = convertToMilliseconds(parent.postTime)
				let startDate = convertToTimestamp(parent.startDate.toISOString().split('T')[0])
				let countDay = 0
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
				Array.prototype.push.apply(dataSet, articleFrames);
			};
		}
		else
		{
			throw new Error('E003c')
		}
		//Gửi dữ liệu sang service tạo content cho article nếu được yêu cầu
		if (!data.order)
		{
			let url = articleService + '/bash'
			fetchData(url, dataSet)
		}
		res.json({status: true, message: 'success', payload: campaign});
	} catch (e)
	{
		console.log(e)
		res.json({status: false, message: 'failure', payload: e.message});
	}
}
//[post]/campaign/
export const listCampaign = (req, res) => {
	console.time('list campaign')
	console.log(req.__identify.userdata.department)
	Campaign.find({department: req.__identify.userdata.department})
		.then(r => {
			console.timeEnd('list campaign')
			res.json({status: true, message: 'success', payload: r});
		})
		.catch(e => {
			console.timeEnd('list campaign')
			res.json({status: false, message: 'failure', payload: e.message});
		});
}

//[post]/trash-campaign/
export const trashCampaign = (req, res) => {
	Campaign.find({deleted: true}, null, {withDeleted: true})
		.then(r => {
			res.json({status: true, message: 'success', payload: r});
		})
		.catch(e => {
			res.json({status: false, message: 'failure', payload: e.message});
		});
}

//[post]/read-campaign/
export const readCampaign = async (req, res) => {
	console.time('read campaign:')
	try
	{
		const campaign = await Campaign.findOne({_id: req.body.id})
		const outlines = await Outline.find({parentId: campaign._id})
		console.timeEnd('read campaign:')
		res.json({
			status: true, message: 'success', payload: {
				campaign, outlines
			}
		});
	} catch (e)
	{
		console.timeEnd('read campaign:')
		res.json({status: false, message: 'failure', payload: e.message});
	}
}

//[post]/update-campaign/
export const updateCampaign = async (req, res) => {
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
				const campaign = await Campaign.updateOne({_id: req.body.id}, updateObject)
				if (campaign.modifiedCount > 0)
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
				const campaign = await Campaign.updateOne({_id: req.body.id}, updateObject)
				if (campaign.modifiedCount > 0)
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
			const campaign = await Campaign.updateOne({_id: req.body.id}, updateObject)
			if (campaign.modifiedCount > 0)
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

//[post]/recycle-campaign/
export const recycleCampaign = async (req, res) => {
	try
	{
		const campaign = await Campaign.deleteById(req.body.id)
		if (campaign.modifiedCount >= 1)
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

//[post]/restore-campaign/
export const restoreCampaign = async (req, res) => {
	try
	{
		console.time('restoreCampaign')
		const campaign = await Campaign.restore({_id: req.body.id})
		if (campaign.modifiedCount >= 1)
		{
			console.timeEnd('restoreCampaign', ':', req.body.id)
			res.json({
				status: true, message: 'success', payload: req.body.id
			});
		} else
		{
			throw new Error('khôi phục tài liệu thất bại')
		}
	} catch (e)
	{
		console.log('restoreCampaign:', false)
		console.timeEnd('restoreCampaign')
		res.json({status: false, message: 'failure', payload: e.message});
	}
}

//[post]/delete-campaign/
export const deleteCampaign = async (req, res) => {
	try
	{
		const campaign = await Campaign.deleteOne({id: req.body.id})
		if (campaign.modifiedCount >= 1)
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
