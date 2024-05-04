const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");
const { request } = require("express");

const createInventoryController = async (req,res) => {
    try{
        const {email} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                status:false,
                message:"User not found"
            });
        }
        // if(inventoryType === 'in' && user.role !== 'donner'){
        //    // throw new Error("Only the donors can add inventory.");
        //     return res.status(403).send({
        //         status: false,
        //         message:'Only the donors can add inventory.'
        //     });
        // }

        // if(inventoryType === 'out' && user.role !== 'hospital'){
        //     return res.status(403).send({
        //         status: false,
        //         message:'Only the hospital can add inventory.'
        //     });
        // }

        if(req.body.inventoryType == 'out') {
            const requestBloodGroup = req.body.bloodGroup;
            const requestQuantityOfBlood = req.body.quantity;
            const organisation = new mongoose.Types.ObjectId(req.body.userId);

            //calculate blood quantity
            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {
                    $match:{
                        organisation,
                        inventoryType:'in',
                        bloodGroup:requestBloodGroup
                    }
                },{
                    $group:{
                        _id:'$bloodGroup',
                        total:{$sum:'$quantity'}
                    }
                }
            ]);

            const totalIn = totalInOfRequestedBlood[0]?.total || 0;

           const totalOutOfRequestBlood = await inventoryModel.aggregate([
            {
                $match:{
                    organisation,
                    inventoryType:'out',
                    bloodGroup:requestBloodGroup
                }
            },{
                $group:{
                    _id:'$bloodGroup',
                    total:{$sum:'$quantity'}
                }
            }
           ]);

           const totalOut = totalOutOfRequestBlood[0]?.total || 0;

           //check available quantity
           const availableQuantityOfBloodGroup = totalIn-totalOut;

           if(availableQuantityOfBloodGroup < requestQuantityOfBlood){
                return res.status(500).send({
                    status : false ,
                    message:`Avaiable blood group quantity ${availableQuantityOfBloodGroup} only`,
                });

            }
           req.body.hospital = new mongoose.Types.ObjectId(user?._id);
        }else{
            req.body.donner = new mongoose.Types.ObjectId(user?._id);
        }

        const inventory = new inventoryModel(req.body);
        await inventory.save();
        return res.status(201).send({
            status : true ,
            message:"New blood record added successfully",
        });
    }catch(error){
        return res.status(500).send({
            status: false,
            message:'Error in inventory create api',
            error
        });
    }
}

const getAllInventoryController = async (req,res) => {
    try{
        const inventories = await inventoryModel.find({organisation:req.body.userId})
        .populate("donner").populate("hospital").populate("organisation").sort({createdAt:-1});
        return res.status(200).send({
            status : true ,
            message:"Get All inventory record",
            data:inventories
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            status: false,
            message:'Error while fetching all records',
            error
        });
    }
}

const getDonnersController = async (req,res) => {
    try {
        const organisation = req.body.userId;
        const donnerId = await inventoryModel.distinct('donner',{ organisation });
        const donners = await userModel.find({_id:{$in:donnerId}});
        return res.status(200).send({
            status:true,
            message:"Fetch donners successfully",
            donners,
        });
    }catch(error) {
        console.log(error);
        return res.status(500).send({
            status:false,
            message: 'Error while getting donners',
            error
        });
    }
}

const getHospitalsController = async (req,res) => {
    try{
        const organisation = req.body.userId;
        const hospitalId = await inventoryModel.distinct('hospital',{ organisation });
        const hospitals = await userModel.find({_id:{$in:hospitalId}});
        return res.status(200).send({
            status:true,
            message:"Fetch Hospitals",
            hospitals,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            status:false,
            message: 'Error while getting hospitals data',
            error
        });
    }
}

const getOrganisationController = async (req,res) => {
    try{
        const donner = req.body.userId;
        const organisationId = await inventoryModel.distinct('organisation',{ donner });
        const organisations = await userModel.find({_id:{$in:organisationId}});
        return res.status(200).send({
            status:true,
            message:"Fetch organisations",
            organisations,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            status:false,
            message: 'Error while getting hospitals data',
            error
        });
    }
}

const getOrganisationForHispitalController = async (req,res) => {
    try{
        const hospital = req.body.userId;
        const organisationId = await inventoryModel.distinct('organisation',{ hospital });
        const organisations = await userModel.find({_id:{$in:organisationId}});
        return res.status(200).send({
            status:true,
            message:"Fetch organisations for hospital",
            organisations,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            status:false,
            message: 'Error while getting hospitals org data',
            error
        });
    }
}

const getInventoryHospitalController = async (req,res) => {
    try{
        const inventories = await inventoryModel.find(req.body.filters)
        .populate("donner").populate("hospital").populate("organisation")
        .sort({createdAt:-1});
        return res.status(200).send({
            status : true ,
            message:"Get all consumer inventory record",
            inventories
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            status: false,
            message:'Error while getting consumer inventory record',
            error
        });
    }
}

const recentInventoryController = async (req,res) => {
    try{
        const inventory = await inventoryModel.find({
            organisation:req.body.userId
        }).limit(3).sort({createdAt:-1});

        return res.status(200).send({
            status: true,
            message: "recent inventory fetched successfully",
            inventory,
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            status: false,
            message: "Error while getting recent inventory",
            error
        });
    }
}

module.exports = {
    createInventoryController,
    getAllInventoryController,
    getDonnersController,
    getHospitalsController,
    getOrganisationController,
    getOrganisationForHispitalController,
    getInventoryHospitalController,
    recentInventoryController,
}