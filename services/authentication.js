const e = require('express');
const JWT = require('jsonwebtoken');
const secret = 'Superman@123';

function generateToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        profileImage: user.profileImage,
        role: user.role
    };
    return JWT.sign(payload, secret);
}

function verifyToken(token) {
    try {
        return JWT.verify(token, secret);
    } catch (error) {
        return null;
    }
}

module.exports = { generateToken, verifyToken };    