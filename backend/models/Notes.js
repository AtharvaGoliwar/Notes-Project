import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notesSchema = new Schema({
    user:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const Notes = mongoose.model('Note',notesSchema)
