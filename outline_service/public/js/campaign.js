//-----------------------------
//script of campaign here
function getCampaignForm() {
	try
	{
		if (STATE.forming)
		{
			alert("Không thể tiến hành thao tác, Có thao tác khác đang thực thi")
			return
		};
		rp.putOne('create-campaign-form');
	} catch (error)
	{
		console.error('Error fetching component failure:', error);
	}
}
rp.bindScript('getCampaignForm', getCampaignForm)

async function getCampaigns() {
	document.cookie = `_cook_3=${ window.location }`
	const response = await fetch('/campaign', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({})
	})
	if (response)
	{
		const contentType = response.headers.get('content-type');
		if (contentType && contentType.includes('application/json'))
		{
			return response.json();
		} else (contentType && contentType.includes('text/html'))
		{
			if (response.url.includes('/login'))
			{
				// nếu nhận dược yêu cầu đăng nhập thì chuyển hướng
				window.location = response.url
			} else
			{
				//nếu không phải yêu cầu đăng nhập thì là lỗi
				return {status: false}
			}
		}
	}
}

async function listCampaign() {
	const data = await getCampaigns()
	if (data.status === false)
	{
		console.log(data.message, data.payload)
		return
	}
	//thêm tiêu đề trên layout
	const result = data.payload
	setState({
		class: 'list',
		name: 'Campaign',
		child: 'Campaign',
	})

	//thêm script cho nút quay lại
	const backBtn = document.getElementById('back-btn')
	backBtn.setAttribute('invoker-spell', '')
	backBtn.setAttribute('invoker-tail', '')
	let btnClasses = backBtn.classList.value
	const viewTableBtn = document.getElementById('view-table-btn')
	const viewListBtn = document.getElementById('view-list-btn')
	viewListBtn.setAttribute('invoker-spell', 'listCampaign')
	viewTableBtn.setAttribute('invoker-spell', 'tableCampaign')

	if (!btnClasses.includes('hidden')) backBtn.classList.add('hidden');

	if (result.length > 0)
	{
		const campaigns = []
		for (i = 0;i < result.length;i++)
		{
			let campaign = {
				id: result[i]._id,
				title: result[i].name,
				topic: result[i].topic,
				startDate: formatDateString(result[i].startDate),
				endDate: formatDateString(result[i].endDate),
				isCompleted: result[i].isCompleted ? '--active' : '--inactive',
				isEnded: result[i].isEnded > 0 ? '--active' : '--inactive',
			}
			campaigns.push(campaign)
		}
		rp.fetchChain('campaign-list-item', campaigns, 'content-box')
	} else
	{
		rp.fetchOne('campaign-list-empty', {}, 'content-box')
	}
}
rp.bindScript('listCampaign', listCampaign)


async function diagramCampaign() {
	const data = await getCampaigns()
	if (data.status === false)
	{
		console.log(data.message, data.payload)
		return
	}
	//thêm tiêu đề trên layout
	const result = data.payload
	setState({
		class: 'list',
		name: 'Campaign',
		child: 'Campaign',
	})

	//thêm script cho nút quay lại
	const backBtn = document.getElementById('back-btn')
	backBtn.setAttribute('invoker-spell', '')
	backBtn.setAttribute('invoker-tail', '')
	let btnClasses = backBtn.classList.value
	const viewTableBtn = document.getElementById('view-table-btn')
	const viewListBtn = document.getElementById('view-list-btn')
	viewListBtn.setAttribute('invoker-spell', 'listCampaign')
	viewTableBtn.setAttribute('invoker-spell', 'tableCampaign')

	if (!btnClasses.includes('hidden')) backBtn.classList.add('hidden');

	if (result.length > 0)
	{
		const campaigns = []
		for (i = 0;i < result.length;i++)
		{
			let campaign = {
				id: result[i]._id,
				title: result[i].name,
				topic: result[i].topic,
				startDate: formatDateString(result[i].startDate),
				endDate: formatDateString(result[i].endDate),
				isCompleted: result[i].isCompleted ? '--active' : '--inactive',
				isEnded: result[i].isEnded > 0 ? '--active' : '--inactive',
			}
			campaigns.push(campaign)
		}
		console.log(campaigns[0])
		rp.fetchOne('diagram', campaigns[0], 'content-box')
	} else
	{
		rp.fetchOne('campaign-list-empty', {}, 'content-box')
	}
}
listCampaign()
// diagramCampaign()
rp.bindScript('listCampaign', listCampaign)

