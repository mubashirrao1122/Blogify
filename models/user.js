const {Schema, model} = require('mongoose');
const { createHmac,randomBytes } = require('node:crypto');
const { generateToken } = require('../services/authentication');

const userSchema = new Schema({
    fullname: {type: String, required: true} ,
    email: {type: String, required: true, unique: true},
    salt: {type: String},
    password: {type: String, required: true},
    profileImage: {type: String, default: '/images/default.png'},
    role: {type: String, enum: ['user', 'admin'], default: 'user'}
}, {timestamps: true});


userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');
    user.salt = salt;
    user.password = hashedPassword;

    
    next();
});

userSchema.static('matchPasswordandGenerateToken', async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) return null;

    const salt = user.salt;
    const hashedPassword = user.password;
    const inputHashedPassword = createHmac('sha256', salt).update(password).digest('hex');

    if (inputHashedPassword === hashedPassword) {
        const token = generateToken(user);
        return  token; 
    }
    return null;    
});     

module.exports = model('User', userSchema);