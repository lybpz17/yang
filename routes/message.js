var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var userModel = require('../modules/userModel');
var shopModel = require('../modules/shopModel');
var goodsModel = require('../modules/goodsModel');
var formidable = require('formidable');
var sequelize = require('../modules/modelHead')();

router.get('/message', function(req, res, next) {
	let loginbean = req.session.loginbean;
	let sql = 'select m.*,u.name from message m,users u where m.receiveid=? and u.id=m.sendid';
	sequelize.query(sql, {
		replacements: [loginbean.id]
	}).then(function(rs) {
		res.render('message/messagehome', {
			rs: rs[0]
		})
	}).catch(function(err) {
		console.log(err);
	})

})

router.get('/messageNews', function(req, res, next) {
	res.render('message/messageNews')
})

router.get('/messagereply', function(req, res, next) {
	res.render('message/messagereply')
})

router.post('/messagereply', function(req, res, next) {
	let loginbean = req.session.loginbean;
	let sql = 'update message set sendid=?,receiveid=?,content=? where id=?';
	sequelize.query(sql, {
			replacements: [loginbean.id, req.body.receiveid, req.body.content, req.body.id]
		}).then(function(rs) {
			let sql1 = 'select m.*,u.name from message m,users u where m.receiveid=? and u.id=m.sendid'
			sequelize.query(sql1, {
				replacements: [loginbean.id]
			}).then(function(rs) {
				res.render('message/messagehome', {
					rs: rs[0]
				})
			})
		})
		// res.render('message/messagereply')
})

router.post('/messageNews', function(req, res, next) {
	let loginbean = req.session.loginbean;
	userModel.findAll({
		where: {
			name: req.body.messageName
		}
	}).then(function(rs) {
		console.log();
		if (typeof(rs[0]) != 'undefined') {
			res.render('message/messageDemand', {
				rs: rs
			})
		} else {
			res.send('1')
		}


	}).catch(function(err) {
		console.log(err);
	})
})

router.post('/messagecontent', function(req, res, next) {
	console.log(req.body.content);
	let loginbean = req.session.loginbean;
	let sql = 'insert into message set content=?,sendid=?,receiveid=?';
	sequelize.query(sql, {
		replacements: [req.body.content, loginbean.id, req.body.receiveid]
	}).then(function(rs) {
		if (rs) {
			let sql = 'select m.*,u.name from message m,users u where m.receiveid=? and u.id=m.sendid';
			sequelize.query(sql, {
				replacements: [loginbean.id]
			}).then(function(rs) {
				console.log(rs);
				res.render('message/messagehome', {
					rs: rs[0]
				})
			}).catch(function(err) {
				console.log(err);
				res.send('1')
			})
		}
	}).catch(function(err) {
		console.log(err);
		res.send('0');
	})
});

router.post('/del', function(req, res, next) {
	let loginbean = req.session.loginbean
	let sql = 'delete from message where id=?';
	sequelize.query(sql, {
		replacements: [req.body.id]
	}).then(function(rs) {
		let sql = 'select m.*,u.name from message m,users u where m.receiveid=? and u.id=m.sendid';
		sequelize.query(sql, {
			replacements: [loginbean.id]
		}).then(function(rs) {
			res.render('message/messagehome', {
				rs: rs[0]
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

module.exports = router;