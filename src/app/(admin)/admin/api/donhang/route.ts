import { NextResponse } from "next/server";
import db from "@/app/(main)/lib/db";

// Lấy tất cả đơn hàng
export async function GET() {
    try {
        const [rows] = await db.execute(`
            SELECT * FROM donhang
            ORDER BY NgayDat DESC
        `);
        return NextResponse.json(rows);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}

// Tạo đơn hàng mới
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { 
            MaDH, 
            HoTenKH, 
            DiaChi, 
            Email, 
            SDT, 
            NgayDat, 
            TongTien, 
            TrangThai, 
            PhuongThucThanhToan, 
            GhiChu,
            ChiTietDonHang 
        } = body;

        // Kiểm tra dữ liệu đầu vào
        if (!HoTenKH || !DiaChi || !SDT) {
            return NextResponse.json(
                { error: "Thông tin người nhận không được để trống" },
                { status: 400 }
            );
        }

        if (!Array.isArray(ChiTietDonHang) || ChiTietDonHang.length === 0) {
            return NextResponse.json(
                { error: "Đơn hàng phải có ít nhất một sản phẩm" },
                { status: 400 }
            );
        }

        // Bắt đầu transaction
        await db.execute('START TRANSACTION');

        try {
            // Tạo đơn hàng
            let insertQuery, params;
            const ngayDatHang = NgayDat || new Date().toISOString().slice(0, 19).replace('T', ' ');
            
            if (MaDH) {
                insertQuery = `
                    INSERT INTO donhang 
                    (MaDH, HoTenKH, DiaChi, Email, SDT, NgayDat, TongTien, TrangThai, PhuongThucThanhToan, GhiChu) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                params = [
                    MaDH, 
                    HoTenKH, 
                    DiaChi, 
                    Email || null, 
                    SDT, 
                    ngayDatHang, 
                    TongTien || 0, 
                    TrangThai || 'Chờ xác nhận', 
                    PhuongThucThanhToan || 'Tiền mặt', 
                    GhiChu || null
                ];
            } else {
                insertQuery = `
                    INSERT INTO donhang 
                    (HoTenKH, DiaChi, Email, SDT, NgayDat, TongTien, TrangThai, PhuongThucThanhToan, GhiChu) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                params = [
                    HoTenKH, 
                    DiaChi, 
                    Email || null, 
                    SDT, 
                    ngayDatHang, 
                    TongTien || 0, 
                    TrangThai || 'Chờ xác nhận', 
                    PhuongThucThanhToan || 'Tiền mặt', 
                    GhiChu || null
                ];
            }

            const [orderResult] = await db.execute(insertQuery, params);
            const orderResultObj = orderResult as any;
            const donHangId = MaDH || orderResultObj.insertId;

            // Thêm chi tiết đơn hàng
            for (const item of ChiTietDonHang) {
                await db.execute(
                    'INSERT INTO chitietdonhang (MaDH, MaSP, SoLuong) VALUES (?, ?, ?)',
                    [donHangId, item.MaSP, item.SoLuong]
                );

                // Cập nhật số lượng sản phẩm
                await db.execute(
                    'UPDATE sanpham SET SoLuong = SoLuong - ? WHERE MaSP = ?',
                    [item.SoLuong, item.MaSP]
                );
            }

            // Commit transaction
            await db.execute('COMMIT');

            return NextResponse.json({ 
                message: "Tạo đơn hàng thành công",
                MaDH: donHangId
            });
        } catch (error) {
            // Rollback nếu có lỗi
            await db.execute('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL hoặc dữ liệu không hợp lệ" },
            { status: 500 }
        );
    }
}