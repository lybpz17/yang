var Sequelize = require("sequelize");
var sequelize = require("./modelHead")();
var goodsModel = sequelize.define('goods', {
	id: {
		type: Sequelize.BIGINT,
		primaryKey: true
	},
	uid: Sequelize.BIGINT,
	shopid: Sequelize.BIGINT,
	goodsname: Sequelize.STRING,
	goodstype: Sequelize.STRING,
	goodsnum: Sequelize.BIGINT,
	goodsprice: Sequelize.DECIMAL,
	goodspath: Sequelize.STRING,
	createtime: Sequelize.DATE,
	updtime: Sequelize.DATE,
	goodsrole: Sequelize.INTEGER
}, {
	timestamps: false
		// paranoid:true
});
module.exports = goodsModel;