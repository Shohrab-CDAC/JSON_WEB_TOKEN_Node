const mysql = require("mysql")
const con = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "manager",
    database: "sakshi"
});

con.connect((err) => {
    if (err){
        console.warn("err in connection")
}
else {
        console.warn("connected")
    }


});

module.exports=con;