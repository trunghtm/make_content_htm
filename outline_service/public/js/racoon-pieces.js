/**
	 * thư viên này giúp lấy và đặt component vào DOM
	 * the viện có hỗ trợ lưu component vào local storage để giảm thời gian fetch
	 * @author Đoàn Đức Trung (trungctr)
	 * @param {Object} config cấu hình cho thư viện
	 */

class RacoonPiece {
	constructor(config = {}) {
		this.mode = config.mode || 'development';
		this.extension = config.extension || 'html';
		this.spells = {}
		this.inProgress = {}
		this.listen(this.mode)
	}

	/**
	 * lấy component từ local storage nếu có, nếu không thì fetch từ server
	 * @param {String} name tên component cần lấy
	 */
	async getComponent(name) {
		if (localStorage.getItem('component__' + name))
		{
			return localStorage.getItem('component__' + name);
		} else
		{
			try
			{
				const response = await fetch('./components/' + name + '.' + this.extension);
				const data = await response.text();
				if (this.cache) localStorage.setItem('component__' + name, data);
				return data;
			} catch (error)
			{
				console.error('Error fetching component:', error);
				return false
			}
		}
	}

	/**
		 * khảo sát 1 phần tử DOM và trả về attribute của 1 phần tử
		 * @param {element} c phần tử DOM cần khảo sát thuộc tính
		 * @param {String} prop thuộc tính muốn khảo sát
		 */
	observation(c, prop) {
		// console.log('ob:',c, typeof c)
		let tail = c.getAttribute(prop)
		let node = c
		function loop() {
			if (!tail)
			{
				let p = node.parentNode
				if (p == document.body)
				{
					return tail = false
				} else
				{
					tail = p.getAttribute(prop)
					node = p
				}
				loop()
			}
		}
		loop()
		return tail
	}

	/**
		 * thực thi một đoạn mã đính vào một phần tử
		 * @param {element} c phần tử DOM cần khảo sát thuộc tính
		 * @param {String} prop thuộc tính muốn khảo sát
		 */
	invoke(e) {
		e.stopPropagation()
		let node = e.target
		let action = this.observation(node, 'invoker-spell')
		let tail = this.observation(node, 'invoker-tail') ? this.observation(node, 'invoker-tail') : false
		let detail = false
		const checkJson = (tail) => {
			try
			{
				return JSON.parse(tail)
			}
			catch (error)
			{
				return false
			}
		}
		if (tail)
		{
			if (checkJson(tail))
			{
				detail = checkJson(tail)
			} else
			{
				detail = tail
			}
		}
		while (action !== 0)
		{
			if (this.mode == "development")
			{
				console.log('Invoker:', action, detail)
			}
			if (action)
			{
				if (this.inProgress[action] == action) return; // nếu đang chạy hàm này thì dừng lại chờ chạy xong

				if (this.spells[action])
				{
					this.inProgress[action] = action

					if (detail)
					{
						this.spells[action](detail);
					} else
					{
						this.spells[action]();
					}
				} else
				{
					if (detail)
					{
						this[action](detail);
					} else
					{
						this[action]();
					}
				}
			}
			this.inProgress[action] = false
			action = 0
		}
	}
	/**
		 * thêm trình nghe của invoker vào 
		 * @param {String} piece component cần đặt dữ liệu vào
		 * @param {Object} data dữ liệu đặt vào component
		 */
	listen(mode) {
		document.addEventListener('mousedown', this.invoke.bind(this))
		if (mode === 'development')
		{
			// Tạo một thẻ div mới
			let newDiv = document.createElement('div');

			// Thiết lập thuộc tính id cho thẻ div
			newDiv.id = 'dev-detail';
			newDiv.style.position = 'fixed';
			newDiv.style.background = '#fff';
			newDiv.style.color = '#000';
			newDiv.style.zIndex = '1000';

			// Thêm thẻ div vào phần tử body hoặc bất kỳ phần tử nào khác mà bạn muốn
			document.body.appendChild(newDiv);

			document.addEventListener('mousemove', function (event) {
				const node = event.target
				let spellName = node.getAttribute('invoker-spell')
				let tail = node.getAttribute('invoker-tail')
				const coordinate = document.getElementById('dev-detail')

				newDiv.innerText =
					'Script: ' + spellName +
					'\nParams: ' + tail +
					'\n-------------\n' +
					event.target.tagName +
					' : ' +
					event.target.offsetTop +
					' , ' +
					event.target.offsetLeft +
					'\nB x H : ' +
					event.target.offsetWidth +
					'x' +
					event.target.offsetHeight +
					'\nX,Y : ' +
					event.pageX +
					' , ' +
					event.pageY
				coordinate.style.top = event.pageY + 10 + 'px'
				coordinate.style.left = event.pageX + 10 + 'px'
			})
		}
	}

	/**
	 * Đăt dữ liệu vào component
	 * @param {String} piece component cần đặt dữ liệu vào
	 * @param {Object} data dữ liệu đặt vào component
	 */
	parserData(piece, data = {}) {
		let frame = piece;
		for (let key in data)
		{
			if (data.hasOwnProperty(key))
			{
				frame = frame.replaceAll('{{' + key + '}}', data[key]);
			}
		}
		frame = frame.replaceAll(/\{\{.*?\}\}/g, '--');
		return frame;
	}

