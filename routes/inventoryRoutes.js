const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createInventoryController,
getAllInventoryController, 
getDonnersController,
getHospitalsController,
getOrganisationController,
getOrganisationForHispitalController,
getInventoryHospitalController,
recentInventoryController } = require('../controllers/inventoryController');

const router = express.Router();

//inventory create
router.post("/create",authMiddleware,createInventoryController);
router.get("/get-inventory",authMiddleware,getAllInventoryController);
router.post("/get-inventory-hospital",authMiddleware,getInventoryHospitalController);
router.get('/get-donners',authMiddleware,getDonnersController);
router.get('/get-hospitals',authMiddleware,getHospitalsController);
router.get('/get-organisations',authMiddleware,getOrganisationController);
router.get('/get-organisations-for-hospital',authMiddleware,getOrganisationForHispitalController);
router.get('/get-recent-inventory',authMiddleware,recentInventoryController);

module.exports = router;