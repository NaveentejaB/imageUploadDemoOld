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

const merchantSchema = new mongoose.Schema({
    merchantID: Number,
    merchantName: String,
    merchantType: String,
    merchantEmail: String,
    merchantPassword: String,
    merchantLocation: String,
    merchantPricingPlan: {
        type: String,
        required: false,
        enum: ['PlanA', 'PlanB', 'PlanC'] // these are the plans and can changed as per required
    },
    merchantPricingStarted: Date,
    merchantPricingEnded: Date,
    merchantColourTheme: {
        type: String,
        required: false,
        enum: ['Red', 'Green', 'Blue'] // these are the plans and can changed as per required
    },
    merchantLogo: String, // containing the url path of the logo

});

const Merchant = mongoose.model('Merchant', merchantSchema);

// To fetch all the merchants.
app.get("/merchants",async (req, res) => {
    try {
        const merchants = await Merchant.find()
        return res.status(200).json({
            merchants: merchants,
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
app.get("/merchant/:id",async (req, res) => {
    try {
        const merchant = await Merchant.findOne({ merchantID : req.params.id })
        if (!merchant) {
            return res.status(404).json({
                message: "Merchant not found.",
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            merchant: merchant
        })
    } catch (err) {
        res.status(500).json({
            error: err.message,
            success: false
        })
    }
});

// To add the new Apparel
app.post("/merchant/create",(req,res)=>{
    const { id, name,  type, email, password, location,plan,startDate,endDate,theme,logo } = req.body;
    const newMerchant = new Merchant({
        merchantID: id,
        merchantName: name,
        merchantType: type,
        merchantEmail: email,
        merchantPassword: password,
        merchantLocation: location,
        merchantPricingPlan: plan,
        merchantPricingStarted: startDate,
        merchantPricingEnded: endDate,
        merchantColourTheme: theme,
        merchantLogo: logo,
    });
    Merchant.findOne({merchantID:id})
    .then(data => {
        if(data){
            return res.status(409).json({
                message: "merchant already exists",
                redirectURL: '/merchants'
            });
        }else{
            newMerchant.save();
            return res.status(200).json({
                message:`merchant with id ${id} added.`,
                success:true
            })
        }
    }).catch( err => {
        return res.status(500).json({
            error: err.message,
            success: false
        })
    })
});

//To delete the Apparel
app.delete("/merchant/delete/:id",async(req,res)=>{
    const id =req.params.id;
    try{
        const delMerchant = await Merchant.findOneAndDelete({merchantID:id});
        console.log(delMerchant);
        return res.status(200).json({
            apparel:delMerchant,
            message:`Merchant with id ${id} is deleted.`,
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

//to edit the apparel details
// app.put("/editApparel/:id",async (req, res) => {
//     try {
//         const oldApparelData = await Apparel.findOne({ apparelID: req.params.id })
//         // console.log(savingoldData);
//         const newApparel = {
//             apparelName: req.body.name,
//             imageUrl: req.body.avatarImage,
//             apparelID: req.body.id,
//             apparelMAppid :req.body.MAppid,
//             apparelType:req.body. type,
//             status : req.body.status 
            
//         }
//         const newApparelData = await Apparel.findOneAndReplace({apparelID:req.params.id},newApparel);
//         // console.log(newApparelData);
//         const newData = await Apparel.findOne({ apparelID: req.params.id })
//         // console.log(newData);
//         return res.status(200).json({
//             success: true,
//             newApparelData: newData,
//             oldApparelData:oldApparelData
//         })
//     } catch (err) {
//         res.status(500).json({
//             error: err.message,
//             success: false
//         })
//     }
// });