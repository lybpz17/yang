var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var userModel = require('../modules/userModel');
var shopModel = require('../modules/shopModel');
var goodsModel = require('../modules/goodsModel');
var formidable = require('formidable');
var sequelize = require('../modules/modelHead')();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('index/index');
});

router.get('/home', function(req, res, next) {
	loginbean = req.session.loginbean;
	// loginbean.examine = '身份认证'
	// if (loginbean.role == 2) {
	// 	loginbean.examine = '身份审核中';
	// }
	if (loginbean.role == 0) {
		let sql = 'select count(*) `page`,m.*,u.name from message m,users u where m.receiveid=? and u.id=m.sendid';
		sequelize.query(sql, {
			replacements: [loginbean.id]
		}).then(function(rs) {
			console.log(rs);
			res.render('admin/adminHome', {
				loginbean: loginbean,
				rs: rs[0][0]
			});
		}).catch(function(err) {
			console.log(err);
		})


	} else {
		let sql = 'select count(*) `page`,m.*,u.name from message m,users u where m.receiveid=? and u.id=m.sendid';
		sequelize.query(sql, {
			replacements: [loginbean.id]
		}).then(function(rs) {
			console.log(rs);
			res.render('home/home', {
				loginbean: loginbean,
				rs: rs[0][0]
			});
		}).catch(function(err) {
			console.log(err);
		})
	}
});
router.get('/Certification', function(req, res, next) {
	res.render('home/Certification');
});

router.get('/login', function(req, res, next) {
	res.render('login');
});
router.get('/map', function(req, res, next) {
	// res.render('index/index');
	res.render('home/map');
});

router.get('/register', function(req, res, next) {
	// res.render('index/index');
	res.render('register');
});

router.post('/login', function(req, res, next) {
	userModel.findOne({
		where: req.body
	}).then(function(rs) {
		if (rs) {
			loginbean = {};
			loginbean = req.body;
			loginbean.id = rs.id;
			loginbean.role = rs.role;
			loginbean.nicheng = rs.nicheng;
			req.session.loginbean = loginbean;
			res.redirect("/home");
		} else if (rs == null) {
			res.send('账号密码错误')
		}
	}).catch(function(err) {
		console.log(err);
	})
});

router.post('/register', function(req, res, next) {
	userModel.create(req.body).then(function(rs) {
			if (rs) {

				res.redirect(307, "/login");
			}
		}).catch(function(err) {
			console.log(err);
			if (err.errors[0].path == 'nameuniq') {
				res.send('名称重复')
			} else if (err.errors[0].path == 'nichenguniq') {
				res.send('昵称重复')
			} else {
				res.send('数据库出错');
			}

		})
		// console.log(name);
		// res.render('index/index');

});

router.get('/logout', function(req, res, next) {
	delete req.session.loginbean;
	res.redirect('/');
});

router.post('/homeshop', function(req, res, next) {
	let loginbean = req.session.loginbean
	res.locals.loginbean = loginbean;
	var form = new formidable.IncomingForm(); //创建上传表单
	form.encoding = 'utf-8'; //设置编辑
	form.uploadDir = './public/images/shop/'; //设置上传目录 文件会自动保存在这里
	form.keepExtensions = true; //保留后缀
	form.maxFieldsSize = 5 * 1024 * 1024; //文件大小5M
	form.parse(req, function(err, fields, files) {
		if (err) {
			console.log(err);
		}
		// console.log(fields) //这里就是post的XXX 的数据
		// console.log(files)
		// console.log('上传的文件名:' + files.shopImg.name); //与客户端file同名
		// console.log('文件路径:' + files.shopImg.path);
		// res.send('接到参数,真名:'+fields.realname);
		let shop = {};
		shop.uid = loginbean.id;
		shop.shopname = fields.shopname;
		shop.shoptype = fields.shoptype;
		shop.content = fields.content;
		shop.imagePath = (files.shopImg.path).replace('public\\', '');
		shop.lng = fields.lng;
		shop.lat = fields.lat;
		shop.shopaddress = fields.address;
		shopModel.create(shop).then(function(rs) {
			if (rs) {
				let sql = 'update users set role=4 where id=?';
				sequelize.query(sql, {
					replacements: [loginbean.id]
				}).then(function(rs) {
					loginbean.role = 4;
					req.session.loginbean = loginbean;
					res.redirect('/home')
				})
			}
		}).catch(function(err) {
			console.log(err);
		})
	})
})

router.post('/manage', function(req, res, next) {
	let loginbean = req.session.loginbean;
	shopModel.findAll({
		where: {
			uid: loginbean.id
		}
	}).then(function(rs) {
		console.log(rs[0].id);
		loginbean.shopid = rs[0].id;
		goodsModel.findAll({
			where: {
				uid: loginbean.id,
				shopid: loginbean.shopid
			}
		}).then(function(rss) {
			res.render('home/homeManage', {
				rs: rs,
				rss: rss
			});
		}).catch(function(err) {
			console.log(err);
		})
	}).catch(function(err) {
		console.log(err);
	})

});


