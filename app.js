//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose=require("mongoose");

const done = "Your order has been placed. Information about the delivery and installation will be sent to you.If there are any issues or queries then contact us in instagram @sthneos__ . We are always open to sugessions,so if you want a custom  product then leave a review. Thank you for choosing STHENOS."

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb+srv://sarvesh3:Chithi1977@cluster0.qittl.mongodb.net/buyersDB",{ useNewUrlParser: true  ,useUnifiedTopology: true });

var del="";
var x;
var cost;
var delemail="";
var delephone;

const buyerSchema=new mongoose.Schema({
  name:String,
  email:String,
  address:String,
  instagramid:String,
  ph:Number,
  products:String,
  quantity:Number,
  totalCost:Number
});



const Buyer=new mongoose.model("Buyer",buyerSchema);

const customSchema={
name:String,
  email:String,
  request:String
}



const Requests=new mongoose.model("Request",customSchema);


const cancelschema={
  email:String,
  phone:Number,
  productName:String
}

const Canceled=new mongoose.model("Cancel",cancelschema);





app.get("/",function(req,res){
    res.render("home");


});




app.get("/sthenos/:id",function(req,res){
  const item=req.params.id;
    x=item;
  res.render("buy",{item:item})
});


app.post("/buy",function(req,res){
  if(x==="STHENOS WALL MOUNTED PULLUP BAR"){
    cost=1750*req.body.Quantity;
  }
  else if(x==="STHENOS WALL MOUNTED DIBS BAR"){
     cost=1650*req.body.Quantity;
  }

  else if(x==="STHENOS PLASTIC PARALLETTES"){
     cost=1500*req.body.Quantity;
  }
  else if(x==="STHENOS METAL PARALLETTES AND DIPS BAR"){
     cost=5000*req.body.Quantity;
  }
  else if(x==="STHENOS MULTI BAR"){
     cost=3500*req.body.Quantity;
  }
else if(x==="STHENOS DUMBBELLS"){
  cost=100*req.body.Quantity;
}

  const newBuyer=new Buyer({
    name:req.body.name,
    email:req.body.username,
    address:req.body.address,
    instagramid:req.body.insta,
    ph:req.body.phone,
    products:x,
    quantity:req.body.Quantity,
    totalCost:cost
  })
  if((req.body.username)&&(req.body.phone)&&(req.body.insta)&&(req.body.Quantity))
  {
    newBuyer.save();
    res.render("done",{done:done,x:x,quantity:req.body.Quantity,cost:cost})
  }
});



app.get("/buy",function(req,res){
  res.redirect("/");

});



app.get("/review",function(req,res){
res.render("review");
});


app.post("/review",function(req,res){
  const request=new Requests({
    name:req.body.name,
    email:req.body.email,
    request:req.body.review
  })
request.save();
  res.redirect("/");
});



app.get("/ordersList",function(req,res){
  Buyer.find({},function(err,found){
    if(err){
      console.log(err);
    }
    res.render("orders",{orders:found});

  })

});



app.get("/reviewlist",function(req,res){
  Requests.find({},function(err,reviews){
    if(err){
      console.log(err);
    }
    res.render("reviewlist",{reviews:reviews})

  });
})



app.get("/delete/:id",function(req,res){
  Buyer.deleteOne({_id:req.params.id},function(err){
    if(err){
      console.log(err);
    }
    else{
      console.log("Item sent and deleted");
      res.redirect("/ordersList");
    }
  })
});


app.get("/deletereview/:id",function(req,res){
  Requests.deleteOne({_id:req.params.id},function(err){
    if(err){
      console.log(err);
}
else
res.redirect("/reviewlist");
  })
})







app.get("/cancel",function(req,res){
  res.render("cancel");
});

app.post("/cancel",function(req,res){
  Buyer.findOne({email:req.body.Email,ph:req.body.Phone},function(err,found){
if(err){
  console.log(err);
}
  if(found){
    Buyer.deleteOne({email:req.body.Email,ph:req.body.Phone},function(err){
      if(err){
        console.log(err);
      }
      delemail=req.body.Email;
      delephone=req.body.Phone;
     deleordername=req.body.ordername;
      const cancell=new Canceled({
         email:delemail,
        phone:delephone,
        productName:deleordername
  })
  cancell.save();
   res.redirect("/");
 });
  }

});

});



app.get("/cancellist",function(req,res){
  Canceled.find({},function(err,deleteditems){
    if(err){
      console.log(err);
    }
    res.render("cancellist",{deleteditems:deleteditems});
  })
});









app.get("/home/happy",function(req,res){
Requests.find({},function(err,reviews){
  if(err){
    console.log(err);
  }
  res.render("happy",{reviews:reviews});
})
});








app.listen(3000, function() {
  console.log("Server started on port 3000");
});
