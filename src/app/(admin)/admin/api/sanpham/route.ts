import { NextResponse } from "next/server";
import db from "@/app/(main)/lib/db";

// Lấy danh sách tất cả sản phẩm
export async function GET() {
    try {
        const [rows] = await db.execute(`
            SELECT s.*, d.TenDM, h.TenHinh 
            FROM sanpham s
            LEFT JOIN danhmuc d ON s.MaDM = d.MaDM
            LEFT JOIN hinhanh h ON s.MaHinh = h.MaHinh
            ORDER BY s.MaSP DESC
        `);
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}

// Thêm sản phẩm mới
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { MaSP, MaDM, MaHinh, TenSP, SoLuong, GiaBan, GiaGiam, MoTa } = body;
        
        // Kiểm tra dữ liệu đầu vào
        if (!TenSP || !MaDM) {
            return NextResponse.json(
                { error: "Tên sản phẩm và danh mục không được để trống" },
                { status: 400 }
            );
        }
        
        // Nếu có MaSP, sử dụng giá trị đó; nếu không, để SQL tự động tạo
        let query, params;
        if (MaSP) {
            query = `
                INSERT INTO sanpham (MaSP, MaDM, MaHinh, TenSP, SoLuong, GiaBan, GiaGiam, MoTa) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            params = [MaSP, MaDM, MaHinh, TenSP, SoLuong || 0, GiaBan || 0, GiaGiam || 0, MoTa || ''];
        } else {
            query = `
                INSERT INTO sanpham (MaDM, MaHinh, TenSP, SoLuong, GiaBan, GiaGiam, MoTa) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            params = [MaDM, MaHinh, TenSP, SoLuong || 0, GiaBan || 0, GiaGiam || 0, MoTa || ''];
        }
        
        const [result] = await db.execute(query, params);
        
        // Lấy ID của sản phẩm vừa thêm
        const resultObj = result as any;
        const insertId = MaSP || resultObj.insertId;
        
        return NextResponse.json({ 
            message: "Thêm sản phẩm thành công",
            MaSP: insertId
        });
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}