import mongoose from "mongoose";

const dataSchema = mongoose.Schema({
  'Name of the Candidate': {
    type: String,
  },
  'Email': {
    type: String,
  },
  'Mobile No.': {
    type: String,
  },
  'Date of Birth': {
    type: String,
  },
  'Work Experience': {
    type: String,
  },
  'Resume Title': {
    type: String,
  },
  'Current Location': {
    type: String,
  },
  'Postal Address': {
    type: String,
  },
  'Current Employer': {
    type: String,
  },
  'Current Designation': {
    type: String,
  }
});

export default mongoose.model("data", dataSchema);