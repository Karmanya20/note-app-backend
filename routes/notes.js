const express=require('express');
const router=express.Router();
const Note=require('../models/Note');
const fetchuser=require('../middleware/fetch');
const { body, validationResult } = require('express-validator');
//fetching notes of a user
router.get('/fetchnotes',fetchuser, async (req,res)=>{
    try {
        const notes=await Note.find({user: req.user.id})
        res.json(notes)   
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occured.")
    }
})
//adding Notes
router.post('/addnotes',fetchuser,[
    body('title',"Enter a title of valid length.").isLength({min: 3}),
    body('description', "Description should have atleast 5 characters.").isLength({min: 8})], async (req, res)=>{
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
         }
         const {title, description,tag}=req.body;
         try {
            const note=new Note({title,description,tag,user:req.user.id})
            const saved=await note.save();
            res.json(saved);
         } catch (error) {
            console.error(error.message);
        res.status(500).send("Some error occured.")
         }
        })
        router.put('/update/:id',fetchuser,async (req,res)=>{
            const{title,description,tag}=req.body;
            const newNode={};
            if(title){newNode.title=title}
            if(description){newNode.description=description}
            if(tag){newNode.tag=tag}
            let note=await Note.findById(req.params.id);
            if(!note){
                return res.status(404).send("Not found")
            }
            if(note.user.toString()!==req.user.id){
                return res.status(401).send("Not Allowed")
            }
            note = await Note.findByIdAndUpdate(req.params.id,{$set:newNode})
            res.json(note);
        })
        router.delete('/delete/:id',fetchuser,async (req,res)=>{
            const{title,description,tag}=req.body;
            const newNode={};
            if(title){newNode.title=title}
            if(description){newNode.description=description}
            if(tag){newNode.tag=tag}
            let note=await Note.findById(req.params.id);
            if(!note){
                return res.status(404).send("Not found")
            }
            if(note.user.toString()!==req.user.id){
                return res.status(401).send("Not Allowed")
            }
            note = await Note.findByIdAndDelete(req.params.id,{$set:newNode})
            res.json(note);
        })
module.exports=router;