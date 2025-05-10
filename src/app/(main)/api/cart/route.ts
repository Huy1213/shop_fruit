import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      customerInfo, 
      paymentMethod, 
      shippingMethod, 
      items, 
      totalPrice,
      shippingCost 
    } = body;

    // Tạo mã đơn hàng ngẫu nhiên
    const orderNumber = `DH${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Chuẩn bị dữ liệu cho donhang
    const fullAddress = `${customerInfo.address}, ${customerInfo.ward}, ${customerInfo.district}, ${customerInfo.city}`;
    const orderData = {
      MaDH: orderNumber,
      HoTenKH: customerInfo.fullName,
      DiaChi: fullAddress,
      Email: customerInfo.email || null,
      SDT: customerInfo.phone,
      NgayDat: new Date().toISOString().slice(0, 19).replace('T', ' '), // Format: YYYY-MM-DD HH:MM:SS
      TongTien: totalPrice + shippingCost,
      TrangThai: 'Mới đặt',
      PhuongThucThanhToan: paymentMethod,
      GhiChu: customerInfo.notes || null
    };

    // Thực hiện INSERT vào bảng donhang
    const insertOrderQuery = `
      INSERT INTO donhang
      (MaDH, HoTenKH, DiaChi, Email, SDT, NgayDat, TongTien, TrangThai, PhuongThucThanhToan, GhiChu)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const orderValues = [
      orderData.MaDH,
      orderData.HoTenKH,
      orderData.DiaChi,
      orderData.Email,
      orderData.SDT,
      orderData.NgayDat,
      orderData.TongTien,
      orderData.TrangThai,
      orderData.PhuongThucThanhToan,
      orderData.GhiChu
    ];
    
    await pool.query(insertOrderQuery, orderValues);
    
    // Thực hiện INSERT vào bảng chitietdonhang cho từng sản phẩm
    for (const item of items) {
      const insertOrderDetailQuery = `
        INSERT INTO chitietdonhang
        (MaDH, MaSP, SoLuong)
        VALUES (?, ?, ?)
      `;
      
      const detailValues = [
        orderData.MaDH,
        item.product.MaSP,
        item.quantity
      ];
      
      await pool.query(insertOrderDetailQuery, detailValues);
    }
    
    // Trả về thông tin đơn hàng
    return NextResponse.json({
      success: true,
      orderNumber: orderData.MaDH,
      message: 'Đặt hàng thành công!'
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error placing order:', error);
    return NextResponse.json({
      success: false,
      message: 'Đã xảy ra lỗi khi đặt hàng: ' + error.message
    }, { status: 500 });
  }
}