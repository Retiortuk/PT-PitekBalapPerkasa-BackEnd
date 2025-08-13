import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    jenisAkun: {type: String, enum: ["Pembeli", "Peternak"], required: true},
    namaLengkap: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    nomorTelepon: {type: String, required: true},
    alamat: {type: String, required: true},
    namaBank: {type: String, required: true},
    nomorRekening: {type: String, required: true},
    namaPemilikRekening: {type: String, required: true}
}, {timestamps: true});

export default mongoose.model("User", userSchema);