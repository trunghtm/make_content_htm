function gridMenu() {
	try
	{
		rp.putOne('grid-menu');
	} catch (error)
	{
		console.error('Error fetching component failure:', error);
	}
}
rp.bindScript('gridMenu', gridMenu)

function closeGridMenu() {
	try
	{
		rp.removeElementById('main-menu')
	} catch (error)
	{
		console.error('Error fetching component failure:', error);
	}
}
rp.bindScript('closeGridMenu', closeGridMenu)

function gotoFacebookContentKit() {
	window.location = '/content-facebook.html';
}

rp.bindScript('gotoFacebookContentKit', gotoFacebookContentKit)

function gotoFunnelChanel() {
	window.location = '/funnel-chanel.html';
}
rp.bindScript('gotoFunnelChanel', gotoFunnelChanel)