import { NextResponse } from "next/server";
import db from "@/app/(main)/lib/db";

// Lấy chi tiết đơn hàng
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        // Lấy thông tin đơn hàng
        const [orderRows] = await db.execute(
            "SELECT * FROM donhang WHERE MaDH = ?",
            [id]
        );

        const orders = orderRows as any[];
        if (orders.length === 0) {
            return NextResponse.json(
                { error: "Không tìm thấy đơn hàng" },
                { status: 404 }
            );
        }

        const order = orders[0];

        // Lấy chi tiết đơn hàng
        const [detailRows] = await db.execute(`
            SELECT c.*, s.TenSP, s.GiaBan, s.GiaGiam
            FROM chitietdonhang c
            JOIN sanpham s ON c.MaSP = s.MaSP
            WHERE c.MaDH = ?
        `, [id]);

        return NextResponse.json({
            donHang: order,
            chiTietDonHang: detailRows
        });
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}

// Cập nhật trạng thái đơn hàng
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const body = await request.json();
        const { TrangThai, GhiChu } = body;

        // Kiểm tra đơn hàng tồn tại
        const [checkRows] = await db.execute(
            "SELECT * FROM donhang WHERE MaDH = ?",
            [id]
        );

        const orders = checkRows as any[];
        if (orders.length === 0) {
            return NextResponse.json(
                { error: "Không tìm thấy đơn hàng" },
                { status: 404 }
            );
        }

        // Cập nhật trạng thái
        await db.execute(
            "UPDATE donhang SET TrangThai = ?, GhiChu = ? WHERE MaDH = ?",
            [TrangThai, GhiChu || orders[0].GhiChu, id]
        );

        return NextResponse.json({
            message: "Cập nhật trạng thái đơn hàng thành công"
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}

// Hủy đơn hàng
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        // Kiểm tra đơn hàng tồn tại
        const [checkRows] = await db.execute(
            "SELECT * FROM donhang WHERE MaDH = ?",
            [id]
        );

        const orders = checkRows as any[];
        if (orders.length === 0) {
            return NextResponse.json(
                { error: "Không tìm thấy đơn hàng" },
                { status: 404 }
            );
        }

        // Bắt đầu transaction
        await db.execute('START TRANSACTION');

        try {
            // Lấy chi tiết đơn hàng
            const [detailRows] = await db.execute(
                "SELECT * FROM chitietdonhang WHERE MaDH = ?",
                [id]
            );
            const details = detailRows as any[];

            // Hoàn lại số lượng sản phẩm
            for (const item of details) {
                await db.execute(
                    'UPDATE sanpham SET SoLuong = SoLuong + ? WHERE MaSP = ?',
                    [item.SoLuong, item.MaSP]
                );
            }

            // Xóa chi tiết đơn hàng
            await db.execute("DELETE FROM chitietdonhang WHERE MaDH = ?", [id]);

            // Xóa đơn hàng
            await db.execute("DELETE FROM donhang WHERE MaDH = ?", [id]);

            // Commit transaction
            await db.execute('COMMIT');

            return NextResponse.json({
                message: "Hủy đơn hàng thành công"
            });
        } catch (error) {
            // Rollback nếu có lỗi
            await db.execute('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}