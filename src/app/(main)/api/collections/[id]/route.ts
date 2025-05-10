import { NextResponse } from "next/server";
import db from "@/app/(main)/lib/db";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {    
    try {
        // Sử dụng biến trung gian để tránh truy cập trực tiếp params.id
        const resolvedParams = await params;
        const { id: collectionId } = resolvedParams;
        
        // Truy vấn cả sản phẩm và thông tin hình ảnh từ các bảng
        const [data] = await db.execute(`
            SELECT sp.*, h.TenHinh 
            FROM sanpham sp
            LEFT JOIN hinhanh h ON sp.MaHinh = h.MaHinh
            WHERE sp.MaDM = ?
        `, [collectionId]);
        
        return NextResponse.json(data);
    } catch (error) {
        console.error("Lỗi khi truy vấn sản phẩm theo danh mục:", error);
        return NextResponse.json(
            { err: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}