function getLoginForm() {
	window.location = '/login'
}
rp.bindScript('getLoginForm', getLoginForm)

function authentication() {
	if (document.getElementById('login-userName').value == "")
	{
		alert("Bạn chưa nhập tên đăng nhập")
		return
	}
	if (document.getElementById('login-password').value == "")
	{
		alert("Bạn chưa nhập mật khẩu")
		return
	}

	const data = {
		username: document.getElementById('login-userName').value.trim(),
		password: document.getElementById('login-password').value.trim()
	}

	fetch('/authentication', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	}).then(response => response.json())
		.then(data => {
			if (!data.status)
			{
				console.log(data.message, data.payload)
				alert('Đăng nhập thất bại, hãy thử lại')
				return
			}
			window.location = getCookie('_cook_3') ?? '/'
		}).catch(e => {console.log(e)});
}
rp.bindScript('authentication', authentication)
