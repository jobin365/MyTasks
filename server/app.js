const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path=require("path")
mongoose.connect('mongodb://localhost:27017/gidDB');
app.use(express.json())

app.use(express.static(path.join(__dirname, 'build')));

const List = mongoose.model("List", { name: String, items: [] });

app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get("/getFirstList", (req, res) => {
  console.log("getFirstList");
  List.findOne(function (err, docs) {
    if(!docs) res.send({id:undefined})
    else res.send({id:docs._id});
  });
});

app.get("/getListList", (req, res) => {
  console.log("getListList");
  const list = [];
  List.find(function (err, docs) {
      docs.forEach((item) => {
        list.push({ name: item.name, id: item._id });
      });
      res.send({ lists: list });
  });
});
//////////////Not used
app.get("/getListItems/:listID", (req, res) => {
  console.log("getListItems");
  const listID = req.params.listID;
    console.log(listID)
    List.findById(listID, function (err, docs) {
      res.send({ items: docs.items });
    });
});

app.get("/getListName/:listID", (req, res) => {
  console.log("getListName");
  const listID = req.params.listID;
    console.log(listID)
    List.findById(listID, (err, docs) => {
      res.send({ name: docs.name });
    });
});
////////////////


app.get("/getList/:listID",(req,res)=>{
  console.log('get list');
  const listID=req.params.listID;
  List.findById(listID,function(err,docs){
    if(err) {console.log(err)}
    else res.send(docs)
  })
})

app.patch("/addItem/:listID",(req,res)=>{
  console.log('add');
  const listID=req.params.listID;
  const newItem=req.body.item;
  List.findByIdAndUpdate(listID,{$push:{items:newItem}},function(err,docs){
    if(err) console.log(err);
    res.send('success');
  })
})

app.patch("/deleteItem/:listID",(req,res)=>{
  console.log('delete');
  const listID=req.params.listID;
  const index=req.body.index;
  List.findById(listID,(err,doc)=>{
    if(err) console.log(err);
    else{
      doc.items.splice(index,1);
      doc.save();
    }
  })
  res.send(index);
})

app.post("/createList",(req,res)=>{
  console.log('createlist');
  const listName=req.body.listName;
  console.log(listName)
  const newList=new List({name:listName,items:[]});
  newList.save().then(()=>{
    res.send({id:newList._id});
  });
})

app.delete("/deleteList/:listID",(req,res)=>{
  const listID=req.params.listID;
  console.log('got request to delete '+listID);
  List.deleteOne({_id:listID},function(err,docs){
    res.send('success');
  })
})

app.patch("/updateListName/:listID",(req,res)=>{
  const listID=req.params.listID;
  const newListName=req.body.newListName;
  List.findByIdAndUpdate(listID,{name:newListName},(err,docs)=>{
    res.send('success');
  })
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`);
});
