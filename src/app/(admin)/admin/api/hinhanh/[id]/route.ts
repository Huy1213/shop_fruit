// app/(admin)/admin/api/hinhanh/[id]/route.ts
import { NextResponse } from "next/server";
import db from "@/app/(main)/lib/db";

// API lấy thông tin chi tiết một hình ảnh
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        
        const [rows] = await db.execute(
            "SELECT * FROM hinhanh WHERE MaHinh = ?", 
            [id]
        );
        
        const images = rows as any[];
        
        if (images.length === 0) {
            return NextResponse.json(
                { error: "Không tìm thấy hình ảnh" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(images[0]);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin hình ảnh:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}

// API cập nhật thông tin hình ảnh
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        const body = await request.json();
        const { TenHinh } = body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!TenHinh) {
            return NextResponse.json(
                { error: "Tên hình không được để trống" },
                { status: 400 }
            );
        }
        
        // Kiểm tra xem hình ảnh có tồn tại không
        const [checkRows] = await db.execute(
            "SELECT * FROM hinhanh WHERE MaHinh = ?", 
            [id]
        );
        
        const images = checkRows as any[];
        
        if (images.length === 0) {
            return NextResponse.json(
                { error: "Không tìm thấy hình ảnh" },
                { status: 404 }
            );
        }
        
        // Cập nhật thông tin hình ảnh
        await db.execute(
            "UPDATE hinhanh SET TenHinh = ? WHERE MaHinh = ?",
            [TenHinh, id]
        );
        
        return NextResponse.json({ 
            message: "Cập nhật hình ảnh thành công" 
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật hình ảnh:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}

// API xóa hình ảnh
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const resolvedParams = await params;
        const id = resolvedParams.id;
        
        // Kiểm tra xem hình ảnh có đang được sử dụng không (ví dụ trong bảng sản phẩm)
        const [checkUsage] = await db.execute(
            "SELECT COUNT(*) as count FROM sanpham WHERE MaHinh = ?", 
            [id]
        );
        
        const usageCount = (checkUsage as any[])[0].count;
        
        if (usageCount > 0) {
            return NextResponse.json(
                { error: "Không thể xóa hình ảnh vì đang được sử dụng" },
                { status: 400 }
            );
        }
        
        // Xóa hình ảnh
        const [result] = await db.execute(
            "DELETE FROM hinhanh WHERE MaHinh = ?", 
            [id]
        );
        
        const resultObj = result as any;
        
        if (resultObj.affectedRows === 0) {
            return NextResponse.json(
                { error: "Không tìm thấy hình ảnh" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ 
            message: "Xóa hình ảnh thành công" 
        });
    } catch (error) {
        console.error("Lỗi khi xóa hình ảnh:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}