//-----------------------------
//script of outline here
function getOutlineForm() {
	try
	{
		if (STATE.forming)
		{
			alert("Không thể tiến hành thao tác, Có thao tác khác đang thực thi")
			return
		};
		rp.putOne('create-outline-form');
	} catch (error)
	{
		console.error('Error fetching component failure:', error);
	}
}
rp.bindScript('getOutlineForm', getOutlineForm)

function createOutline() {
	if (STATE.forming)
	{
		alert("Không thể tiến hành thao tác, Có thao tác khác đang thực thi")
		return
	}

	const platform = document.getElementById('outline-platform').value
	const order = document.getElementById('outline-postBook').checked
	let outline = {
		parentId: STATE.currentCampaign.id,
		tags: document.getElementById('outline-tag').value.split(','),
		platform: platform,
		order: order,
	}
	//**editing */
	fetch('/outline/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(outline)
	}).then(response => response.json())
		.then(data => {
			if (!data.status)
			{
				console.log(data.message, data.payload)
				rp.removeElementById('create-outline-form')
				alert('Tạo thất bại, hãy thử lại')
				return
			}
			let outline = {
				id: data.payload._id,
				title: data.payload.name,
				topic: data.payload.topic,
				platform: data.payload.platform,
				startDate: formatDateString(data.payload.startDate),
				endDate: formatDateString(data.payload.endDate),
				isCompleted: data.payload.isCompleted ? '--active' : '--inactive',
				isEnded: data.payload.articles > 0 ? '--active' : '--inactive',
			}
			let isEmpty = document.getElementById('outline-list-empty') ?? false
			if (isEmpty)
			{
				rp.fetchOne('outline-list-item', outline, 'content-box')
			} else
			{
				rp.putOne('outline-list-item', outline, 'content-box')
			}
			STATE.forming = false
			rp.removeElementById('create-outline-form')
		}).catch(e => {console.log(e)});
}
rp.bindScript('createOutline', createOutline)

function renderArticleList(data) {
	if (!data) {return }
	const result = data.articles
	const outline = data.outline

	STATE.currentOutline = {
		class: 'outline',
		name: outline.name,
		id: outline._id,
	}

	setState({
		class: 'outline',
		name: outline.name,
		child: 'article',
	})

	const backBtn = document.getElementById('back-btn')
	backBtn.setAttribute('invoker-spell', 'readCampaign')
	backBtn.setAttribute('invoker-tail', STATE.currentCampaign.id)
	backBtn.classList.remove('hidden')
	const viewTableBtn = document.getElementById('view-table-btn')
	const viewListBtn = document.getElementById('view-list-btn')
	viewListBtn.setAttribute('invoker-spell', 'listOutline')
	viewTableBtn.setAttribute('invoker-spell', 'tableOutline')

	if (result.length > 0)
	{
		const articles = []
		for (i = 0;i < result.length;i++)
		{
			let article = {
				id: result[i]._id,
				title: result[i].topic,
				platform: result[i].platform,
				content: result[i].content,
				startDate: formatDateString(result[i].bookDate),
				endDate: formatDateString(result[i].postDate),
				isCompleted: result[i].content != '' ? '--active' : '--inactive',
				isEnded: result[i].isPosted ? '--active' : '--inactive',
			}
			articles.push(article)
		}
		rp.fetchChain('article-list-item', articles, 'content-box')
	} else
	{
		rp.fetchOne('outline-list-empty', {}, 'content-box')
	}
}

function renderArticleTable(data) {
	if (!data) {return }
	const result = data.articles
	const outline = data.outline

	STATE.currentOutline = {
		class: 'outline',
		name: outline.name,
		id: outline._id,
	}

	setState({
		class: 'outline',
		name: outline.name,
		child: 'article',
	})

	const backBtn = document.getElementById('back-btn')
	backBtn.setAttribute('invoker-spell', 'readCampaign')
	backBtn.setAttribute('invoker-tail', STATE.currentCampaign.id)
	backBtn.classList.remove('hidden')

	const viewTableBtn = document.getElementById('view-table-btn')
	const viewListBtn = document.getElementById('view-list-btn')
	viewListBtn.setAttribute('invoker-spell', 'listOutline')
	viewTableBtn.setAttribute('invoker-spell', 'tableOutline')

	if (result.length > 0)
	{
		const articles = []
		for (i = 0;i < result.length;i++)
		{
			let article = {
				id: result[i]._id,
				title: result[i].topic,
				platform: result[i].platform,
				content: result[i].content,
				startDate: formatDateString(result[i].bookDate),
				endDate: formatDateString(result[i].postDate),
				isCompleted: result[i].content != '' ? '--active' : '--inactive',
				isEnded: result[i].isPosted ? '--active' : '--inactive',
			}
			articles.push(article)
		}
		rp.fetchOne('article-table-frame', {}, 'content-box')
		rp.putChain('article-table-item', articles, 'outline-table')
	} else
	{
		rp.fetchOne('outline-list-empty', {}, 'content-box')
	}
}

function readOutline(tail) {
	const view = STATE.viewMode
	const id = tail || STATE.currentOutline.id
	fetch('/outline/read', {
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
				return false
			}
			if (view == 'list')
			{
				renderArticleList(data.payload)
			}
			if (view == 'table')
			{
				renderArticleTable(data.payload)
			}
		})

}
rp.bindScript('readOutline', readOutline)

function tableOutline() {
	STATE.viewMode = 'table'
	readOutline()
}
rp.bindScript('tableOutline', tableOutline)

function listOutline() {
	STATE.viewMode = 'list'
	readOutline()
}
rp.bindScript('listOutline', listOutline)

function recycleOutline(tail) {
	fetch('/outline/recycle', {
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
rp.bindScript('recycleOutline', recycleOutline)

function trashOutlines() {
	fetch('/outline/trash', {
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
			backBtn.setAttribute('invoker-spell', 'readCampaign')
			backBtn.setAttribute('invoker-tail', STATE.currentCampaign.id)
			backBtn.classList.value = backBtn.classList.value.replaceAll('hidden', '')

			const result = data.payload
			if (result.length > 0)
			{
				const outlines = []
				for (i = 0;i < result.length;i++)
				{
					let outline = {
						id: result[i]._id,
						title: result[i].platform + ' (' + result[i].articleQty + ')',
						platform: result[i].platform,
						startDate: formatDateString(result[i].startDate),
						endDate: formatDateString(result[i].endDate),
						isCompleted: result[i].isCompleted ? '--active' : '--inactive',
						isEnded: result[i].isEnded > 0 ? '--active' : '--inactive',
					}
					outlines.push(outline)
				}
				rp.fetchChain('outline-trash-item', outlines, 'content-box')
			} else
			{
				rp.fetchOne('outline-trash-empty', {}, 'content-box')
			}
		}).catch(e => {console.log(e)});
}
rp.bindScript('trashOutlines', trashOutlines)

function restoreOutline(tail) {
	fetch('/outline/restore', {
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
rp.bindScript('restoreOutline', restoreOutline)