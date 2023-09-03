import * as mongoose from "mongoose";

const DB_URI = "mongodb://localhost:27017/ytdb";

export function connect () {
    mongoose.connect(DB_URI)
}

connect();