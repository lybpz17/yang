var express = require('express');
var router = express.Router();

var elastic = require('../modules/elasticsearch');

/* GET suggestions */
router.get('/suggest/:input', function(req, res, next) {
	elastic.getSuggestions(req.params.input).then(function(result) {
		console.log(result.hits.hits);
		res.render('home/result',{
			result:result.hits.hits
		})
	});
});

/* POST document to be indexed */
router.post('/document', function(req, res, next) {
	elastic.addDocument(req.body).then(function(result) {
		res.json(result)
	});
});

router.post('/del', function(req, res, next) {
	elastic.deleteIndex().then(function(result) {
		res.json(result)
	});
});

module.exports = router;