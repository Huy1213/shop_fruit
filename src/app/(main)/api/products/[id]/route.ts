import { NextResponse } from "next/server";
import db from "@/app/(main)/lib/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {    
    try {
        const productId = params.id;
        
        const [rows] = await db.execute(`
            SELECT sp.*, h.TenHinh 
            FROM sanpham sp
            LEFT JOIN hinhanh h ON sp.MaHinh = h.MaHinh
            WHERE sp.MaSP = ?
        `, [productId]);
        
        if (Array.isArray(rows) && rows.length > 0) {
            return NextResponse.json(rows[0]);
        } else {
            // Trả về lỗi với status code 404
            return NextResponse.json(
                { error: "Không tìm thấy sản phẩm" },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("Lỗi khi truy vấn sản phẩm:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}