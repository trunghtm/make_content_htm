const rp = new RacoonPiece({extension: 'html', cache: false, mode:'product'})
function makeFirstLetterToUppercase(string) {
	// Lấy chữ cái đầu tiên của chuỗi và chuyển thành chữ hoa 
	let firstLetter = string.charAt(0).toUpperCase(); // Kết hợp chữ cái đầu tiên đã được chuyển thành chữ hoa với phần còn lại của chuỗi 
	string = firstLetter + string.slice(1);
	return string
}

function startLoading() {
	document.getElementById('loader__container').classList.remove('hidden')
}
function stopLoading() {
	document.getElementById('loader__container').classList.add('hidden')
}

function setState(obj) {
	let firstLetter = makeFirstLetterToUppercase(obj.child)
	document.getElementById('type-title').innerText = obj.class
	document.getElementById('current-name').innerText = obj.name
	document.getElementById('addItem-btn').setAttribute('invoker-spell', 'get' + firstLetter + 'Form')
	document.getElementById('trash-btn').setAttribute('invoker-spell', 'trash' + firstLetter + 's')
}
// thay đổi theme

function formatDateString(string) {
	if (!string) return ""
	let timestamp = convertISOToTimestamp(string)
	let stringDate = new Date(timestamp).toISOString()
	let dateString = stringDate.split('T')
	let date = dateString[0].split('-')
	let outputString = date[2] + '/' + date[1] + '/' + date[0]
	let time = dateString[1].replace('Z', '').split(':')
	if (time[0] != '00' && time[1] != '00')
	{
		return outputString + ' - ' + time[0] + ':' + time[1]

	}
	return outputString
}

function convertISOToTimestamp(dateString, timeZone = true) {
	dateString = dateString.split('T')[0]
	// string dầu vào có dạng yyy-mm-ddThh:mm:ss.000Z
	const [year, month, day] = dateString.split('-').map(Number);
	// const fullYear = year < 100 ? 2000 + year : year // Chuyển đổi năm từ định dạng yy sang yyyy 
	const dateObject = new Date(year, month - 1, day); // Lưu ý: tháng trong Date là 0-index 
	if (timeZone)
	{
		const timezoneOffset = -1* dateObject.getTimezoneOffset() *60 * 1000; // Đổi về milisecond 
		return dateObject.getTime() + timezoneOffset;
	}
	return dateObject.getTime();
}

function convertToTimestamp(dateString, timeZone = true) {
	// string dầu vào có dạng dd/mm/yyyy
	const [day, month, year] = dateString.split('/').map(Number);
	// const fullYear = year < 100 ? 2000 + year : year // Chuyển đổi năm từ định dạng yy sang yyyy 
	const dateObject = new Date(year, month - 1, day); // Lưu ý: tháng trong Date là 0-index 
	if (timeZone)
	{
		const timezoneOffset = dateObject.getTimezoneOffset() * 60 * 1000; // Đổi về milisecond 
		return dateObject.getTime() + timezoneOffset;
	}
	return dateObject.getTime();
}

function getCookie(name) {
	const value = `; ${ document.cookie }`;
	const parts = value.split(`; ${ name }=`);
	if (parts.length === 2)
		return parts.pop().split(';').shift();
}