async function tableCampaign() {
	const data = await getCampaigns()
	STATE.viewMode = 'table'
	if (data.status === false)
	{
		console.log(data.message, data.payload)
		return
	}
	//thêm tiêu đề trên layout
	const result = data.payload
	setState({
		class: 'list',
		name: 'Campaign',
		child: 'Campaign',
	})

	//thêm script cho nút quay lại
	const backBtn = document.getElementById('back-btn')
	backBtn.setAttribute('invoker-spell', '')
	backBtn.setAttribute('invoker-tail', '')
	let btnClasses = backBtn.classList.value

	const viewTableBtn = document.getElementById('view-table-btn')
	const viewListBtn = document.getElementById('view-list-btn')
	viewListBtn.setAttribute('invoker-spell', 'listCampaign')
	viewTableBtn.setAttribute('invoker-spell', 'tableCampaign')

	if (!btnClasses.includes('hidden')) backBtn.classList.add('hidden');

	if (result.length > 0)
	{
		const campaigns = []
		for (i = 0;i < result.length;i++)
		{
			let campaign = {
				id: result[i]._id,
				title: result[i].name,
				topic: result[i].topic,
				startDate: formatDateString(result[i].startDate),
				endDate: formatDateString(result[i].endDate),
				isCompleted: result[i].isCompleted ? '--active' : '--inactive',
				isEnded: result[i].isEnded > 0 ? '--active' : '--inactive',
			}
			campaigns.push(campaign)
		}
		rp.fetchOne('campaign-table-frame', {}, 'content-box')
		setTimeout(rp.putChain('campaign-table-item', campaigns, 'campaign-table'),500)
	} else
	{
		rp.fetchOne('campaign-list-empty', {}, 'content-box')
	}
}
rp.bindScript('tableCampaign', tableCampaign)

function createCampaign() {
	if (STATE.forming)
	{
		alert("Không thể tiến hành thao tác, Có thao tác khác đang thực thi")
		return
	}
	if (document.getElementById('campaign-topic').value == "")
	{
		alert("Chủ đề của chiến dịch không thể để trống")
		return
	}
	if (document.getElementById('campaign-start').value == "")
	{
		alert("Bạn phải chọn ngày bắt đầu cho chiến dịch")
		return
	}
	if (document.getElementById('campaign-end').value == "")
	{
		alert("Bạn phải chọn ngày kết thúc chiến dịch")
		return
	}

	startLoading()
	const platforms = []
	let platform = document.getElementsByName('platform')
	platform.forEach(el => {if (el.checked) platforms.push(el.value);})
	const startDate = new Date(document.getElementById('campaign-start').value).getTime()
	const endDate = new Date(document.getElementById('campaign-end').value).getTime()
	const duration = (endDate - startDate) / (24 * 60 * 60 * 1000)
	const articleQty = (Number(document.getElementById('campaign-articleQty').value) * duration) + 1
	const order = document.getElementById('campaign-postBook').checked
	let campaign = {
		name: document.getElementById('campaign-name').value,
		topic: document.getElementById('campaign-topic').value,
		role: document.getElementById('campaign-role').value,
		tags: document.getElementById('campaign-tag').value.split(','),
		postTime: document.getElementById('campaign-postTime').value,
		startDate: document.getElementById('campaign-start').value,
		endDate: document.getElementById('campaign-end').value,
		articleQty: articleQty,
		platforms: platforms,
		order: order,
	}
	fetch('/campaign/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(campaign)
	}).then(response => response.json())
		.then(data => {
			stopLoading()
			if (!data.status)
			{
				console.log(data.message, data.payload)
				rp.removeElementById('create-campaign-form')
				alert('Tạo thất bại, hãy thử lại')
				return
			}

			let campaign = {
				id: data.payload._id,
				title: data.payload.name,
				topic: data.payload.topic,
				startDate: formatDateString(data.payload.startDate),
				endDate: formatDateString(data.payload.endDate),
				isCompleted: data.payload.isCompleted ? '--active' : '--inactive',
				isEnded: data.payload.isEnded > 0 ? '--active' : '--inactive',
			}

			let isEmpty = document.getElementById('campaign-list-empty') ?? false
			if (isEmpty)
			{
				rp.fetchOne('campaign-list-item', campaign, 'content-box')
			} else
			{
				rp.putOne('campaign-list-item', campaign, 'content-box')
			}
			STATE.forming = false
			rp.removeElementById('create-campaign-form')
		}).catch(e => {
			console.log(e)
			stopLoading()
		});
}
rp.bindScript('createCampaign', createCampaign)

function renderOutlineList(data) {
	const result = data.payload.outlines
	STATE.currentCampaign = {
		class: 'campaign',
		name: data.payload.campaign.name,
		id: data.payload.campaign._id,
	}
	setState({
		class: 'campaign',
		name: data.payload.campaign.name,
		child: 'outline'
	})

	const backBtn = document.getElementById('back-btn')
	backBtn.setAttribute('invoker-spell', 'listCampaign')
	backBtn.setAttribute('invoker-tail', '')
	backBtn.classList.remove('hidden')

	if (result.length > 0)
	{
		const outlines = []
		for (i = 0;i < result.length;i++)
		{
			let outline = {
				id: result[i]._id,
				title: result[i].name + ' (' + result[i].articleQty + ')',
				platform: result[i].platform,
				startDate: formatDateString(result[i].startDate),
				endDate: formatDateString(result[i].endDate),
				isCompleted: result[i].isCompleted ? '--active' : '--inactive',
				isEnded: result[i].isEnded > 0 ? '--active' : '--inactive',
			}
			outlines.push(outline)
		}
		rp.fetchChain('outline-list-item', outlines, 'content-box')
	} else
	{
		rp.fetchOne('outline-list-empty', {}, 'content-box')
	}
}

