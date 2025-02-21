//file định tuyến toàn trang



import auth_router from './auth/router.js'
import camp_router from './campaign/router.js'
import outline_router from './outline/router.js'
import site_router from './site/router.js'
import article_router from './article/router.js'

import {id, notPublic} from './http.auth.middleware.js';
function route(app) {
	app.use(id)
	
	app.use('/authentication', auth_router)
	app.use('/article', article_router)
	app.use('/campaign',notPublic, camp_router)
	app.use('/outline',notPublic, outline_router)
	/**
	 * route for security here
	*/
	app.use('/', site_router)
}
export default route