router.post('/goods', function(req, res, next) {
	let loginbean = req.session.loginbean
	res.locals.loginbean = loginbean;
	var form = new formidable.IncomingForm(); //创建上传表单
	form.encoding = 'utf-8'; //设置编辑
	form.uploadDir = './public/images/goods/'; //设置上传目录 文件会自动保存在这里
	form.keepExtensions = true; //保留后缀
	form.maxFieldsSize = 5 * 1024 * 1024; //文件大小5M
	form.parse(req, function(err, fields, files) {
		if (err) {
			console.log(err);
		}
		//console.log( fields)//这里就是post的XXX 的数据// console.log('上传的文件名:'+files.photo.name);//与客户端file同名
		// console.log('上传的文件名:'+files.idphoto.name);
		// console.log('文件路径:'+files.idphoto.path);

		let goods = {};
		goods.uid = loginbean.id;
		goods.shopid = loginbean.shopid;
		goods.goodsname = fields.goodsname;
		goods.goodstype = fields.goodstype;
		goods.goodsprice = fields.goodsprice;
		goods.goodsnum = fields.goodsnum;
		let goodsPath = (files.goodsImg.path).replace('public\\', '');
		goods.goodspath = goodsPath.replace(/\\/g, "\/");
		goodsModel.create(goods).then(function(rs) {
			if (rs) {
				res.redirect(307, '/manage');
			}
		}).catch(function(err) {
			console.log(err);
		})
	})
});

router.post('/del', function(req, res, next) {
	let loginbean = req.session.loginbean
	let sql = 'delete from goods where id=?';
	sequelize.query(sql, {
		replacements: [req.body.id]
	}).then(function(rs) {
		let sql1 = 'select * from goods where uid=? and shopid=?';
		sequelize.query(sql1, {
			replacements: [loginbean.id, loginbean.shopid]
		}).then(function(rs) {
			console.log(rs);
			res.render('home/publish', {
				rss: rs[0]
			})
		}).catch(function(err) {
			console.log(err);
			res.send('3')
		})
	}).catch(function(err) {
		console.log(err);
		res.send('2');
	})
})

router.post('/modify', function(req, res, next) {
	let loginbean = req.session.loginbean;
	let sql = 'select * from goods where uid=? and shopid=? and id=?';
	sequelize.query(sql, {
		replacements: [loginbean.id, loginbean.shopid, req.body.id]
	}).then(function(rs) {
		loginbean.goodsid = rs[0][0].id;
		console.log(rs[0][0]);
		res.render('home/modify', {
			rss: rs[0][0]
		})
	})
})

router.post('/goodschange', function(req, res, next) {
	let loginbean = req.session.loginbean
	res.locals.loginbean = loginbean;
	var form = new formidable.IncomingForm(); //创建上传表单
	form.encoding = 'utf-8'; //设置编辑
	form.uploadDir = './public/images/goods/'; //设置上传目录 文件会自动保存在这里
	form.keepExtensions = true; //保留后缀
	form.maxFieldsSize = 5 * 1024 * 1024; //文件大小5M
	form.parse(req, function(err, fields, files) {
		if (err) {
			console.log(err);
		}
		// console.log(fields) //这里就是post的XXX 的数据
		// console.log('上传的文件名:'+files.photo.name);//与客户端file同名
		// console.log('上传的文件名:' + files.goodsImage.name);
		// console.log('文件路径:'+files.idphoto.path);
		if (files.goodsImage.name == '') {
			let sql = 'update goods set goodsname=?,goodstype=?,goodsprice=?,goodsnum=? where id=?';
			sequelize.query(sql, {
				replacements: [fields.goodsname, fields.goodstype, fields.goodsprice, fields.goodsnum, loginbean.goodsid]
			}).then(function(rs) {
				let sql = 'select * from goods where uid=? and shopid=?';
				sequelize.query(sql, {
					replacements: [loginbean.id, loginbean.shopid]
				}).then(function(rs) {
					res.render('home/publish', {
						rss: rs[0]
					})
				})

			}).catch(function(err) {
				console.log(err);
			})
		} else {
			let sql = 'update goods set goodsname=?,goodstype=?,goodsprice=?,goodsnum=?,goodspath=? where id=? ';
			sequelize.query(sql, {
				replacements: [fields.goodsname, fields.goodstype, fields.goodsprice, fields.goodsnum, (files.goodsImage.path).replace('public\\', ''), loginbean.goodsid]
			}).then(function(rs) {
				let sql = 'select * from goods where uid=? and shopid=?';
				sequelize.query(sql, {
					replacements: [loginbean.id, loginbean.shopid]
				}).then(function(rs) {
					res.render('home/publish', {
						rss: rs[0]
					})
				})

			}).catch(function(err) {
				console.log(err);
			})
		}
	})
});
router.get('/notlog', function(req, res, next) {
	res.render('index/notlog')
})

router.post('/notlog', function(req, res, next) {
	let sql = 'select s.* from sellers s, users u where s.phone=? and s.idnumber=? and u.name=? and s.uid=u.id';
	sequelize.query(sql, {
		replacements: [req.body.userphone, req.body.userid, req.body.username]
	}).then(function(rs) {
		if (rs[0][0] == undefined) {
			res.send('2')
		} else {
			req.session.changepwd = rs[0][0];
			console.log(req.session.changepwd);
			res.send('1')
		}

	}).catch(function(err) {
		console.log(err);
		rss.send('3')
	})
})


module.exports = router;