function renderOutlineTable(data) {
	const result = data.payload.outlines
	STATE.currentCampaign = {
		class: 'campaign',
		name: data.payload.campaign.name,
		id: data.payload.campaign._id,
	}
	setState({
		class: 'campaign',
		name: data.payload.campaign.name,
		child: 'outline'
	})

	const backBtn = document.getElementById('back-btn')
	backBtn.setAttribute('invoker-spell', 'tableCampaign')
	backBtn.setAttribute('invoker-tail', '')
	backBtn.classList.remove('hidden')

	if (result.length > 0)
	{
		const outlines = []
		for (i = 0;i < result.length;i++)
		{
			let outline = {
				id: result[i]._id,
				title: result[i].name + ' (' + result[i].articleQty + ')',
				platform: result[i].platform,
				startDate: formatDateString(result[i].startDate),
				endDate: formatDateString(result[i].endDate),
				isCompleted: result[i].isCompleted ? '--active' : '--inactive',
				isEnded: result[i].isEnded > 0 ? '--active' : '--inactive',
			}
			outlines.push(outline)
		}
		rp.fetchOne('outline-table-frame', {}, 'content-box')
		rp.putChain('outline-table-item', outlines, 'outline-table')
	} else
	{
		rp.fetchOne('outline-list-empty', {}, 'content-box')
	}
}

function readCampaign(tail) {
	const view = STATE.viewMode
	let id = tail || STATE.currentCampaign.id
	fetch('/campaign/read', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: id
		})
	}).then(response => response.json())
		.then(data => {
			if (data.status === false)
			{
				console.log(data.message, data.payload)
				return
			}

			const viewTableBtn = document.getElementById('view-table-btn')
			const viewListBtn = document.getElementById('view-list-btn')
			viewListBtn.setAttribute('invoker-spell', 'viewListCampaign')
			viewTableBtn.setAttribute('invoker-spell', 'viewTableCampaign')

			if (view == 'list')
			{
				renderOutlineList(data)
			}
			if (view == 'table')
			{
				renderOutlineTable(data)
			}
		}).catch(e => {console.log(e)});
}
rp.bindScript('readCampaign', readCampaign)

function viewTableCampaign() {
	STATE.viewMode = 'table'
	readCampaign()
}
rp.bindScript('viewTableCampaign', viewTableCampaign)

function viewListCampaign() {
	STATE.viewMode = 'list'
	readCampaign()
}
rp.bindScript('viewListCampaign', viewListCampaign)

function recycleCampaign(tail) {
	fetch('/campaign/recycle', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: tail
		})
	}).then(response => response.json())
		.then(data => {
			if (data.status === false)
			{
				console.log(data.message, data.message)
				return
			}
			rp.removeElementById(data.payload)
		}).catch(e => {console.log(e)});
}
rp.bindScript('recycleCampaign', recycleCampaign)

function trashCampaigns() {
	fetch('/campaign/trash', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify()
	}).then(response => response.json())
		.then(data => {
			if (data.status === false)
			{
				console.log(data.message, data.payload)
				return
			}

			const backBtn = document.getElementById('back-btn')
			backBtn.setAttribute('invoker-spell', 'getCampaigns')
			backBtn.setAttribute('invoker-tail', '')
			backBtn.classList.value = backBtn.classList.value.replaceAll('hidden', '')

			const result = data.payload
			if (result.length > 0)
			{
				const campaigns = []
				for (i = 0;i < result.length;i++)
				{
					let campaign = {
						id: result[i]._id,
						title: result[i].name,
						topic: result[i].topic,
						startDate: formatDateString(result[i].startDate),
						endDate: formatDateString(result[i].endDate),
						isCompleted: result[i].isCompleted ? '--active' : '--inactive',
						isEnded: result[i].isEnded > 0 ? '--active' : '--inactive',
					}
					campaigns.push(campaign)
				}
				rp.fetchChain('campaign-trash-item', campaigns, 'content-box')
			} else
			{
				rp.fetchOne('campaign-trash-empty', {}, 'content-box')
			}
		}).catch(e => {console.log(e)});
}
rp.bindScript('trashCampaigns', trashCampaigns)

function restoreCampaign(tail) {
	fetch('/campaign/restore', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			id: tail
		})
	}).then(response => response.json())
		.then(data => {
			if (data.status === false)
			{
				console.log(data.message, data.message)
				return
			}
			rp.removeElementById(data.payload)
		}).catch(e => {console.log(e)});
}
rp.bindScript('restoreCampaign', restoreCampaign)