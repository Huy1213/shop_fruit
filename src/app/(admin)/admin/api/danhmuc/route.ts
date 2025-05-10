import { NextResponse } from "next/server";
import db from "@/app/(main)/lib/db";

// Lấy danh sách tất cả danh mục
export async function GET() {
    try {
        const [rows] = await db.execute(`
            SELECT * FROM danhmuc
            ORDER BY MaDM DESC
        `);
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách danh mục:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}

// Thêm danh mục mới
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { MaDM, TenDM, HinhAnh } = body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!TenDM) {
            return NextResponse.json(
                { error: "Tên danh mục không được để trống" },
                { status: 400 }
            );
        }
        
        // Nếu có MaDM, sử dụng giá trị đó; nếu không, để SQL tự động tạo
        let query, params;
        if (MaDM) {
            query = `
                INSERT INTO danhmuc (MaDM, TenDM, HinhAnh) 
                VALUES (?, ?, ?)
            `;
            params = [MaDM, TenDM, HinhAnh || null];
        } else {
            query = `
                INSERT INTO danhmuc (TenDM, HinhAnh) 
                VALUES (?, ?)
            `;
            params = [TenDM, HinhAnh || null];
        }
        
        const [result] = await db.execute(query, params);
        
        // Lấy ID của danh mục vừa thêm
        const resultObj = result as any;
        const insertId = MaDM || resultObj.insertId;
        
        return NextResponse.json({ 
            message: "Thêm danh mục thành công",
            MaDM: insertId
        });
    } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}