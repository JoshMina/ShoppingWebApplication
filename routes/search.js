var express = require('express');
var router = express.Router();
var database = "postgres://tivngnhwlxtmkp:4f2f1fff9cc8065295ac874e18ddd8d9f322f536cc50c9aea6610ce4002d3cea@ec2-23-21-169-238.compute-1.amazonaws.com:5432/d6ns5drql89lm1";
var pg = require('pg').native;
/* GET users listing. */

//TODO
router.get('/', function(req, res, next) {
  console.log(process.env.DATABASE_URL);
  console.log(req.params.sometime);
  //console.log(req.query.paramName);
  console.log(req.query);
  res.render('search', 
              { title: 'Search Page',
                url: '/search'
                 });
});
//Tag can either be a brand , style or location for now. Will be changed later given the time
router.get('/:tag', function(req, res, next) {

  var tags = req.params.tag;
  var type= req.query.e;
  console.log(tags);
  console.log(type);
  var searchResults = [];
  pg.connect(database, function(err, client, done){
    if(err){
      throw err;
    }
    client.query("select * from items where "+tags+"='"+type+"';", function(err, result){
      if(err){
       res.status(500).send("Selection does not exist");
       done();
      }
      else{
        //TODO
        searchResults = result.rows;
        console.log(searchResults);
        res.render('search', 
          { title: 'Search Page',
            tag: type});  
      }
    });

  });

  // if (tags == "style"){
  //   // Connect to the database and do query search for the tag.
  //   type = req.query.sty;
  //   console.log(type);
  //   pg.connect(database, function(err, client, done){

  //     client.query("select from items where style='"+type"';", function(err, res){

  //     });

  //   });
});

module.exports = router;