require('dotenv').config();

const express = require('express');
const { registerGoogleAuth } = require('./auth/google');

const app = express();

registerGoogleAuth(app);

module.exports = { app };
