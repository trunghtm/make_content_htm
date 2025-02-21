import {GoogleGenerativeAI} from "@google/generative-ai";
import {config} from 'dotenv'; config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const facebook = async (articleFrame) => {
	try
	{
		console.time('make article')
		const headings = articleFrame['headings'].join(',')
		const keywords = articleFrame['keywords'].join(',')
		// console.log("message:",articleFrame, typeof articleFrame);
		let message = `hãy tạo một bài viết chuẩn seo với topic: "${ articleFrame['topic'] }",
		nội dung "${ articleFrame['content'] }", bao gồm các headings: ${ headings },
		bao gồm các keyword: ${ keywords }, bài viết phù hợp đăng trên nền tảng ${ articleFrame['platform'] }, 
		kết quả trả về dưới định dạng văn bản, kết hợp các cấp tiêu đề để người đọc dễ theo dõi,
		chỉ trả kết quả không cần các lời giới thiệu hay xã giao.`;


		const model = genAI.getGenerativeModel({model: "gemini-2.0-flash-exp"});

		const prompt = message;

		const result = await model.generateContent(prompt);

		let text = result.response.text()
		console.timeEnd('make article')
		return text

	} catch (error)
	{
		console.log(error.message)
		console.timeEnd('make article')
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
		let prompt = `bạn là một content creator dày dặn kinh nghiệm, chuyên gia viết những content marketing thu hút và tỷ lệ chuyển đổi cao, Hãy tạo một content quảng cáo với các thông tin sau:

Mục tiêu: ${ formData.campaignInfo.target.join(', ') } ${ formData.campaignInfo.targetOther };
Nền tảng: ${ formData.campaignInfo.platform };

Đối tượng mục tiêu:
- Độ tuổi: ${ formData.customerInfo.age };
- Giới tính: ${ formData.customerInfo.gender === '0' ? 'Nam' : formData.customerInfo.gender === '1' ? 'Nữ' : 'Mọi giới tính' };
- phù hợp với văn hóa khu vực: ${ formData.customerInfo.location };
- Nhu cầu: ${ formData.customerInfo.needs };
- Insight: ${ formData.customerInfo.insight };

Yêu cầu nội dung:
- Loại nội dung: ${ formData.contentInfo.type == 'ot' ? formData.contentInfo.otherType : formData.contentInfo.type}
- Tone giọng: ${formData.contentInfo.tone == '99' ? formData.contentInfo.toneOther : tone[Number(formData.contentInfo.tone)] }
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
${ formData.preferences.useEmoji ? '- Sử dụng emoji phù hợp, đánh dấu đầu câu bằng icon phù hợp' : '' }${ formData.preferences.multiVersion ? '- Tạo 2 phiên bản để A/B test\n kết quả trả về dạng json {"0":"bài viết a","1":"bài viết b"}' : '' }${ formData.preferences.useKol ? `- Viết theo phong cách của ${ formData.preferences.kolName }\n` : '' }${ formData.preferences.useDrama ? '- Tích hợp yếu tố drama/câu chuyện\n' : '' }${ formData.preferences.otherRequests }
,chỉ trả kết quả không nói gì thêm, không dùng **.`;
		console.log('prompt:', prompt)
		const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});
		const result = await model.generateContent(prompt);
		const text = result.response.text();
		if (!text)
		{
			throw new Error(text);
		}
		console.timeEnd('make ads content')
		return text;

	} catch (error)
	{
		console.error('Error generating ads content:', error);
		console.timeEnd('make ads content')
		return false;
	}
}

const w_Gemini = {
	facebook, ads
}
export default w_Gemini

