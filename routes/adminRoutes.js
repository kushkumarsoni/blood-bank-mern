const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const { 
    getDonnersListController,
    getHospitalListController,
    getOrgListController,
    deleteUserController } = require('../controllers/adminController');

const router = express.Router();
//get all donners
router.get('/donner-list', authMiddleware,adminMiddleware,getDonnersListController);
router.get('/hospital-list', authMiddleware,adminMiddleware,getHospitalListController);
router.get('/org-list', authMiddleware,adminMiddleware,getOrgListController);
router.delete('/user-delete/:id', authMiddleware,adminMiddleware,deleteUserController);

module.exports = router;