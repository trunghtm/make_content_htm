//file định tuyến toàn trang
import {
	createCampaign,
	listCampaign,
	readCampaign,
	updateCampaign,
	recycleCampaign,
	deleteCampaign,
	trashCampaign,
	restoreCampaign
} from './campaign-crud.js';
import { authorization } from '../http.auth.middleware.js';
import Campaign from './campaign_schema.js';
import {Router} from 'express';
const camp_router = Router();




/**
 * route for campaign here
 */
//Create
camp_router.post("/create", authorization('content-creator', Campaign), createCampaign);
//Read
camp_router.post("/", authorization('content-creator', Campaign), listCampaign);
camp_router.post("/read/",authorization('content-creator', Campaign),  readCampaign);
camp_router.post("/trash/",authorization('content-creator', Campaign), trashCampaign);
//Update
camp_router.post("/update",authorization('content-creator', Campaign), updateCampaign);
//Delete
camp_router.post("/recycle",authorization('content-creator', Campaign),  recycleCampaign);
camp_router.post("/restore",authorization('content-creator', Campaign),  restoreCampaign);
// camp_router.post("/delete-campaign", deleteCampaign);

export default camp_router;