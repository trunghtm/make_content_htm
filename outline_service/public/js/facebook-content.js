function getPromptGenForm() {
	try
	{
		// prompt-generator-form.html
		rp.fetchOne('prompt-generator-form', {}, 'content-box');
	} catch (error)
	{
		console.error('Error fetching component failure:', error);
	}
}
rp.bindScript('getPromptGenForm', getPromptGenForm)

function generatePrompt() {
	startLoading();
	const formData = collectFormData();

	fetch('/article/make-ads', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(formData)
	}).then(response => response.json())
		.then(data => {
			console.log(data);
			if (data.status === false)
			{
				stopLoading()
				alert('Có lỗi xảy ra, vui lòng thử lại sau');
				return
			}
			let result = data.payload;
			if (result.includes('```json'))
			{
				result = result.replace('```json', '');
				result = result.replace('```', '');
				let json = JSON.parse(result);
				let articles = []
				for (let key in json)
				{
					let result = {
						version: key,
						result: json[key].replace(/(?:\r\n|\r|\n)/g, '<br>')
					}
					articles.push(result)
				}
					rp.fetchChain('prompt-generator-result', articles, 'result-container');
			} else
			{
				result = result.replace(/(?:\r\n|\r|\n)/g, '<br>')
				rp.fetchOne('prompt-generator-result', {version: '0', result}, 'result-container');
			}
			stopLoading()
		})
		.catch(error => {
			stopLoading()
			console.error('Error:', error);
		});
}
rp.bindScript('generatePrompt', generatePrompt)

function getContentGenForm() {
	try
	{
		// prompt-generator-form.html
		rp.putOne('prompt-generator-form');
	} catch (error)
	{
		console.error('Error fetching component failure:', error);
	}
}
rp.bindScript('getContentGenForm', getContentGenForm)


// Collect form data
function collectFormData() {
	return {
		campaignInfo: {
			name: document.getElementById('ads-campaign')?.value,
			target: Array.from(document.getElementById('ads-target')?.selectedOptions || [])
				.map(option => option.value),
			targetOther: document.getElementById('ads-target-other')?.value,
			platform: document.getElementById('ads-target-platform')?.value
		},
		customerInfo: {
			age: document.getElementById('ads-customer-age')?.value,
			gender: document.getElementById('ads-customer-gender')?.value,
			location: document.getElementById('ads-location')?.value,
			needs: document.getElementById('ads-needs')?.value,
			insight: document.getElementById('ads-insight')?.value
		},
		contentInfo: {
			type: document.getElementById('ads-type')?.value,
			otherType: document.getElementById('ads-type-other')?.value,
			tone: document.getElementById('ads-tone')?.value,
			toneOther: document.getElementById('ads-tone-other')?.value
		},
		keyMessages: {
			features: document.getElementById('ads-feature')?.value,
			usp: document.getElementById('ads-USP')?.value,
			promotion: document.getElementById('ads-sale')?.value,
			cta: document.getElementById('ads-CTA')?.value
		},
		additionalInfo: {
			keywords: document.getElementById('ads-keywords')?.value,
			avoidPoints: document.getElementById('ads-avoid')?.value,
			referenceLink: document.getElementById('ads-ref-link')?.value
		},
		preferences: {
			formula: document.getElementById('ads-formula')?.value,
			language: document.getElementById('ads-language')?.value,
			useEmoji: document.getElementById('ads-emoji')?.checked,
			multiVersion: document.getElementById('ads-multiversion')?.checked,
			useKol: document.getElementById('ads-isKol')?.checked,
			kolName: document.getElementById('ads-kol-name')?.value,
			useDrama: document.getElementById('ads-example')?.checked,
			otherRequests: document.getElementById('ads-other-requests')?.value
		}
	};
}

// ...existing code...

function fillSampleData() {
	// Danh sách các cặp id và giá trị mẫu
	const sampleData = {
		'ads-campaign': 'Chiến dịch quảng cáo chitose Q1/2025',
		'ads-target-other': 'Tăng tương tác với khách hàng',
		'ads-customer-age': '40',
		'ads-location': 'Nam bộ',
		'ads-needs': 'Khách hàng đang cần 1 loại sữa bột cho người lớn tuổi, dùng được cho bệnh nhân tiểu đường, uy tín chất lượng cao',
		'ads-insight': 'Người tiêu dùng ngày càng quan tâm đến chất lượng cuộc sống và sức khỏe của bản thân',
		'ads-type-other': '',
		'ads-tone-other': 'Thông điệp mang tính giáo dục',
		'ads-feature': '- Tên sản phẩm: chitose\n- Loại : sữa bột dinh dưỡng\n- Dùng cho người trên 40 tuổi, mất ngủ, đau xương khớp\n- thành phần thiên nhiên\n-Nguyên liệu và công nghê liên doanh với Nhật bản , công nghệ Lipisperse\n- tăng cường đề kháng\n- chất lượng đạt chuẩn FDA',
		'ads-USP': 'Công nghệ Lipisperse liên doanh nhật bản, sữa non colostrum, đông trùng hạ thảo, thành phần Kollagen II-XS, Chiết xuất Lạc Tiên, Hoạt chất Go2ka1, Hoạt chất levagen+ , sữa dùng được cho người bị dị ứng với sữa tươi.',
		'ads-sale': '- Giảm 20% cho đơn hàng đầu tiên, cam kết hoàn tiền nếu có thành phần độc hại',
		'ads-CTA': 'Đăng ký ngay - Nhận ưu đãi độc quyền',
		'ads-keywords': 'chất lượng cao, giá tốt, uy tín, chuyên nghiệp',
		'ads-avoid': '- Không so sánh trực tiếp với đối thủ\n- Tránh từ ngữ tiêu cực\n- Không đề cập đến giá cụ thể',
		'ads-ref-link': 'https://chitose.vn',
		'ads-kol-name': 'hoàng linh',
		'ads-other-requests': 'Tập trung vào tính năng độc đáo của sản phẩm, để lại số điện thoại liên hệ, tiêu đề thu hút ngay từ đầu',
	};

	// Điền dữ liệu vào các trường
	Object.entries(sampleData).forEach(([id, value]) => {
		const element = document.getElementById(id);
		if (element)
		{
			element.value = value;
		}
	});

	console.log('Đã điền dữ liệu mẫu vào form');
}

rp.bindScript('fillSampleData', fillSampleData);
