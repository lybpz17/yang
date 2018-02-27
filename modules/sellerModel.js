var Sequelize = require('sequelize');
var sequelize = require('./modelHead')();
var sellerModel = sequelize.define('sellers', {
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true
	},
	uid: Sequelize.BIGINT,
	shopname: Sequelize.STRING,
	idnumber: Sequelize.STRING,
	idphoto: Sequelize.STRING,
	idphotopath: Sequelize.STRING,
	shoptype: Sequelize.STRING,
	address: Sequelize.STRING,
	email: Sequelize.STRING,
	createtime: Sequelize.DATE,
	updtime: Sequelize.DATE,
	status: Sequelize.INTEGER
}, {
	timestamps: false,
	//paranoid: true  //获取不到id的返回值
});

module.exports = sellerModel;