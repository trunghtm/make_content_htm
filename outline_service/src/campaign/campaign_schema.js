import mongoose from 'mongoose'; // import module mongoose
const {Schema} = mongoose; // khởi tạo biến khung dữ liệu
import slug from 'mongoose-slug-generator'; // import module mongoose slug generator
import mongooseDelete from 'mongoose-delete'; // import module mongoose delete


//add plugins
// mongoose.plugin(slug) //mount mongoose slug generator
mongoose.plugin(mongooseDelete, {overrideMethods: 'all', deletedAt: true})//mount mongoose delete

//configure schema
const campaign_schema = new Schema({
	//basic information
	name: {type: String, default: 'unnamed'},
	topic: {type: String, default: ''},
	tags: {type: [String], default: ['normal']},
	postTime: {type: String, default: '00:00'},
	articleQty: {type: Number, default: 1},
	startDate: {type: Date, required: true},
	endDate: {type: Date, required: true},
	frame: {type: [Object], required: true},
	platforms: {type: [String], default: ['facebook']},
	outlineId: {type: [String], default: []},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},

	//security information
	role: {type: String, default: 'content-creator'},
	department: {type: String, default: ''},
	level: {type: Number, default: 1},
	specialPermit: {type: [String], default: []},

	//handle flag
	__isEnded: {type: Boolean, default: false},
	__isHandling: {type: Boolean, default: false},
	__isCompleted: {type: Boolean, default: false},
}, {timestamps: true});

const Campaign = mongoose.model('campaign', campaign_schema)
export default Campaign