import { NextApiRequest, NextApiResponse } from "next";
import queryDatabase from "common/db_connections/quering"
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    var address = req.query.address
    var month = req.query.month
    var interval = req.query.interval
    var year = req.query.year
    // console.log(year)
    var objective = req.query.aim
    const result = await queryDatabase(objective, address,month,interval,year)
    res.status(200).json({
        query_result:result
    })
}