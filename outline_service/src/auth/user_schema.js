import mongoose from 'mongoose'; // import module mongoose
const {Schema} = mongoose; // khởi tạo biến khung dữ liệu
import slug from 'mongoose-slug-generator'; // import module mongoose slug generator
import mongooseDelete from 'mongoose-delete'; // import module mongoose delete


//add plugins
// mongoose.plugin(slug) //mount mongoose slug generator
mongoose.plugin(mongooseDelete, {overrideMethods: 'all', deletedAt: true})//mount mongoose delete

//configure schema
const user_schema = new Schema({
	//basic information
	firstName: {type: String, default: ''},
	lasName: {type: String, default: ''},
	middleName: {type: String, default: ''},
	department: {type: String, default: ''},
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},

	//security information
	userName: {type: String, default: 'unnamed'},
	password: {type: String, default: ''},
	permit: {type: String, default: ''},
	role: {type: String, default: 'content-creator'},
	level: {type: Number, default: 1 },
	token: {type: String, default: ''},
	ref: {type: String, default: ''},
	device: {type: [String], default: []},
}, {timestamps: true});

const User = mongoose.model('user', user_schema)
export default User