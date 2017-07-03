var express = require('express');
var router = express.Router();
var database = "postgres://tivngnhwlxtmkp:4f2f1fff9cc8065295ac874e18ddd8d9f322f536cc50c9aea6610ce4002d3cea@ec2-23-21-169-238.compute-1.amazonaws.com:5432/d6ns5drql89lm1";
var pg = require('pg').native;

router.get('/', function(req, res, next) {
  var userId = 88; // Change when cookies implemented TODO
  var userItems = [];

  pg.connect(database, function(err, client, done){
    if(err){
      throw err;
    }
    client.query("select useritems.id, useritems.name, items.description, items.price FROM useritems inner join items ON useritems.users = "+userId+" AND useritems.name = items.name;", function(err, result){
      
      if(err){ //Empty results
       res.status(500).send("Cart page cannot be loaded");
       done();
      }
      else{
        done();
        userItems = result.rows;
        console.log(userItems);
        res.render('cart', 
              { title: 'Cart Page',
                userCart: userItems
                 });
      }
    });
  });
});

router.get('/admin', function(req, res, next) {
  var userId = req.query.userId; // Change when cookies implemented TODO
  var userItems = [];
  console.log("Admin search userid"+userId);
  pg.connect(database, function(err, client, done){
    if(err){
      throw err;
    }
    client.query(" select*from userhistory where users="+userId+";", function(err, result){
      
      if(err){ //Empty results
       res.status(500).send("Cart page cannot be loaded");
       done();
      }
      else{
        done();
        userItems = result.rows;
        console.log(userItems);
        res.send(
              { message: 'Displaying history for requested user',
                logs: userItems
                 });
      }
    });
  });
});

router.post('/removeHistory', function(req, res, next) {
  console.log("History req.param: "+req.body.itemBought+req.body.description+req.body.price+req.body.id); // Returns value of itemBought.
  var userId = 88; //Will be changed once cookie is implemented TODO
  var name = req.body.itemBought;
  var description = req.body.description;
  var price = req.body.price;
  var id = req.body.id;

  pg.connect(database, function(err, client, done){
    if(err){
      throw err;
    }
    client.query("delete from userhistory where name='"+name+"' AND id="+id+";", function(err, result){
      if(err){ //Empty results
       res.status(500).send("Product cannot be removed from history" +err);
       done();
      }
      else{
        done();
        res.send( 
          { message: 'Item removed in history' });
      }
    });

  });
});

//AJAX response for when user press the History tab
router.get('/history', function(req, res, next){
  var userId = 88; //Will be changed once cookie is implemented TODO
  var userHistory = [];

  pg.connect(database, function(err, client, done){
    if(err){
      throw err;
    }

    client.query("select*from userhistory where users="+userId+";", function(err, result){
      if(err){ //Empty results
       res.status(500).send("Product cannot be added to the cart" +err);
       done();
      }
      else{

        userHistory = result.rows;
        console.log(userHistory);
        done();
        res.send( 
          { message: 'Item added to history',
            history: userHistory });
      }
    });

  });
});

//AJAX response for when user press the Buy button
router.post('/buy', function(req, res, next){
  console.log("Cart req.param: "+req.body.itemBought+req.body.description+req.body.price+req.body.id); // Returns value of itemBought.
  var userId = 88; //Will be changed once cookie is implemented TODO
  var name = req.body.itemBought;
  var description = req.body.description;
  var price = req.body.price;
  var id = req.body.id;

  pg.connect(database, function(err, client, done){
    if(err){
      throw err;
    }
    
    client.query("insert into userhistory (users,name,price,description) values("+userId+",'"+name+"',"+price+",'"+description+"');", function(err, result){
      if(err){ //Empty results
       res.status(500).send("Insert into userhistory fail" +err);
       done();
      }
    });

    client.query("delete from useritems where name='"+name+"' AND id="+id+";", function(err, result){
      if(err){ //Empty results
       res.status(500).send("Product cannot be added to the cart" +err);
       done();
      }
      else{
        done();
        res.send( 
          { message: 'Item added to history' });
      }
    });

  });
});

//AJAX response for when user press the Remove button
router.post('/remove', function(req, res, next){
  console.log("Cart req.param: "+req.body.itemBought+req.body.description+req.body.price+req.body.id); // Returns value of itemBought.
  var userId = 88; //Will be changed once cookie is implemented TODO
  var name = req.body.itemBought;
  var description = req.body.description;
  var price = req.body.price;
  var id = req.body.id;

  pg.connect(database, function(err, client, done){
    if(err){
      throw err;
    }
    client.query("delete from useritems where name='"+name+"' AND id="+id+";", function(err, result){
      if(err){ //Empty results
       res.status(500).send("Product cannot be added to the cart" +err);
       done();
      }
      else{
        done();
        res.send( 
          { message: 'Item removed in cart' });
      }
    });

  });
});
//AJAX response for when user press the Add to Cart button
router.post('/:item', function(req, res, next){
  console.log("Cart req.param: "+req.body.itemBought); // Returns value of itemBought.
  var userId = 88; //Will be changed once cookie is implemented TODO
  var itemBought = req.body.itemBought;

  pg.connect(database, function(err, client, done){
    if(err){
      throw err;
    }
    client.query("insert into useritems (users, name) values("+userId+",'"+itemBought+"');", function(err, result){
      if(err){ //Empty results
       res.status(500).send("Product cannot be added to the cart" +err);
       done();
      }
      else{
        done();
        res.send( 
          { message: 'Item added to cart' });
      }
    });
  });
});

module.exports = router;