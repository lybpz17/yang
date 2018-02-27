var Sequelize = require('sequelize');
var sequelize = require('./modelHead')();
var shopModel = sequelize.define('shopTables', {
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true
	},
	uid: Sequelize.BIGINT,
	shopname: Sequelize.STRING,
	content: Sequelize.STRING,
	shopaddress: Sequelize.STRING,
	imagePath: Sequelize.STRING,
	shoptype: Sequelize.STRING,
	lng: Sequelize.STRING,
	lat: Sequelize.STRING,
	createtime: Sequelize.DATE,
	updtime: Sequelize.DATE,
	shoprole: Sequelize.INTEGER
}, {
	timestamps: false,
	//paranoid: true  //获取不到id的返回值
});

module.exports = shopModel;