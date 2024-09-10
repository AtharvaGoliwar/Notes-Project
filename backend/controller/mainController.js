import { Notes } from "../models/Notes.js"
import mongoose from "mongoose"
import { getUser } from "../middleware/authMiddleware.js"

// let user={}

export const getHome = async (req,res)=>{
    res.json({message:"Hello World"})
}
export const getAbout = async (req,res)=>{
    let token = req.signedCookies.cookie
    let user = getUser(token)
    // console.log(user)
    // Object.keys(obj).map((key)=>{
    //     user[key] = obj[key]
    // })
    res.json({message:"Welcome to About page",user:user.displayName})
}

export const postNote = async (req,res)=>{
    let token = req.signedCookies.cookie
    let userObj = getUser(token)
    let note = req.body
    note["user"] = userObj.id
    try{
        await Notes.insertMany([note])
    res.json({message:"Successfully posted notes"})
    }catch(err){
        console.log(err)
    }
}

export const getNotes = async (req,res)=>{
    // console.log(user)
    const token = req.signedCookies.cookie;
    let user = getUser(token)
    try{
        let notes = await Notes.find({user:user.id})
        if(notes.length===0){
            return res.json({message:"No notes",notes:[]})
        }else{
            return res.json({notes:notes})
        }
    }catch(err){
        console.log(err)
    }
}

export const deleteNote = async(req,res)=>{
    // const token = req.signedCookies.cookie;
    // let user = getUser(token)

    try{
        let result = await Notes.findByIdAndDelete(req.query.id)
        if (result) {
            res.status(200).json({ message: 'Note deleted successfully' });
          } else {
            res.status(404).json({ message: 'Note not found' });
          }
    }catch(err){
        console.log(err)
    }
}

export const updateNote = async(req,res)=>{
    try{
        let result = await Notes.updateOne({_id:req.query.id},{$set:req.body.data})
        if(result){
            res.status(200).json({message:"Note Updated Successfully",body:req.body,id:req.query.id})
        }else{
            res.status(404).json({message: "Note not updated due to err"})
        }
    }catch(err){
        console.log(err)
    }
}