const mysql = require('mysql2/promise')
import * as cheerio from "cheerio";
var con = mysql.createConnection({
        host: "lightnode-do-user-9480719-0.b.db.ondigitalocean.com",
        user: "doadmin",
        port:25060,
        password: process.env.MYSQL_PASSWORD,
        database: "txhistory"
    });

    
async function queryDatabase(objective:any,address:any,month:any,interval:any,year:any) {
    con = await mysql.createConnection({
        host: "lightnode-do-user-9480719-0.b.db.ondigitalocean.com",
        user: "doadmin",
        port:25060,
        password: process.env.MYSQL_PASSWORD,
        database: "txhistory"
    });
    if (objective=="stakingpoolchart"){
        let [rows1,fields1] = await con.execute(`SELECT MONTH(date),SUM(amt) FROM transactions WHERE txType = 'submit' AND YEAR(date) = '${year}' GROUP BY MONTH(date);`)
        let [rows2,fields2] = await con.execute(`SELECT MONTH(date),SUM(amt) FROM transactions WHERE txType = 'withdraw' AND YEAR(date) = '${year}' GROUP BY MONTH(date);`)
        let rows = []
        for (let i = 0;i< rows1.length;i++){
            let stakes = rows1[i]['SUM(amt)']-(rows2[i]? rows2[i]['SUM(amt)']:0)
            let row = {month:rows1[i]['MONTH(date)'],stake:String(stakes),rewards:String(stakes)}
            rows.push(row)
        }
        return rows
    }
    else if (objective=="monthlyprofitchart"){
        let [rows1,fields1] = await con.execute(`SELECT MONTH(date),SUM(amt) FROM transactions WHERE sender = '${address}' AND txType = 'submit' AND YEAR(date) = '${year}' GROUP BY MONTH(date);`)
        let [rows2,fields2] = await con.execute(`SELECT MONTH(date),SUM(amt) FROM transactions WHERE sender = '${address}' AND txType = 'withdraw' AND YEAR(date) = '${year}' GROUP BY MONTH(date);`)
        let rows = []
        for (let i = 0;i< rows1.length;i++){
            let monthlyProfit = rows1[i]['SUM(amt)']-(rows2[i]? rows2[i]['SUM(amt)']:0)
            let row = {month:rows1[i]['MONTH(date)'],mProfit:String(monthlyProfit)}
            rows.push(row)
        }
        return rows
    }
    else if (objective=="monthlyuserstakes"){
        let [rows1,fields1] = await con.execute(`SELECT MONTH(date),SUM(amt) FROM transactions WHERE sender = '${address}' AND txType = 'submit' AND MONTH(date) = '${month}' GROUP BY MONTH(date);`)
        let [rows2,fields2] = await con.execute(`SELECT MONTH(date),SUM(amt) FROM transactions WHERE sender = '${address}' AND txType = 'withdraw' AND MONTH(date) = '${year}' GROUP BY MONTH(date);`)
        let rows = []
        for (let i = 0;i< rows1.length;i++){
            let monthlystake = rows1[i]['SUM(amt)']-(rows2[i]? rows2[i]['SUM(amt)']:0)
            let monthlyreward = monthlystake
            let monthlyprofit =  monthlystake + monthlyreward
            var data = await (await fetch("https://staking.ethermine.org/statistics")).text()
            let dat = cheerio.load(data)
            let apr  = parseFloat(dat(".stat")["1"].attributes[1].value.slice(0,-1))
            let row = {month:rows1[i]['MONTH(date)'],mProfit:monthlyprofit,mStake:monthlystake,mReward:monthlyreward,apr:apr.toPrecision(3)}
            rows.push(row)
        }
        return rows
    }
    con.end()
}
export default queryDatabase