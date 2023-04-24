import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Geography = new Schema({
    question: {
        type: String,
        required: true,
    },

    answers: [
        {
            text: {
                type: String,
                require: true,
            },
            isCorrect: {
                type: Boolean,
                default: false,
            },
        },
        {
            text: {
                type: String,
                require: true,
            },
            isCorrect: {
                type: Boolean,
                default: false,
            },
        },
        {
            text: {
                type: String,
                require: true,
            },
            isCorrect: {
                type: Boolean,
                default: false,
            },
        },
        {
            text: {
                type: String,
                require: true,
            },
            isCorrect: {
                type: Boolean,
                default: false,
            },
        },
    ],
});

export default mongoose.model('geography', Geography);
