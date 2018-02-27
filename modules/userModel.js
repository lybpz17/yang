var Sequelize = require('sequelize');
var sequelize = require('./modelHead')();
var usersModel = sequelize.define('users', {
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true
	},
	name: Sequelize.STRING,
	pwd: Sequelize.STRING,
	nicheng: Sequelize.STRING,
	createtime: Sequelize.DATE,
	updtime: Sequelize.DATE,
	role: Sequelize.INTEGER
}, {
	timestamps: false,
	//paranoid: true  //获取不到id的返回值
});

module.exports = usersModel;