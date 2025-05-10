import { NextResponse } from "next/server";
import db from "@/app/(main)/lib/db";

// Lấy thông tin chi tiết một sản phẩm
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        
        const [rows] = await db.execute(`
            SELECT s.*, d.TenDM, h.TenHinh 
            FROM sanpham s
            LEFT JOIN danhmuc d ON s.MaDM = d.MaDM
            LEFT JOIN hinhanh h ON s.MaHinh = h.MaHinh
            WHERE s.MaSP = ?
        `, [id]);
        
        const products = rows as any[];
        
        if (products.length === 0) {
            return NextResponse.json(
                { error: "Không tìm thấy sản phẩm" },
                { status: 404 }
            );
        }
        
        return NextResponse.json(products[0]);
    } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}

// Cập nhật thông tin sản phẩm
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { MaDM, MaHinh, TenSP, SoLuong, GiaBan, GiaGiam, MoTa } = body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!TenSP || !MaDM) {
            return NextResponse.json(
                { error: "Tên sản phẩm và danh mục không được để trống" },
                { status: 400 }
            );
        }
        
        // Kiểm tra xem sản phẩm có tồn tại không
        const [checkRows] = await db.execute(
            "SELECT * FROM sanpham WHERE MaSP = ?", 
            [id]
        );
        
        const products = checkRows as any[];
        
        if (products.length === 0) {
            return NextResponse.json(
                { error: "Không tìm thấy sản phẩm" },
                { status: 404 }
            );
        }
        
        // Cập nhật thông tin sản phẩm
        await db.execute(`
            UPDATE sanpham 
            SET MaDM = ?, MaHinh = ?, TenSP = ?, SoLuong = ?, GiaBan = ?, GiaGiam = ?, MoTa = ? 
            WHERE MaSP = ?
        `, [MaDM, MaHinh, TenSP, SoLuong || 0, GiaBan || 0, GiaGiam || 0, MoTa || '', id]);
        
        return NextResponse.json({ 
            message: "Cập nhật sản phẩm thành công" 
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}

// Xóa sản phẩm
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        
        // Xóa sản phẩm
        const [result] = await db.execute(
            "DELETE FROM sanpham WHERE MaSP = ?", 
            [id]
        );
        
        const resultObj = result as any;
        
        if (resultObj.affectedRows === 0) {
            return NextResponse.json(
                { error: "Không tìm thấy sản phẩm" },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ 
            message: "Xóa sản phẩm thành công" 
        });
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}