import Data from "../model/candidateModel.js"
import path from "path";
import reader from "xlsx";
import async from "async";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const checkAndUploadData = async (name, data) => {
  function checkEmail(currData) {
    return currData.Email === data.Email;
  }

  await Data.findOne({ name: name })
    .then(async (found) => {
      if (!found) {
        const newData = new Data({
          name: name,
          candidateData: [data],
        });
        await newData.save();
      } else if (!found.candidateData.find(checkEmail)) {
        found.candidateData.push(data);
        await found.save();
      }
    })
    .catch((err) => console.log(err));
};

export const readAndUploadFile = async (filename) => {
  const filePath = path.join(__dirname, "..", "uploads", filename);

  const file = reader.readFile(filePath);
  const datas = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], {
    raw: false,
  });

  async.eachSeries(datas, async function (item, cb) {
    await checkAndUploadData(filename, item);
  });

  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
    else console.log("File Deleted Successfully");
  });
};
