const STATE = {
	forming: false,
	class: 'campaign',
	child: 'outline',
	initTitle: {
		class: 'list',
		name: 'Campaign',
	},
	currentCampaign: {
		name: '',
		id: '',
		data:''
	},
	currentOutline:{
		name: '',
		id: '',
		data:''
	},
	viewMode: 'list',
	diagram: true,
}

localStorage.setItem('theme', 'dark');

document.getElementById('theme-toggle').onclick = () => {
	let theme = document.getElementById('theme');
	if (localStorage.getItem('theme') === 'dark')
	{
		localStorage.setItem('theme', 'light');
		theme.href = 'css/theme-light.css';
	} else
	{
		localStorage.setItem('theme', 'dark');
		theme.href = 'css/theme.css';
	}
}