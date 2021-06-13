const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    identity: { type: Number, required: true, unique: true },
    salt:{type: String, required: true, unique: true},
    password: { type: String, required: true },
    masterPassword: { type: String, required: true },
});

const userS = mongoose.model('User', userSchema);

const passwordSchema = new Schema({
    website: { type: String, required: true },
    user: { type: String, required: true },
    pass: { type: String, required: true },
    link: { type: Number, required: true }
});

/*const passwordSchema = new Schema({
    user: { type: String, required: true },
    pass: { type: String, required: true },
    link: { type: Schema.Types.Number, ref:'User', required: true }
});*/

const passwordS = mongoose.model('Password', passwordSchema);

userSchema.plugin(uniqueValidator);
passwordSchema.plugin(uniqueValidator);

exports.User = userS;
exports.Password = passwordS;
