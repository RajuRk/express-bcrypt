var express = require('express');
var router = express.Router();
const {hashing, hashCompare, role, adminrole} = require('../librery/auth');
const {dburl,mongodb,MongoClient} = require('../dbConfig');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', role, async(req,res)=>{
  const client = await MongoClient.connect(dburl);
  try{
    const db = await client.db('mystudents');
    let user = await db.collection('auth').findOne({email:req.body.email})
    if(user){
      res.json({
        message: "User already exists"
      })
    }else{
      const hash = await hashing(req.body.password);
      req.body.password = hash;
      let document = await db.collection('auth').insertOne(req.body);
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

router.post('/admin-login',adminrole, async(req,res)=>{
  const client = await MongoClient.connect(dburl);
  try{
    const db = await client.db('mystudents');
    let user = await db.collection('auth').findOne({email:req.body.email})
    if(user){
      const compare = await hashCompare(req.body.password, user.password);
      if(compare === true){
        res.json({
          message: "User login successfully"
        })
      }else{
        res.json({
          message: "Wrong Email/Password"
        })
      }
    }else{
      res.json({
        messsage: "User does not exist"
      })
    }
    // const hash = await hashCompare(req.body.password,1);
    // console.log(hash);
    // res.send(hash);
  }catch(error){
    res.send(error);
  }finally{
    client.close();
  }
})

router.post('/login', async(req,res)=>{
  const client = await MongoClient.connect(dburl);
  try{
    const db = await client.db('mystudents');
    let user = await db.collection('auth').findOne({email:req.body.email})
    if(user){
      const compare = await hashCompare(req.body.password, user.password);
      if(compare === true){
        res.json({
          message: "User login successfully"
        })
      }else{
        res.json({
          message: "Wrong Email/Password"
        })
      }
    }else{
      res.json({
        messsage: "User does not exist"
      })
    }
    // const hash = await hashCompare(req.body.password,1);
    // console.log(hash);
    // res.send(hash);
  }catch(error){
    res.send(error);
  }finally{
    client.close();
  }
})

router.post('/forgot-password',async(req, res) => {
  const client = await MongoClient.connect(dburl);
  try{
    const db = await client.db('mystudents');
    let user = await db.collection('auth').findOne({email:req.body.email});
    if(user){
      const hash = await hashing(req.body.password);
      let document = await db.collection('auth').updateOne({email:req.body.email}, {$set:{password:hash}});
      res.json({
        message: "Password Changed Successfully"
      })
    }else{
      res.json({
        message:"User does not exist"
      })
    }
  }catch(error){
    res.send(error)
  }finally{
    client.close();
  }
})

router.put('/reset-password', async(req, res) => {
  const client = await MongoClient.connect(dburl);
  try{
    const db = await client.db('mystudents');
    let user = await db.collection('auth').findOne({email:req.body.email});
    if(user){
      const compare = await hashCompare(req.body.oldpassword, user.password);
      if(compare){
        const hash = await hashing(req.body.newpassword);
        let document = await db.collection('auth').updateOne({email:req.body.email}, {$set:{password:hash}});
        res.json({
          message: "Password Changed Successfully"
        })
      }else{
        res.json({
          message: "Incorrect Password"
        })
      }
    }else{
      res.json({
        message: "User does not exit"
      })
    }
  }catch(error){
    res.send(error)
  }finally{
    client.close();
  }
})

module.exports = router;