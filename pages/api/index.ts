import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req:NextApiRequest,res:NextApiResponse){
    res.status(200).send("Never Gonna Give you up..\nNever Gonna Let you down...\nNever gonna run around and desert you...")
}