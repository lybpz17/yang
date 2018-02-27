var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var index = require('./routes/index');
var users = require('./routes/users');
var info = require('./routes/info');
var admin = require('./routes/admin');
var message = require('./routes/message');
var message = require('./routes/message');
var documents = require('./routes/documents');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser({
	uploadDir: './uploadtemp'
})); //设置上传临时文件夹

var session = require('express-session');
app.use(session({
	secret: 'recommand 128 bytes random string', // 建议使用 128 个字符的随机字符串
	cookie: {
		maxAge: 6000 * 1000
	}, //cookie生存周期60秒
	resave: true, //cookie之间的请求规则,假设每次登陆，就算会话存在也重新保存一次
	saveUninitialized: true //强制保存未初始化的会话到存储器
})); //这些是写在app.js里面的
// ===============================拦截器========================
var openPage = ['/', '/register', '/login', '/logout', '/notlog'];

app.use(function(req, res, next) {
	var url = req.originalUrl;
	if (openPage.indexOf(url) > -1) {
		next();
	} else {
		if (req.session.loginbean) {
			next();
		} else {
			res.redirect('/');
		}

	}
});
app.use('/', users);
app.use('/info', info);
app.use('/admin', admin);
app.use('/message', message);
app.use('/documents', documents);
// app.use('/users', );



// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});


var elastic = require('./modules/elasticsearch');
// elastic.indexExists().then(function(exists) {
// 	if (exists) {
// 		return elastic.deleteIndex();
// 	}
// }).then(function() {
// 	console.log('ffffffffff');
// 	return elastic.initIndex().then(elastic.initMapping).then(function() {
// 		//Add a few titles for the autocomplete
// 		//elasticsearch offers a bulk functionality as well, but this is for a different time

// 		console.log('ssssssssssssssss');
// 		var promises = [
			
// 		].map(function(bookTitle) {
// 			console.log('ggggggggggg');
// 			return elastic.addDocument({
// 				title: (bookTitle).toString(),
// 				content: bookTitle + " content",
// 				metadata: {
// 					titleLength: (bookTitle.length)
// 				}
// 			});
// 			console.log('eeeeeeeeeeeeeee');
// 		});
// 		console.log('wwwwwwwwwwwwwwwwwwwwww');
// 		return Promise.all(promises);
// 	});
// });
module.exports = app;