	/**
	 * xóa tất cả các phần tử con của một phần tử
	 * @param {String} element id của phần tử cần xóa các phần tử con
	 */
	clearElement(element) {
		let selectedElement = document.getElementById(element);
		while (selectedElement.firstChild)
		{
			// console.log('cLe:', selectedElement.firstChild, typeof selectedElement.firstChild)
			// let spell = document.getElementById(this.observation(selectedElement.firstChild, 'rp-name').bind(this))
			// if (spell) document.body.remove(spell) 
			selectedElement.removeChild(selectedElement.firstChild);
		}
	}

	/**
	 * Xóa (unmount) 1 phần tử ra khỏi dom
	 * @param {String} element id của phần tử cần xóa
	 */
	removeElementById(element) {
		let selectedElement = document.getElementById(element);
		selectedElement.parentNode.removeChild(selectedElement);
	}

	/**
	 * Thêm script vào thư viện để chạy sau
	 * @param {String} scriptName tên hàm muốn thêm vào
	 */
	bindScript(scriptName = '', func) {
		if (scriptName === '')
		{
			return
		}
		if (scriptName !== '')
		{
			this.spells[scriptName] = func
		}
	}

	extractScriptContent(input) {
		const regex = /<script[\s\S]*?<\/script>/gi;
		let match = input.match(regex);
		const spell = match ? match[0] : null;
		const idRegex = /id=['"]([^'"]+)['"]/i;
		let id
		if (match)
		{
			const idMatch = spell.match(idRegex)
			id = idMatch ? idMatch[0].split('=')[1].replaceAll("'", '') : null
		}
		return {
			spell, id
		}
	}

	/**
	 * Đặt component vào một phần tử, nếu không chỉ định id thì đặt vào body
	 * @param {String} name tên component
	 * @param {Object} data dữ liệu đặt vào component
	 * @param {String} slot id của phần tử sẽ đặt component vào
	 * @param {String} position vị trí trong phần tử sẽ đặt component vào
	 */
	putComponent(piece, slot = '', position = 'beforeend') {
		let spell = this.extractScriptContent(piece);
		let spellId = spell ?? spell['id'].split('=')[1]
		let isSpellExist = document.getElementById(spellId) ?? false
		let haveScript = spell['spell'] && !isSpellExist
		if (haveScript)
		{
			piece = piece.replaceAll(spell['spell'], '');
		}

		if (slot === '')
		{
			document.body.insertAdjacentHTML(position, piece);

			return true
		}
		else
		{
			document.getElementById(slot).insertAdjacentHTML(position, piece);
		}

		if (haveScript)
		{
			document.body.insertAdjacentHTML(position, spell['spell']);
		}
	}

	/**
	 * Đặt một component cùng kiểu đã có dữ liệu vào một phần tử
	 * @param {String} name tên component
	 * @param {Object} data dữ liệu đặt vào component
	 * @param {String} slot id của phần tử sẽ đặt component vào
	 * @param {String} position vị trí trong phần tử sẽ đặt component vào
	 */
	async putOne(name, data, slot, position = 'beforeend') {
		const frame = await this.getComponent(name)
		let piece = this.parserData(frame, data)
		this.putComponent(piece, slot, position)
	}

	/**
	 * Đặt nhiều component cùng kiểu đã có dữ liệu vào một phần tử
	 * @param {String} name tên component
	 * @param {Array} data dữ liệu đặt vào component
	 * @param {String} slot id của phần tử sẽ đặt component vào
	 * @param {String} position vị trí trong phần tử sẽ đặt component vào
	 */
	async putChain(name, data = [], slot, position = 'beforeend') {
		const frame = await this.getComponent(name)
		for (let i = 0;i < data.length;i++)
		{
			let piece = this.parserData(frame, data[i])
			this.putComponent(piece, slot, position)
		}
	}

	/**
	 * Đặt nhiều component cùng kiểu đã có dữ liệu vào một phần tử sau khi đã xóa hết phần tử con
	 * @param {String} name tên component
	 * @param {Array} data dữ liệu đặt vào component
	 * @param {String} slot id của phần tử sẽ đặt component vào
	 * @param {String} position vị trí trong phần tử sẽ đặt component vào
	 */
	fetchChain(names, data = [], slot, position = 'beforeend') {
		this.clearElement(slot)
		this.putChain(names, data, slot, position)
	}

	/**
	 * Đặt một component đã có dữ liệu vào một phần tử sau khi đã xóa hết phần tử con
	 * @param {String} name tên component
	 * @param {Array} data dữ liệu đặt vào component
	 * @param {String} slot id của phần tử sẽ đặt component vào
	 * @param {String} position vị trí trong phần tử sẽ đặt component vào
	 */
	fetchOne(names, data = [], slot, position = 'beforeend') {
		this.clearElement(slot)
		this.putOne(names, data, slot, position)
	}
}