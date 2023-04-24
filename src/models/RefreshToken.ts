import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const RefreshToken = new Schema({
    expireIn: {
        type: Number,
        require: true,
    },
    refresh_token: {
        type: String,
        require: true,
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: true,
        unique: true,
    },
});

export default mongoose.model('refresh_token', RefreshToken);
