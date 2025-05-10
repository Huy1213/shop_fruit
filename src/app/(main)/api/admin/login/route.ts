import { NextRequest, NextResponse } from 'next/server';
import pool from "@/app/(main)/lib/db";
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

// Định nghĩa interface cho dữ liệu nhân viên
interface NhanVien extends RowDataPacket {
    MaNV: string;
    HoTen: string;
    Email: string | null;
    SDT: string | null;
    UserName: string;
    Password: string;
}

// Secret key cho JWT (nên lưu trong biến môi trường)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-shop-fruit-admin';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();
        
        // Validation
        if (!username || !password) {
        return NextResponse.json({ message: 'Thiếu thông tin đăng nhập' }, { status: 400 });
        }
        
        // Lấy thông tin nhân viên từ database
        const query = 'SELECT * FROM nhanvien WHERE UserName = ? AND Password = ?';
        const [rows] = await pool.query<NhanVien[]>(query, [username, password]);
        
        // Nếu không tìm thấy nhân viên hoặc mật khẩu không đúng
        if (!rows || rows.length === 0) {
            return NextResponse.json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' }, { status: 401 });
        }
        
        // Lấy thông tin nhân viên đầu tiên
        const nhanvien = rows[0];
        
        // Tạo JWT token
        const token = jwt.sign(
            { 
                id: nhanvien.MaNV, 
                username: nhanvien.UserName,
                name: nhanvien.HoTen,
                role: 'admin'
            },
            JWT_SECRET,
            { expiresIn: '1d' } // Token hết hạn sau 1 ngày
        );
        
        // Trả về token
        return NextResponse.json({ 
            message: 'Đăng nhập thành công',
            token,
            user: {
                id: nhanvien.MaNV,
                username: nhanvien.UserName,
                name: nhanvien.HoTen,
                email: nhanvien.Email
            }
        });
        
    } catch (error: any) {
        console.error('Admin login error:', error);
        return NextResponse.json({ message: 'Lỗi server: ' + error.message }, { status: 500 });
    }
}