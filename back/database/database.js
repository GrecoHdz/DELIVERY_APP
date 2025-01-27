/*const mysql = require("promise-mysql");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
  host:process.env.host,
  database:process.env.database,
  user:process.env.user,
  password:process.env.password
})

const getConnection = async ()=> await connection;

module.exports = {
  getConnection
}
*/
const users = [
  { id: 1, username: "admin", password: "123456" },
  { id: 2, username: "user", password: "password" },
];

const getUser = async (username, password) => {
  // Simular consulta a base de datos
  return users.find((user) => user.username === username && user.password === password);
};

module.exports = { getUser };