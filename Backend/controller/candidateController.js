import Data from "../model/candidateModel.js";
import async from "async";
import readXlsxFile from "read-excel-file/node";

export const checkAndUploadData = async (item, cb) => {
  try {
    const query = { Email: item.Email }; 

    const existingRecord = await Data.findOne(query);

    if (existingRecord) {
      console.log(`Duplicate found for email: ${item.Email}, skipping this record.`);
      return cb(); 
    } else {
      const newRecord = new Data({
        'Name of the Candidate': item['Name of the Candidate'],
        'Email': item.Email,
        'Mobile No.': item['Mobile No.'],
        'Date of Birth': item['Date of Birth'],
        'Work Experience': item['Work Experience'],
        'Resume Title': item['Resume Title'],
        'Current Location': item['Current Location'],
        'Postal Address': item['Postal Address'],
        'Current Employer': item['Current Employer'],
        'Current Designation': item['Current Designation'],
      });

      await newRecord.save();
      console.log(`Record for ${item.Email} uploaded successfully.`);
      return cb(); 
    }
  } catch (err) {
    console.error(`Error processing record for ${item.Email}:`, err);
    return cb(err); 
  }
};

export const readAndUploadFile = async (req, res) => {
  try {
    const rows = await readXlsxFile(req.file.path, { sheet: "Sheet1" });

    const headers = rows.shift();
    const data = rows.map(row => {
      const rowObject = {};
      headers.forEach((header, index) => {
        rowObject[header] = row[index];
      });
      return rowObject;
    });
    
    console.log(data);
    
    async.eachSeries(
      data,
      (item, cb) => {
        checkAndUploadData(item, cb);
      },
      function (err) {
        if (err) {
          console.error("An error occurred while processing the file:", err);
          if (!res.headersSent) {
            return res.status(500).json({ message: "Error processing file" });
          }
        }
      }
    );
  } catch (err) {
    console.error("Error reading file:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error reading file" });
    }
  }
};
