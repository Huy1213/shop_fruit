import { NextResponse } from "next/server";
import db from "@/app/(main)/lib/db";

export async function GET(){
    try {
        const [data] = await db.execute("SELECT * FROM danhmuc");
        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json({err:"Lỗi kết nối sql"},{status:500});
    }
}