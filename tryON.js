const express = require("express")
const mongoose = require("mongoose")
const bodyParser =require("body-parser")
const axios = require("axios")
const multer = require("multer")
const fs = require("fs")
const path = require('path')
const { Buffer } = require("node:buffer");

mongoose.connect("mongodb://localhost:27017/tryondb",{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
})

const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')))

const outputImgSchema = new mongoose.Schema({
    imgUrl: {type: String,required:true},
    createdAt: { type: Date, default: Date.now }
})

const customerSchema = new mongoose.Schema({
    customerID: {
        type: String
    },
    // only update customerOutputImages in the model of customer
    customerOutputImages:[outputImgSchema],
})

// storage middleware for uploading images
const storage = multer.diskStorage({
    destination:'./public/upload',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    },
})

// creating a multer instance with the specified storage
const upload = multer({
    storage: storage,
    fileFilter:(req, file, cb)=>{
        if(
            file.mimetype == 'image/jpeg' ||
            file.mimetype == 'image/jpg' ||
            file.mimetype == 'image/png' 
        ){
            cb(null, true)
        }
        else{
            cb(null, false);
            cb(new Error('Only jpeg,  jpg , and png Image allowed'))
        }
       }
})

const Customer = mongoose.model("Customer", customerSchema)

app.get("/:customerID/images",async(req,res)=>{
    try{
        const customerID = req.params.customerID
        const cs =await Customer.findOne({customerID:customerID})
        const stuff = cs.customerOutputImages
        console.log(stuff);
        res.status(200).json({
            stuff,
            success:true
        })
    }catch(err){
        res.status(500).json({
            message:err.message,
            success:false
        })
    }
})

app.post("/:customerID/upload_image",upload.single('file'),async(req,res)=>{
    try{
        const customerID = req.params.customerID
        const customer = await Customer.findOne({customerID:customerID})
        const imgUrls =  customer.customerOutputImages
        console.log(imgUrls);
        const newImg = {
            imgUrl : "/upload/"+req.file.filename
        }
        console.log(newImg);
        imgUrls.push({imgUrl : "/upload/"+req.file.filename})
        console.log(imgUrls);
        const update = await Customer.findOneAndUpdate({customerID:customerID},{customerOutputImages:imgUrls})
        res.status(200).json({
            message:"hell",
            success : true
        })
    }catch(err){
        res.status(500).json({
            message:err.message,
            success:false
        })
    }
})


app.post("/add/customer",async(req,res)=>{
    try{
        // , customerimg, phone, email
        const {id} = req.body
        const newCustomer =new Customer ({
            customerID:id
        })
        await newCustomer.save()
        res.status(200).json({
            message:"new customer added",
            newCustomer : newCustomer,
            success:true
        })
    }catch(err){
        res.status(500).json({
            message:err.message,
            success:false
        })
    }
})







// routes to get the outputed images from VTR
app.get("/outputImages/:customerID",async(req,res)=>{
    try{
        const customer =await Try.findOne({customerID:req.params.customerID})
        const images = customer.customerOutputImages
        
        res.status(200).json({
            customerVTEimages :images,
            success : true
        })
    }catch(err){
        res.status(500).json({
            message:err.message,
            success:false
        })
    }
})

app.listen(3000,()=>{
    console.log("port is succefully running on port 3000")
})