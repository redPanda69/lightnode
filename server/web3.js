const Web3 = require("web3")
const abi = require("./contracts/abi/lightnode.json")
const web3 = new Web3("wss://goerli.infura.io/ws/v3/90e05899535845039edc8be6d7ba009a")
const mysql = require('mysql2');
const contract = new web3.eth.Contract(abi,"0x6F26B417f2622eD65A964b37Db815998849C2518");

// Database Connection...
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Vyshnavp",
  database: "lightnode"
});



// Event Listening.....
function initializeListeners(){
    contract.events.Submitted((event)=>{}).on('data',(event)=>{
        let result = event.returnValues
        let txType = "submit"
        con.query(`INSERT INTO transactions VALUES ('${result.sender}',${result.amount},'${txType}',NOW());`)
    })
    contract.events.Withdrawal((event)=>{}).on('data',(event)=>{
        let result = event.returnValues
        let txType = "witdrawal"
        con.query(`INSERT INTO transactions VALUES ('${result.sender}',${result.amount},'${txType}',NOW());`)
    })
    console.log("Web3: Connection Established....")
}
module.exports = {initializeListeners}