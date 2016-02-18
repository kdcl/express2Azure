var documentdb = require("documentdb");
var config = require("./config");
// 透過 DocumentDB 帳號基本資料，建立 DocumentDB 的 DocumentClient 物件
var urlConnection = "https://testyoubikedb.documents.azure.com:443/";                  
var auth = { 
    "masterKey": "jnjYPbVWgXVmZ2/9iHvGvEeLVvJ2DP0hUbn+Xwt3keay5NfRgnjXlPaNdMHZAUNUmMWTzfRaISr+SunXIWqbuw=="
};
var client = new documentdb.DocumentClient(urlConnection, auth);
 
// 定義 Database 與 Collection 的名稱，以及 Document 內容
var databaseDefinition = { 
    "id": "youbikes" 
};
 
var collectionDefinition = { 
    "id": "youbikecollection" 
};
 


// queryCollection("0001", function(err, results) {
//     if(err) return console.log(err);
//     console.log(results.length);
//     console.log(typeof(results));
//     // console.log('Query results:\n' + JSON.stringify(results, null, '\t') + '\n');
//     console.log('Query results:\n' + results[1].mday +'\n');
// });

module.exports = function(documentId, callback){
  var querySpec = {
      query: 'SELECT * FROM root r WHERE r.sno=@sno',
      parameters: [{
          name: '@sno',
          value: documentId
      }]
  };
  var collectionUri = "dbs/" + config.dbDefinition.id + "/colls/" + config.collDefinition.id;
  client.queryDocuments(collectionUri, querySpec).toArray(function(err, results) {
      if(err) 
        return callback(err);

      callback(null, results);
  });
}