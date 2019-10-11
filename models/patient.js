const mongoose = require('mongoose')
const {Schema} = mongoose
const bcrypt = require('bcryptjs')
const passportLocalMongoose =require('passport-local-mongoose')

const patientSchema = new Schema({
    firstName :{
        type:String,
        required: true
    },
    lastName:{
        type:String,
        required:true,
    },
    usertype:{
        type:String,
        required:true
    },
    phoneNumber:{
        required:true,
        type:String
    },
    fullAddress:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    // patientID:{
    //     type:String,
    //     required:true
    // },
    bloodGroup:{
        type:String,
        required:true
    },
    password:String,
    active:Boolean
})

patientSchema.plugin(passportLocalMongoose);
const Patient = mongoose.model('patient', patientSchema)
module.exports = Patient

module.exports.hashPassword = async (password)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt)
    }catch(error){
        throw new Error('hashing failed', error)
    }
}
module.exports.comparePasswords = async (password, hashPassword) => {
    try {
        return await bcrypt.compare(password, hashPassword)
    } catch (error) {
        throw new Error("comparing failed", error)
    }
}