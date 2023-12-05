
const fs = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, 'dataFile.json');

async function readData() {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function writeData(data) {
  const lockfilePath = `${filePath}.lock`;

  try {
    await lockFile.lock(lockfilePath);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } finally {
    await lockFile.unlock(lockfilePath);
  }
}

async function findLab(username, password) {
  username = username.toLowerCase();
  password = password.toLowerCase();

  try {
    const data = fs.readFileSync('dataFile.json', 'utf8');
    const jsonData = JSON.parse(data);

    const labKeys = Object.keys(jsonData.labData);

    for (const labKey of labKeys) {
        const lab = labData[labKey];

        if (lab.name === username) {
            if (lab.password === password) {
                return lab.api;
            }else{
                return 'Incorrect password';
            }  
        } else {
            return 'Lab Not Found';
        }
    }
  } catch (error) {
    console.error('Error reading labData:', error.message);
    return null;
  }
  // return "yourTest"
}

module.exports = { readData, writeData, findLab };