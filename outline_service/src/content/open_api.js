import OpenAI from "openai";
import {config} from 'dotenv'; config();
const openapiKey = process.env.OPEN_API_KEY;
const openai = new OpenAI({
	apiKey: openapiKey
});

const facebook = async (articleFrame) => {
	try
	{
		console.time('process')
		const headings = articleFrame['headings'].join(',')
		const keywords = articleFrame['keywords'].join(',')
		// console.log("message:",articleFrame, typeof articleFrame);
		let message = `hãy tạo một bài viết chuẩn seo với topic: "${ articleFrame['topic'] }",
		nội dung "${ articleFrame['content'] }", bao gồm các headings: ${ headings },
		bao gồm các keyword: ${ keywords }, bài viết phù hợp đăng trên nền tảng ${ articleFrame['platform'] },
		kết quả trả về dưới định dạng văn bản, kết hợp các cấp tiêu đề để người đọc dễ theo dõi,
		chỉ trả kết quả không cần các lời giới thiệu hay xã giao.`;

		let response = await openai.chat.completions.create({
			messages: [{role: "developer", content: message}],
			model: "gpt-4o",
		})

		let result = response.choices[0].message.content
		console.timeEnd('process')
		return result

	} catch (error)
	{
		console.log(error.message)
		console.timeEnd('process')
		return false
	}
}

const ads = async (formData) => {
	console.log('make ads content inprogress...')
	try
	{
		console.time('make ads content')
		let tone = ['Đáng tin cậy, chuyên gia', 'Gần gũi, đời thường', 'Hài hước, viral', 'Cảm xúc, chạm vào nỗi đau khách hàng', 'Chuyên nghiệp', 'Trang trọng', 'Khách quan', 'Hào hứng', 'Kinh ngạc', 'Cảnh báo', 'Vui vẻ', 'Thân thiện'];

		// Tạo prompt từ dữ liệu form
		let prompt = ` Hãy tạo một content quảng cáo với các thông tin sau:

Mục tiêu: ${ formData.campaignInfo.target.join(', ') } ${ formData.campaignInfo.targetOther };
Nền tảng: ${ formData.campaignInfo.platform };

Đối tượng mục tiêu:
- Độ tuổi: ${ formData.customerInfo.age };
- Giới tính: ${ formData.customerInfo.gender === '0' ? 'Nam' : formData.customerInfo.gender === '1' ? 'Nữ' : 'Mọi giới tính' };
- Khu vực: ${ formData.customerInfo.location };
- Nhu cầu: ${ formData.customerInfo.needs };
- Insight: ${ formData.customerInfo.insight };

Yêu cầu nội dung:
- Loại nội dung: ${ formData.contentInfo.type == 'ot' ? formData.contentInfo.otherType : formData.contentInfo.type }
- Tone giọng: ${ formData.contentInfo.tone == '99' ? formData.contentInfo.toneOther : tone[Number(formData.contentInfo.tone)] }
- Áp dụng công thức: ${ formData.preferences.formula },nhưng không phân tích công thức.
- Ngôn ngữ: ${ formData.preferences.language }

Thông điệp chính:
${ formData.keyMessages.features }

Điểm khác biệt (USP):
${ formData.keyMessages.usp }

Ưu đãi:
${ formData.keyMessages.promotion }

CTA:
${ formData.keyMessages.cta }

Từ khóa cần có:
${ formData.additionalInfo.keywords }

Điểm cần tránh:
${ formData.additionalInfo.avoidPoints };
${ formData.preferences.useEmoji ? '- Sử dụng emoji phù hợp, đánh dấu đầu câu bằng icon phù hợp' : '' }${ formData.preferences.useKol ? `- Viết theo phong cách của ${ formData.preferences.kolName }\n` : '' }${ formData.preferences.useDrama ? '- Tích hợp yếu tố drama/câu chuyện\n' : '' }${ formData.preferences.otherRequests }.${ formData.preferences.multiVersion ? '- Tạo 2 phiên bản để A/B test\n kết quả trả về dạng json {"0":"bài viết a","1":"bài viết b"}' : '' } tiêu đề bài viết ở dạng uppercase`;
		let system = 'bạn là một content creator, Bạn chỉ trả lời và không tham gia hội thoại.'
		console.log(prompt)
		let response = await openai.chat.completions.create({
			messages: [{
				role: "system", content: system
			}, {
				role: "user", content: prompt
			}],
			model: "gpt-4o-mini",
			temperature: 0.2,
		})
		// let response = await openai.chat.completions.create({
		// 	prompt: system + prompt,
		// 	model: "davinci-002",
		// })

		let text = response.choices[0].message.content
		console.timeEnd('make ads content')
		return text;

	} catch (error)
	{
		console.error('Error generating ads content:', error);
		console.timeEnd('make ads content')
		return false;
	}
}
const w_OpenAI = {
	facebook, ads
}
export default w_OpenAI

