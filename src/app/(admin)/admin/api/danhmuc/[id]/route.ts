import { NextResponse } from "next/server";
import db from "@/app/(main)/lib/db";

// Lấy chi tiết một danh mục
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        
        const [rows] = await db.execute(
            "SELECT * FROM danhmuc WHERE MaDM = ?",
            [id]
        );
        
        const categories = rows as any[];
        
        if (categories.length === 0) {
            return NextResponse.json(
                { error: "Không tìm thấy danh mục" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(categories[0]);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin danh mục:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}

// Cập nhật thông tin danh mục
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { TenDM, HinhAnh } = body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!TenDM) {
            return NextResponse.json(
                { error: "Tên danh mục không được để trống" },
                { status: 400 }
            );
        }
        
        // Kiểm tra xem danh mục có tồn tại không
        const [checkRows] = await db.execute(
            "SELECT * FROM danhmuc WHERE MaDM = ?", 
            [id]
        );
        
        const categories = checkRows as any[];
        
        if (categories.length === 0) {
            return NextResponse.json(
                { error: "Không tìm thấy danh mục" },
                { status: 404 }
            );
        }
        
        // Cập nhật thông tin danh mục
        await db.execute(
            "UPDATE danhmuc SET TenDM = ?, HinhAnh = ? WHERE MaDM = ?",
            [TenDM, HinhAnh || null, id]
        );
        
        return NextResponse.json({ 
            message: "Cập nhật danh mục thành công" 
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật danh mục:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}

// Xóa danh mục
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        
        // Kiểm tra xem có sản phẩm nào thuộc danh mục này không
        const [checkProductRows] = await db.execute(
            "SELECT COUNT(*) as count FROM sanpham WHERE MaDM = ?",
            [id]
        );
        
        const productCount = (checkProductRows as any[])[0].count;
        
        if (productCount > 0) {
            return NextResponse.json(
                { 
                    error: "Không thể xóa danh mục này vì có sản phẩm liên quan",
                    productCount 
                },
                { status: 400 }
            );
        }
        
        // Xóa danh mục
        const [result] = await db.execute(
            "DELETE FROM danhmuc WHERE MaDM = ?", 
            [id]
        );
        
        const resultObj = result as any;
        
        if (resultObj.affectedRows === 0) {
            return NextResponse.json(
                { error: "Không tìm thấy danh mục" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ 
            message: "Xóa danh mục thành công" 
        });
    } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}