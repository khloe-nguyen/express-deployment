const mongoose = require("mongoose");

const customer = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  image: String,
});

module.exports = mongoose.model('customers', customer) //kqua tra ve cua 1 module.exports la 1 model
