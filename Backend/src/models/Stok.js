import mongoose from "mongoose";

const stokSchema = new mongoose.Schema({
    namaKandang: { type: String, required: true },
    deskripsi: { type: String, required: true },
    alamatLengkap: { type: String, required: true },
    ukuran : { type: String, required: true },
    stokAwal: { type: Number, required: true },
    metodeJual: { type: String, enum:["Per Kg", "Per Ekor"] , required: true },
    hargaSatuan: { type: Number, required: true },
    kondisi: { type: String, enum:["Sehat", "Sakit", "Penjarangan"], required: true },

}, { timestamps: true });

export default mongoose.model("Stok", stokSchema);