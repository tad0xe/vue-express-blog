const Category = require('../models/category');
const express = require('express');

const router = express.Router();


router.post(`/categories`, async (req, res) =>{
   try {
    let category = new Category();
        category.type= req.body.type;
       
    await category.save();
    res.json({
        status: true,
        message:"save succes"
    })
   } catch (error) {
    res.status(500).json({success: false, message:err.message})
   }


})

router.get(`/categories`, async (req, res) =>{
    try {
    let categories = await Category.find();

    res.json({
        status: true,
        categories: categories
    })
   } catch (error) {
    res.status(500).json({success: false, message:err.message})
   }
   
   
})

router.get(`/categories/:id`, async (req, res) => {
    try {
        let category = await Category.findOne({
          _id: req.params.id
        })
    
        res.json({
          success: true,
          category: category
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: err.message
        });
      }
  });
module.exports =router;