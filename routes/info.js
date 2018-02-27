var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var sequelize = require('../modules/modelHead')();
var userModel = require('../modules/userModel');
var sellerModel = require('../modules/sellerModel');
var formidable = require('formidable');

/* GET users listing. */
router.post('/certification', async function(req, res, next) {
	let loginbean = req.session.loginbean
	res.locals.loginbean = loginbean;
	var form = new formidable.IncomingForm(); //创建上传表单
	form.encoding = 'utf-8'; //设置编辑
	form.uploadDir = './public/images/filed/'; //设置上传目录 文件会自动保存在这里
	form.keepExtensions = true; //保留后缀
	form.maxFieldsSize = 5 * 1024 * 1024; //文件大小5M
	form.parse(req, function(err, fields, files) {
		if (err) {
			console.log(err);
		}
		// console.log(fields) //这里就是post的XXX 的数据
		// 	// console.log(files)
		// console.log('上传的文件名:' + files.idphoto.name); //与客户端file同名
		// console.log('文件路径:' + files.idphoto.path);
		// res.send('接到参数,真名:'+fields.realname);
		let user = {};
		user.name = fields.name;
		user.shopname = fields.shopname;
		user.idnumber = fields.idnumber;
		user.photo = files.idphoto.name
		user.idphotopath = (files.idphoto.path).replace('public\\', '');
		user.email = fields.email;
		user.uid = loginbean.id;
		user.phone = fields.phone;
		user.address = fields.address;
		user.shoptype = fields.shoptype;
		user.status = 0;
		// console.log(user);
		sequelize.transaction().then(function(t) {
			return sellerModel.create(user, {
				transaction: t
			}).then(function(seller) {
				return userModel.update({
					role: sequelize.literal(2)
				}, {
					where: {
						'id': user.uid
					}
				}, {
					transaction: t
				});
			}).then(function(data) {
				t.commit(t)
				loginbean.role = 2;
				res.redirect("/home");
			}).catch(function(err) {
				t.rollback.bind(t);
				console.log('出错' + err);
			});
		})

	})
});
// res.render('index/index');
module.exports = router;