import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function homPage(req, res) {
	console.log('homepage')
	res.sendFile(path.join(__dirname, '../../public', 'home-page.html'))
}