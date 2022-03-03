var express = require('express');
var router = express.Router();
const {hashing, hashCompare} = require('../librery/auth');
const {dburl,mongodb,MongoClient} = require('../dbConfig');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', async(req,res)=>{
  const client = await MongoClient.connect(dburl);
  try{
    
    const db = await client.db('mystudents');
    let user = await db.collections('auth').findOne({email:req.body.email})
    if(user){
      res.json({
        message: "User already exists"
      })
    }else{
      const hash = await hashing(req.body.password);
      res.body.password = hash;
      let document = await db.collections('auth').insertOne(req.body);
      res.json({
        messgae: "Account Created"
      })
    }
  }catch(error){
    res.send(error);
  }finally{
    client.close();
  }
})

router.post('/login', async(req,res)=>{

  try{
    const hash = await hashCompare(req.body.password,1);
    console.log(hash);
    res.send(hash);
  }catch(error){
    res.send(error);
  }
})

module.exports = router;