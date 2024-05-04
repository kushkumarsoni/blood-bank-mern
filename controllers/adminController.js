const userModel = require('../models/userModel');

const getDonnersListController = async (req,res) => {
    try{
        const donners = await userModel.find({role:"donner"}).sort({createdAt:-1});
        return res.status(200).json({
            status:true,
            message:'donners list',
            donners,
            totalDonner: donners.length
        });
    }catch(error){
        return res.status(500).send({
            status:false,
            message: 'Error getting the list of donnors',
            error
        });
    }
}

const getHospitalListController = async (req,res) => {
    try{
        const hospitals = await userModel.find({role:"hospital"}).sort({createdAt:-1});
        return res.status(200).json({
            status:true,
            message:'Hospitals list',
            hospitals,
            totalHospital: hospitals.length
        });
    }catch(error){
        return res.status(500).send({
            status:false,
            message: 'Error getting the list of hospitals',
            error
        });
    }
}

const getOrgListController = async (req,res) => {
    try{
        const organisations = await userModel.find({role:"organisation"}).sort({createdAt:-1});
        return res.status(200).json({
            status:true,
            message:'organisations list',
            organisations,
            totalOrg: organisations.length
        });
    }catch(error){
        return res.status(500).send({
            status:false,
            message: 'Error getting the list of donnors',
            error
        });
    }
}

const deleteUserController = async (req,res) => {
    try{
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            status:true,
            message:'Record is deleted successfully',
        });
    }catch(error){
        return res.status(500).send({
            status:false,
            message: 'Error getting while deleting data',
            error
        });
    }
}

module.exports = {
    getDonnersListController,
    getHospitalListController,
    getOrgListController,
    deleteUserController
}