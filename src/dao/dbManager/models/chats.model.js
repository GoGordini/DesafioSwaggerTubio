import mongoose from "mongoose";
const chatsCollection = "messages";
const chatsSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true //por default es false//
    },
    message: {
        type: String,
        required: true //por default es false//
    }
});

export const chatsModel = mongoose.model(chatsCollection,chatsSchema);
