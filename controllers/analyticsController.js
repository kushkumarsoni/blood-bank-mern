const mongoose = require('mongoose');
const inventoryModel = require('../models/inventoryModel');

const bloodGroupAnalyticsController = async (req,res) => {
    try{
        const bloodGroups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
        const bloodGroupData = [];
        const organisation = new mongoose.Types.ObjectId(req.body.userId);

        await Promise.all(bloodGroups.map(async (bloodGroup) => {

            //total in
            const totalIn = await inventoryModel.aggregate([
                {
                    $match: {
                        bloodGroup: bloodGroup , 
                        inventoryType: 'in',
                        organisation
                    }
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:'$quantity'}
                    }
                }
            ]);

            //total out
            const totalOut = await inventoryModel.aggregate([
                {
                    $match: {
                        bloodGroup: bloodGroup , 
                        inventoryType: 'out',
                        organisation
                    }
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:'$quantity'}
                    }
                }
            ]);

            //total available
            const availableBlood = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0);

            bloodGroupData.push({
                bloodGroup,
                totalIn:totalIn[0]?.total || 0,
                totalOut:totalOut[0]?.total || 0,
                availableBlood
            });
        }));

        return res.status(200).send({
            status:true,
            message: "Blood Group Analytics data Successfully!",
            bloodGroupData
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            status:false,
            message: "error while getting analytics of blood group",
            error
        });
    }
}

module.exports = {
    bloodGroupAnalyticsController,
}