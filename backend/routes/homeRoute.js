import express from "express";
import { getHome,getAbout,postNote,getNotes, deleteNote,updateNote } from "../controller/mainController.js";
import authenticateJWT from "../middleware/authMiddleware.js";
export const router = express.Router();


router.get("/",getHome)
router.get("/about",authenticateJWT,getAbout)
router.post("/postnote",authenticateJWT,postNote)
router.get("/getnote",authenticateJWT,getNotes)
router.delete("/deletenote",authenticateJWT,deleteNote)
router.put("/updatenote",authenticateJWT,updateNote)
