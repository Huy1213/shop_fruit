'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderSuccess() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  
  useEffect(() => {
    // Lấy mã đơn hàng từ localStorage (được lưu sau khi đặt hàng thành công)
    const lastOrderNumber = localStorage.getItem('lastOrderNumber');
    
    if (lastOrderNumber) {
      setOrderNumber(lastOrderNumber);
      // Xóa mã đơn hàng khỏi localStorage để tránh hiển thị lại sau này
      localStorage.removeItem('lastOrderNumber');
    } else {
      // Nếu không có mã đơn hàng, chuyển về trang chủ
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Đặt hàng thành công!</h2>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã mua sắm tại ShopFruit. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-sm text-gray-600">Mã đơn hàng của bạn</p>
          <p className="text-xl font-bold text-green-600">#{orderNumber}</p>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">
          Một email xác nhận đơn hàng sẽ được gửi đến địa chỉ email của bạn kèm theo chi tiết đơn hàng và thông tin theo dõi.
        </p>
        
        <div className="space-y-3">
          <Link href="/" className="block w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-center font-medium text-white bg-green-600 hover:bg-green-700">
            Tiếp tục mua sắm
          </Link>
          
          <Link href="/" className="block w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-center font-medium text-gray-700 bg-white hover:bg-gray-50">
            Theo dõi đơn hàng
          </Link>
        </div>
      </div>
    </div>
  );
}