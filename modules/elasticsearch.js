var elasticsearch = require('elasticsearch');
var elasticClient = new elasticsearch.Client({
  host: 'localhost:9200'
});

var indexName = "documents";
function getSuggestions(input) { 
    return elasticClient.search({
        index: indexName,
        body: {
            query: {
            	match:{
                title: input,            
                }
            }
        }
    })// .then(function (response) {
    // var hits = response.hits.hits;
    // console.log(response);
    //  });
}
exports.getSuggestions = getSuggestions;

function addDocument(document) {  
    return elasticClient.index({
        index: indexName,
        type: "suggest",
        body: {
            title: document.title,
            content: document.content,
            suggest: document.suggest
        }
    });
}
exports.addDocument = addDocument;

//删除索引用的
function deleteIndex() {  
    return elasticClient.indices.delete({
        index: indexName
    });
}

function deleteDocument() {  
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;