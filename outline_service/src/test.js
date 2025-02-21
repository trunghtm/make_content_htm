export const test = (req, res) => {
	console.log(req.body.mess)
	res.json({status:true,payload: 'you are connected'});
}