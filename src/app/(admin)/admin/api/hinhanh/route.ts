import { NextResponse } from "next/server";
import db from "@/app/(main)/lib/db";

export async function GET(){
    try {
        const [data] = await db.execute("SELECT * FROM hinhanh");
        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json({err:"Lỗi kết nối sql"},{status:500});
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { MaHinh,TenHinh } = body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!MaHinh) {
            return NextResponse.json(
                { error: "Mã hình không được để trống" },
                { status: 400 }
            );
        }
        if (!TenHinh) {
            return NextResponse.json(
                { error: "Tên hình không được để trống" },
                { status: 400 }
            );
        }
        
        // Thêm hình ảnh mới
        const [result] = await db.execute(
            "INSERT INTO hinhanh (MaHinh,TenHinh) VALUES (?,?)",
            [MaHinh,TenHinh]
        );
        
        // Lấy ID của hình ảnh vừa thêm
        const resultObj = result as any;
        const insertId = resultObj.insertId;
        
        return NextResponse.json({ 
            message: "Thêm hình ảnh thành công",
            MaHinh: insertId
        });
    } catch (error) {
        console.error("Lỗi khi thêm hình ảnh:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}