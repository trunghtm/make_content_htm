import {
	createOutline,
	listOutline,
	readOutline,
	updateOutline,
	recycleOutline,
	restoreOutline,
	deleteOutline,
	trashOutline
} from './outline-crud.js';


import {Router} from 'express';
const outline_router = Router();

/**
 * route for outline here
*/
//Create
outline_router.post("/create", createOutline);
//Read
outline_router.post("/", listOutline);
outline_router.post("/read", readOutline);
outline_router.post("/trash", trashOutline);
outline_router.post("/update", updateOutline);
//Delete
outline_router.post("/recycle", recycleOutline);
outline_router.post("/restore", restoreOutline);
// outline_router.post("/delete", deleteOutline);

export default outline_router;