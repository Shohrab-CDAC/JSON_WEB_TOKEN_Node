const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const con = require("./config");

const secretKey = "your-secret-key";


app.post("/login", (req, res) => {
    // Perform authentication logic, check username and password

    // For example, if authentication is successful:
    const userData = { username: "shohrab", role: "admin" };
    const token = generateToken(userData);

    res.json({ token });
});

function generateToken(userData) {
    return jwt.sign(userData, secretKey, { expiresIn: "1h" });
}

function verifyToken(req, res, next) {
    const bearerHeader = req.header("Authorization");

    if (typeof bearerHeader === 'undefined') {
        return res.status(401).json({ result: "Token is not provided" });
    }

    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
}

app.get("/", verifyToken, (req, res) => {
    con.query("SELECT * FROM Employee", (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error in getting data from the database" });
        } else {
            res.json(result);
        }
    });
});


app.post("/", verifyToken, (req, res) => {
    const data = { "EmpId": "002", "Ename": "shohrab", "Sal": 92000, "City": "pune", "Dob": "1998-10-30" };
    con.query('INSERT INTO Employee SET ?', data, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error posting data" });
        } else {
            res.json(result);
        }
    });
});

app.put("/:EmpID", verifyToken, (req, res) => {
    const data = ["ttt", 21000, "nimpri", "1996-08-25", req.params.EmpID]; // Updated the order of data
    const sql = 'UPDATE Employee SET Ename=?, Sal=?, City=?, Dob=? WHERE EmpID=?';

    con.query(sql, data, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "Error updating data" });
        } else {
            res.json(result);
        }
    });
});


app.delete("/:EmpID", verifyToken, (req, res) => {
    con.query('DELETE FROM Employee WHERE EmpId ='+req.params.EmpID, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Error deleting data" });
        } else {
            res.json(result);
        }
    });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
