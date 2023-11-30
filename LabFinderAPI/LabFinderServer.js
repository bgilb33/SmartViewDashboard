const express = require('express');
const app = express();
const port = 3003;

// Middleware for logging and parsing JSON in the request body
app.use(express.json());

// Define a POST endpoint
app.get('/getAPI', (req, res) => {
    // Log the data payload

    // Get the query parameter from the URL
    const nameOfLab = req.query.labName;
    const passwordOfLab = req.query.labPassword;


    const returnString = findLab(nameOfLab,passwordOfLab);

    

    // Log the parameters
    // res.send('ID from query:', idFromQuery);
    res.send(`${returnString}`);


    // Respond with a message
    // res.send("Helloe Benji, it's a breezy 100 degrees outside");
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

function findLab(username, password) {

    username = username.toLowerCase();
    password = password.toLowerCase();

    const labKeys = Object.keys(labData);

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
}

const labData = {
    lab1: {
        password: 'pi4life',
        name: 'nia lab',
        api: 'https//1'
    },
    lab2: {
        password: 'password2',
        name: 'little lab',
        api: 'https//2'
    },
    lab3: {
        password: 'password3',
        name: 'green lab',
        api: 'https//4'
    },
    lab4: {
        password: 'password4',
        name: 'song Lab',
        api: 'https//4'
    }
};



