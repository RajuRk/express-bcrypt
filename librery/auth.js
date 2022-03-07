const bcrypt = require('bcryptjs');
const hashing = async (value) => {
    try{
       const salt = await bcrypt.genSalt(10);
       console.log("Salt",salt);
       const hash = await bcrypt.hash(value,salt);
       return hash;
    }catch(error){
       return error; 
    }
}

const hashCompare = async (password, hashValue) => {
    try{
        return await bcrypt.compare(password, hashValue)
    }catch(error){
        return error; 
    }
}

const role = async(req, res, next)=> {
    switch(req.body.role){
        case 1:console.log('Admin')
               next();
               break;
        case 2:console.log('Student')
               next();
               break;
        default: res.send({
            message: "Invalid Role, 1-Admin and 2-Student"
        })
        break; 
    }   
}

const adminrole = async(req, res, next) => {
    if(req.body.role == 1){
        next();
    }else{
        res.send({
            message: "Permission Denied"
        })
    }
}

module.exports = {hashing, hashCompare, role, adminrole}