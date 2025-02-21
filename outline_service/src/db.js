import { config } from 'dotenv';
config();

import mongoose from 'mongoose';

const { DATABASE_HOST, DATABASE_USER, DATABASE_USER_PASSWORD, DATABASE_ADDRESS, DATABASE_NAME } = process.env;

const atlas = `${DATABASE_HOST}://${DATABASE_USER}:${DATABASE_USER_PASSWORD}@${DATABASE_ADDRESS}/${DATABASE_NAME}`;
const local = `${DATABASE_HOST}://${DATABASE_USER}:${DATABASE_USER_PASSWORD}@${DATABASE_ADDRESS}/${DATABASE_NAME}?authMechanism=DEFAULT`;

class DatabaseConnect {
	atlas = async () => {
		try {
			await mongoose.connect(atlas);
			console.log('Connect to atlas DB successfully!!');
		} catch (error) {
			console.log(error);
		}
	}; 

	local = async () => {
		try {
			await mongoose.connect(local);
			console.log('Connect to local DB successfully!!');
		} catch (error) {
			console.log(error);
		}
	};
}

export default new DatabaseConnect();