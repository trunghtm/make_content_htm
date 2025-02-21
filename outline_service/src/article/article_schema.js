import mongoose from 'mongoose'; // import module mongoose
const {Schema} = mongoose; // khởi tạo biến khung dữ liệu
import slug from 'mongoose-slug-generator'; // import module mongoose slug generator
import mongooseDelete from 'mongoose-delete'; // import module mongoose delete


//add plugins
// mongoose.plugin(slug) //mount mongoose slug generator
mongoose.plugin(mongooseDelete, {overrideMethods: 'all', deletedAt: true})//mount mongoose delete

//configure schema
const article_schema = new Schema({
	topic: {type: String, default: 'unnamed'},
	content: {type: String, default: ''},
	parentId: {type: String, default: ''},
	ownerId: {type: String, default: ''},
	order: {type: Number, },
	media: {type: String, default: ''},
	headings: {type: [String], default: []},
	keywords: {type: [String], default: []},
	platform: {type: String, default: 'facebook'},
	role: {type: String, default: 'content-creator'},
	tags: {type: [String], default: ['normal']},
	checkedById: {type: String, default: ''},
	postDate: {type: Date, },
	bookDate: {type: Date, required: true},
	__makingContent: {type: Boolean, default: false},
	__isChecked: {type: Boolean, default: false},
	__isPosted: {type: Boolean, default: false},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
}, {timestamps: true});

const Article = mongoose.model('article', article_schema)
export default Article