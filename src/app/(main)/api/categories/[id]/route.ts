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
        
        // Truy vấn danh mục theo MaDM
        const [rows] = await db.execute(`
            SELECT *
            FROM danhmuc 
            WHERE MaDM = ?
        `, [collectionId]);
        
        // Kiểm tra nếu có kết quả
        if (Array.isArray(rows) && rows.length > 0) {
            // Trả về dòng đầu tiên (danh mục cụ thể)
            return NextResponse.json(rows[0]);
        } else {
            // Không tìm thấy danh mục
            return NextResponse.json(
                { error: "Không tìm thấy danh mục" },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("Lỗi khi truy vấn danh mục:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}