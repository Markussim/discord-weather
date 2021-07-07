const mongoose = require("mongoose"),
  ObjectID = require("mongodb").ObjectID;
let db;

//Connect to MongoDB
exports.cnctDB = (collectionname) => {
  let dbLink = `mongodb://localhost/${collectionname}`;
  mongoose.connect(dbLink, { useNewUrlParser: true, useUnifiedTopology: true });

  db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected to MongoDB using " + collectionname);
  });
};


exports.findInDB = async (Model) => {
  return await Model.find({});
};

exports.findUserWithID = async (Model, toFind) => {
  return await Model.findOne({ id: toFind });
};

exports.updateLoc = async (Model, id, loc) => {
  await Model.updateOne({ id: id }, { $set: { loc: loc } });
};

//takes input with type Model. Saves that model in Database. Cant be used before cnctDB or cnctDBAuth.
exports.saveToDB = (input) => {
  input.save(() => {});
};
