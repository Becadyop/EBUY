var express = require('express');
var router = express.Router();
var{
    adminhome,
    adminlogin,
    adminhomepage,
    addproduct,
    productpage
    

}=require('../Controllers/Admincontroller')

router.get('/',adminhome)
router.get('/adminhome',adminhomepage)
router.get('/addproduct',addproduct)
router.post('/dologin',adminlogin)
router.post('/addproduct',productpage)

  
module.exports = router;
