var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var sequelize = require('../modules/modelHead')();
var userModel = require('../modules/userModel');
var sellerModel = require('../modules/sellerModel');
var formidable = require('formidable');

/* GET users listing. */
router.get('/admin', function(req, res, next) {
	let loginbean = req.session.loginbean;
	let sql = 'select * from sellers where status=0;'
	sequelize.query(sql).then(function(rs) {
		res.render('admin/examine', {
			rs: rs[0]
		})
	}).catch(function(err) {
		console.log(err);
	})

});

router.get('/adminapplyInfo', function(req, res, next) {
	let loginbean = req.session.loginbean;
	let sql = 'select s.* from users u,sellers s where u.role=? and s.id=?;'
	sequelize.query(sql, {
		replacements: [loginbean.role, req.query.id]
	}).then(function(rs) {
		res.render('admin/adminapplyInfo', {
			rs: rs[0][0]
		})
	}).catch(function(err) {
		console.log(err);
	})

});


router.get('/adminagree', function(req, res, next) {
	let loginbean = req.session.loginbean;
	let sql = 'update sellers set status=1 where id=?;';
	sequelize.query(sql, {
		replacements: [req.query.id]
	}).then(function(rs) {
		userModel.update({
			role: 3
		}, {
			where: {
				'id': req.query.uid
			}
		}).then(function(rs) {
			res.send('1');
		})
	}).catch(function(err) {
		console.log(err);
	})

});

router.get('/regect', function(req, res, next) {
	let loginbean = req.session.loginbean;
	res.render('admin/text', {
		id: req.query.id,
		uid: req.query.uid
	})


});

router.post('/regect', function(req, res, next) {
	let loginbean = req.session.loginbean;
	let sql = 'delete from sellers where id=?;';
	sequelize.query(sql, {
		replacements: [req.body.ids]
	}).then(function(rs) {
		userModel.update({
			role: 1
		}, {
			where: {
				'id': req.body.uids
			}
		}).then(function(rs) {
			let sql2 = 'insert into message(sendid,receiveid,content) value(?,?,?)';
			sequelize.query(sql2, {
				replacements: [loginbean.id, req.body.uids, req.body.text]
			}).then(function(rs) {
				res.redirect('/home')
			})
		})
	}).catch(function(err) {
		console.log(err);
	})

});

module.exports = router;