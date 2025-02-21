import OpenAI from "openai";
import {GoogleGenerativeAI} from "@google/generative-ai";

import {config} from 'dotenv'; config();
const openapiKey = process.env.OPEN_API_KEY;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const openai = new OpenAI({
	apiKey: openapiKey
});

const w_OpenAI = async (data) => {
	// const outline = {
	// 	name: r.name,
	// 	parentId: r._id,
	// 	topic: r.topic,
	// 	role: r.role,
	// 	tags: r.tags,
	// 	platform: 'facebook',
	// 	articleQty: r.articleNo,
	// 	startDate: r.startDate,
	// 	endDate: r.endDate,
	// }
	let bus = 'kinh doanh sữa bột'
	let pre = `bạn là một content creater ngành ${ bus }, bạn hãy đưa ra khung chương trình cho ${ data.articleQty } bài viết về chủ đề `
	let resultFormat = `;hãy trả về kết quả dưới dạng json, với template như sau:{
		"topic": "topic",
		"headings": ["heading1", "heading2", "Heading3"],
		"keywords": ["keyword1", "keyword2", "keyword3"]
		}, để đảm bảo tiết kiệm token hãy chỉ trả kết quả, bỏ qua các lời giới thiệu hay xã giao`;
	let message = pre + data.topic + resultFormat;
	try
	{
		let result = await openai.chat.completions.create({
			messages: [{role: "developer", content: message}],
			model: "gpt-3.5-turbo",
		});
		let text = result.choices[0].message.content
		if (text.includes('```json\n'))
		{
			text = text.replace('```json\n', '');
			text = text.replace('```', '');
		}
		if (text.includes('```json'))
		{
			text = text.replace('```json', '');
			text = text.replace('```', '');
		}

		let articles = data.articleQty <= 1 ? '[' + text + ']' : text
		articles = JSON.parse(articles)
		return articles
	} catch (error)
	{
		console.log('make outline with open api:\n', error)
		return false
	}
}

const w_Gemini = async (data) => {
	// const outline = {
	// 	name: r.name,
	// 	parentId: r._id,
	// 	topic: r.topic,
	// 	role: r.role,
	// 	tags: r.tags,
	// 	platform: 'facebook',
	// 	articleQty: r.articleNo,
	// 	startDate: r.startDate,
	// 	endDate: r.endDate,
	// }
	let bus = 'kinh doanh sữa bột'
	let pre = `bạn là một content creater ngành ${ bus }, bạn hãy đưa ra khung chương trình cho ${ data.articleQty } bài viết về chủ đề `
	let resultFormat = `;hãy trả về kết quả dưới dạng json, với template như sau:{
		"topic": "topic",
		"headings": ["heading1", "heading2", "Heading3"],
		"keywords": ["keyword1", "keyword2", "keyword3"]
		}, chỉ trả kết quả không nói gì thêm`;
	let message = pre + data.topic + resultFormat;
	try
	{

		const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});

		const prompt = message;

		const result = await model.generateContent(prompt);

		let text = result.response.text()
		if (text.includes('```json\n'))
		{
			text = text.replace('```json\n', '');
			text = text.replace('```', '');
		}
		if (text.includes('```json'))
		{
			text = text.replace('```json', '');
			text = text.replace('```', '');
		}

		let articles = data.articleQty <= 1 ? '[' + text + ']' : text
		articles = JSON.parse(articles)
		return articles
	} catch (error)
	{
		console.log('make outline with open api:\n', error)
		return false
	}
}

const MakeOutline = {
	w_OpenAI,
	w_Gemini
}
export default MakeOutline

