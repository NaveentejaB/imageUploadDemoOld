const express = require("express");
const mongoose = require("mongoose");
const bodyParser =require("body-parser");

mongoose.connect("mongodb://localhost:27017/apparaldb",{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    family: 4,
});
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const apparalSchema = new mongoose.Schema({
    apparelID: String,
    apparelName: String,
    apparelType: String,
    apparelMAppid:String,
    imageUrl: String, // uploading images and store the path
    uploadDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});
const Apparel = mongoose.model('Apparel', apparalSchema);

// To fetch all the Apparels.
app.get("/apparels",async (req, res) => {
    try {
        const apparels = await Apparel.find()
        return res.status(200).json({
            apparels: apparels,
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            error: err.message,
            success: false
        })
    }
}); 
  


//to fetch a specific apparel
app.get("/apparel/:id",async (req, res) => {
    try {
        const apparel = await Apparel.find
        if (!apparel) {
            return res.status(404).json({
                message: "Apparel not found.",
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            apparel: apparel
        })
    } catch (err) {
        res.status(500).json({
            error: err.message,
            success: false
        })
    }
});

// To add the new Apparel
app.post("/apparel/create",(req,res)=>{
    const { id, name,  type, MAppid, status, avatarImage } = req.body;
    const newApparel = new Apparel({
        apparelName: name,
        imageUrl: avatarImage,
        apparelID: id,
        apparelMAppid :MAppid,
        apparelType: type,
        uploadDate: Date.now(),
        status : status 
    });
    Apparel.findOne({apparelID:id})
    .then(data => {
        if(data){
            return res.status(409).json({
                message: "Apparel already exists",
                redirectURL: '/apparels'
            });
        }else{
            newApparel.save();
            return res.status(200).json({
                message:`Apparel with id ${id} added.`,
                apparel:newApparel
            })
        }
    }).catch( err => {
        return res.status(500).json({
            error: err.message,
            success: false
        })
    })
});

//to edit the apparel details
app.put("/apparel/edit/:id",async (req, res) => {
    try {
        const oldApparelData = await Apparel.findOne({ apparelID: req.params.id })
        const newApparel = {
            apparelName: req.body.name,
            imageUrl: req.body.avatarImage,
            apparelID: req.body.id,
            apparelMAppid :req.body.MAppid,
            apparelType:req.body. type,
            status : req.body.status 
            
        }
        const newApparelData = await Apparel.findOneAndReplace({apparelID:req.params.id},newApparel);
        const newData = await Apparel.findOne({ apparelID: req.params.id });
        return res.status(200).json({
            success: true,
            newApparelData: newData,
            oldApparelData:oldApparelData
        })
    } catch (err) {
        res.status(500).json({
            error: err.message,
            success: false
        })
    }
});
//To delete the Apparel
app.delete("/apparel/delete/:id",async(req,res)=>{
    const id =req.params.id;
    try{
        const delApparel = await Apparel.findOneAndDelete({apparelID:id});
        console.log(delApparel);
        return res.status(200).json({
            apparel:delApparel,
            message:`Apparel with id ${id} is deleted.`,
            success:true
        })
    }catch (err) {
        res.status(500).json({
            error: err.message,
            success: false
        })
    }
})



app.listen(3000,(req,res)=>{
    console.log("server running in 3000");
});


