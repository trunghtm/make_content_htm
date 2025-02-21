import fetch from 'node-fetch';

export async function fetchData(url, input) {
	try
	{
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(input)
		});

		if (!response.ok)
		{
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		return data
	} catch (error)
	{
		console.error('There has been a problem with your fetch operation:', error);
		return false
	}
}

export function calculateDaysBetween(timestamp1, timestamp2) {
	// 1 ngày = 24 giờ * 60 phút * 60 giây * 1000 milliseconds 
	const millisecondsPerDay = 24 * 60 * 60 * 1000; // Tính toán sự chênh lệch giữa hai dấu thời gian 
	const differenceInMilliseconds = Math.abs(timestamp1 - timestamp2); // Chuyển đổi sự chênh lệch từ milliseconds sang ngày 
	const daysDifference = differenceInMilliseconds / millisecondsPerDay;
	return daysDifference;
}

export function convertToTimestamp(dateString) {
	// string dầu vào có dạng yyyy-mm-dd
	const [year, month, day] = dateString.split('-').map(Number);
	// const fullYear = year < 100 ? 2000 + year : year // Chuyển đổi năm từ định dạng yy sang yyyy 
	const dateObject = new Date(year, month - 1, day); // Lưu ý: tháng trong Date là 0-index 
	return dateObject.getTime();
}

export function convertToMilliseconds(timeString) {
	try
	{
		// Tách chuỗi hh:mm thành giờ và phút 
		const [hours, minutes] = timeString.split(':').map(Number);
		// Chuyển đổi giờ và phút thành mili giây 
		const milliseconds = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
		return milliseconds;
	} catch (e)
	{
		console.log(e)
		return false
	}
}

export function convertTimestampToISOString(timestamp) {
	// Tạo đối tượng Date từ timestamp
	const date = new Date(timestamp);

	// Chuyển đổi đối tượng Date sang chuỗi theo định dạng ISO 8601
	const isoString = date.toISOString();

	return isoString;
}
