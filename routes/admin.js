var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");



var Job = require('../models/job');
var admin= require('../models/head')



module.exports = router;