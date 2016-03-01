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
    "id": "youbikecollections" 
};
 


// queryCollection("0001", function(err, results) {
//     if(err) return console.log(err);
//     console.log(results.length);
//     console.log(typeof(results));
//     // console.log('Query results:\n' + JSON.stringify(results, null, '\t') + '\n');
//     console.log('Query results:\n' + results[1].mday +'\n');
// });

 
querydbFunc = function(documentId,documentMday,callback){
  var querySpec = {
      query: 'SELECT * FROM root r WHERE r.sno=@sno AND CONTAINS(r.mday, @day)',
      parameters: [
        {name: '@sno',value: documentId},
        {name: '@day',value: documentMday}
      ]
  };
var collectionUri = "dbs/" + config.dbDefinition.id + "/colls/" + config.collDefinition.id;
client.queryDocuments(collectionUri, querySpec).toArray(function(err, results) {
    if(err) 
      return callback(err);
    callback(null, results);
  });
}
createdocumentFunc = function(){
  var jsonObj = require(__dirname+"/../public/javascripts/YouBikeTP.json");
  var collectionUri = "dbs/" + config.dbDefinition.id + "/colls/" + config.collDefinition.id;
  var youbikelist = Object.keys(jsonObj.retVal).map(function(value){
                                                    return jsonObj.retVal[value]});
  for(var j = 0;j < youbikelist.length;j+=1){
    client.createDocument(collectionUri, youbikelist[j], function(err, document){
      if(err) return console.log(err);
      
      // console.log(youbikelist[j]);
      console.log("Document created with content: ", document);
    });
    // console.log("document is "+ youbikelist[i]);
  }
}

countCloseTimer = function(){
  querydbFunc("0001","20160226",function(err, results) {
    if(err) return console.log(err);
    // console.log(results.length);
    // console.log(typeof(results));
    // console.log('Query results:\n' + JSON.stringify(results, null, '\t') + '\n');
    console.log('Query results:\n' + results[1].sna +'\n');
    });
}
exports.querydbFunc = querydbFunc;
exports.createdocumentFunc = createdocumentFunc; 
exports.countCloseTimer = countCloseTimer; 



// module.exports = {

//   querydbFunc:function(documentId, documentMday,callback){
//       var querySpec = {
//           query: 'SELECT * FROM root r WHERE r.sno=@sno AND CONTAINS(r.mday=@day)',
//           parameters: [
//             {name: '@sno',value: documentId},
//             {name: '@day',value: mday}
//           ]
//       };
//       var collectionUri = "dbs/" + config.dbDefinition.id + "/colls/" + config.collDefinition.id;
//       client.queryDocuments(collectionUri, querySpec).toArray(function(err, results) {
//           if(err) 
//             return callback(err);

//           callback(null, results);
//       });
//     }
//     // createdocument:function(){
//     //   var jsonObj = require("../public/javascript/YouBikeTP.json");
//     //   //console.log(JSON.stringify(jsonObj.retVal));
//     //   var collectionUri = "dbs/" + config.dbDefinition.id + "/colls/" + config.collDefinition.id;
//     //   var youbikelist = Object.keys(jsonObj.retVal).map(function(value){
//     //                                                 return jsonObj.retVal[value]});
//     //   for(i=0;i<youbikelist.length;i++){
//     //         client.createDocument(collectionUri, youbikelist[i], function(err, document) {
//     //         if (err) return console.log(err);
//     //          console.log("Document created with content: ", document);
//     //         });
//     //   }
//     // }


// }