import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    jenisAkun: {type: String, enum: ["Pembeli", "Peternak", "Admin"], required: true},
    namaLengkap: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    nomorTelepon: {type: String, required: true},
    alamat: {type: String, required: true},
    namaBank: {type: String, required: true},
    nomorRekening: {type: String, required: true},
    namaPemilikRekening: {type: String, required: true},
    // UNTUK VERIFIKASI DATA
    verificationStatus: {
        type: String,
        enum: ['not_verified', 'pending', 'approved', 'rejected'],
        default: 'not_verified'
    },
    ktpImageUrl: {
        type: String,
        default: null
    },
    rejectionReason: {
        type: String,
        default: null
    }
}, {timestamps: true});



export default mongoose.model("User", userSchema);