import mongoose from "mongoose";

const kandangSchema = new mongoose.Schema({
    namaKandang: { type: String, required: true},
    alamat: { type: String, required: true},
    kapasitas: { type: Number, required: true},
    kontak: {
        nama: { type: String, required: true},
        nomorTelepon: { type: String, required: true}
    }
}, {Timestamps: true});

export default mongoose.model("Kandang", kandangSchema);
