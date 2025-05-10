import { NextResponse } from "next/server";
import db from "@/app/(main)/lib/db";

// Lấy dữ liệu tổng quan cho dashboard
export async function GET() {
    try {
        // Lấy tổng số đơn hàng
        const [orderCountResult] = await db.execute('SELECT COUNT(*) as totalOrders FROM donhang');
        const orderCount = (orderCountResult as any[])[0].totalOrders;
        
        // Lấy tổng doanh thu (đơn hàng đã giao)
        const [revenueResult] = await db.execute(`
            SELECT SUM(TongTien) as totalRevenue
            FROM donhang
            WHERE TrangThai = 'Đã giao hàng'
        `);
        const totalRevenue = (revenueResult as any[])[0].totalRevenue || 0;
        
        // Lấy tổng số sản phẩm
        const [productCountResult] = await db.execute('SELECT COUNT(*) as totalProducts FROM sanpham');
        const productCount = (productCountResult as any[])[0].totalProducts;
        
        // Lấy đơn hàng gần đây (10 đơn hàng mới nhất)
        const [recentOrders] = await db.execute(`
            SELECT * FROM donhang
            ORDER BY NgayDat DESC
            LIMIT 10
        `);
        
        // Thống kê theo trạng thái đơn hàng
        const [orderStatusStats] = await db.execute(`
            SELECT TrangThai, COUNT(*) as count
            FROM donhang
            GROUP BY TrangThai
        `);
        
        // Thống kê doanh thu theo tháng (6 tháng gần nhất)
        const [monthlyRevenue] = await db.execute(`
            SELECT 
                DATE_FORMAT(NgayDat, '%Y-%m') as month,
                SUM(TongTien) as revenue
            FROM donhang
            WHERE TrangThai = 'Đã giao hàng'
            AND NgayDat >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(NgayDat, '%Y-%m')
            ORDER BY month DESC
        `);
        
        // Sản phẩm bán chạy nhất
        const [topProducts] = await db.execute(`
            SELECT 
                s.MaSP, 
                s.TenSP, 
                SUM(c.SoLuong) as totalSold
            FROM chitietdonhang c
            JOIN sanpham s ON c.MaSP = s.MaSP
            JOIN donhang d ON c.MaDH = d.MaDH
            WHERE d.TrangThai = 'Đã giao hàng'
            GROUP BY s.MaSP, s.TenSP
            ORDER BY totalSold DESC
            LIMIT 5
        `);

        return NextResponse.json({
            totalOrders: orderCount,
            totalRevenue: totalRevenue,
            totalProducts: productCount,
            recentOrders: recentOrders,
            orderStatusStats: orderStatusStats,
            monthlyRevenue: monthlyRevenue,
            topProducts: topProducts
        });
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu dashboard:", error);
        return NextResponse.json(
            { error: "Lỗi kết nối SQL" },
            { status: 500 }
        );
    }
}