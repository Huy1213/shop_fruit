import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Secret key cho JWT (nên lưu trong biến môi trường)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-shop-fruit-admin';

export async function GET(request: NextRequest) {
  try {
    // Lấy token từ header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Thiếu token xác thực' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Xác thực token
    const decodedToken = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    
    if (!decodedToken) {
      return NextResponse.json({ message: 'Token không hợp lệ' }, { status: 401 });
    }
    
    // Trả về thông tin người dùng từ token
    return NextResponse.json({
      message: 'Token hợp lệ',
      user: {
        id: decodedToken.id,
        username: decodedToken.username,
        name: decodedToken.name,
        role: decodedToken.role
      }
    });
    
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return NextResponse.json({ message: 'Token đã hết hạn' }, { status: 401 });
    }
    
    console.error('Token verification error:', error);
    return NextResponse.json({ message: 'Lỗi xác thực: ' + error.message }, { status: 500 });
  }
}