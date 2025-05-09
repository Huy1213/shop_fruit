'use client';
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from '@/app/contexts/CartContext';

interface SanPham {
    MaSP: string;
    MaDM: string;
    TenHinh: string;
    TenSP: string;
    SoLuong: number;
    GiaBan: number | string;
    GiaGiam: number | string;
    MoTa: number;
}

export default function Cart() {
    const router = useRouter();
    
    // Sử dụng Context API thay vì useState và localStorage trực tiếp
    const { cartItems, totalPrice, removeFromCart, updateQuantity } = useCart();

    // Format giá tiền
    const formatPrice = (price: number | string): string => {
        if (typeof price === 'string') {
            return price;
        }
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    return(
        <div className="cart mb-20">
            <div className="text-sm p-2">
                <Link href="/">Trang chủ </Link> 
                <span className="text-black/50">/ Giỏ hàng ({cartItems.length})</span>
            </div>
            <div className="p-2 flex">
                <div>
                    <h1 className="font-bold text-green-500">GIỎ HÀNG CỦA BẠN</h1>
                    <p className="py-2">Bạn đang có <span className="font-bold">{cartItems.length} sản phẩm</span> trong giỏ hàng</p>
                    <div className="p-5 border border-black/30 rounded-2xl w-200">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="mb-4">Giỏ hàng của bạn đang trống</p>
                                <Link href="/">
                                    <span className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                                        Tiếp tục mua sắm
                                    </span>
                                </Link>
                            </div>
                        ) : (
                            cartItems.map((item, index) => (
                                <div key={item.product.MaSP} className={`items-center flex justify-between ${index !== cartItems.length - 1 ? 'border-b border-black/30 pb-5 mb-5' : ''}`}>
                                    <div className="flex gap-5">
                                        <Image 
                                            src={item.product.TenHinh || "/images/placeholder.jpg"} 
                                            width={80} 
                                            height={80} 
                                            alt={item.product.TenSP}
                                        />
                                        <div className="flex flex-col gap-2">
                                            <p>{item.product.TenSP}</p>
                                            <p className="text-xs">Mã SP: {item.product.MaSP}</p>
                                            <p className="font-bold text-black/50">
                                                {formatPrice(item.product.GiaBan)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div>
                                            <p className="font-bold">{formatPrice(
                                                typeof item.product.GiaBan === 'string' 
                                                    ? parseInt(item.product.GiaBan.replace(/[^\d]/g, '')) * item.quantity
                                                    : item.product.GiaBan * item.quantity
                                            )}</p>
                                            <div className="flex border border-black/40 mt-2">
                                                <button 
                                                    onClick={() => updateQuantity(item.product.MaSP, item.quantity - 1)}
                                                    className="w-8 h-8 text-sm bg-black/10">-</button>
                                                <input 
                                                    className="bg-white h-8 w-10 text-center text-sm"
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const val = parseInt(e.target.value);
                                                        if (!isNaN(val) && val > 0) {
                                                            updateQuantity(item.product.MaSP, val);
                                                        }
                                                    }}
                                                    min="1"
                                                />
                                                <button 
                                                    onClick={() => updateQuantity(item.product.MaSP, item.quantity + 1)}
                                                    className="w-8 h-8 text-sm bg-black/10">+</button>
                                            </div>
                                        </div>
                                        <div>
                                            <button 
                                                onClick={() => {
                                                    console.log("Removing item with ID:", item.product.MaSP);
                                                    removeFromCart(item.product.MaSP);
                                                }}
                                                className="bg-red-500 py-2 px-6 rounded-xl text-xl text-white"
                                            >
                                                xóa
                                            </button>
                                        </div>  
                                    </div>                  
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="w-100 p-4">
                    <h1 className="font-bold text-green-500">Thông tin đơn hàng</h1>
                    <div>
                        {cartItems.map((item) => (
                            <div key={item.product.MaSP} className="flex justify-between p-1">  
                                <p>{item.product.TenSP}</p>
                                <p>x{item.quantity}</p>                   
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between py-2 border-t border-black/30 items-center">
                        <p className="font-bold">Tổng tiền:</p>
                        <p className="font-bold text-2xl text-red-500">{formatPrice(totalPrice)}</p>
                    </div>
                    <ul>
                        <li>Phí vận chuyển sẽ được tính ở trang thanh toán.</li>
                        <li>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</li>
                    </ul>
                    <button 
                        onClick={() => router.push('/checkout')}
                        disabled={cartItems.length === 0}
                        className={`bg-green-500 text-white w-90 px-4 py-2 rounded-md mt-5 ${cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        THANH TOÁN
                    </button>

                    <div className="p-5 rounded-sm bg-blue-100 mt-10">
                        <p className="font-bold">Chính sách mua hàng</p>
                        <p>Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị tối thiểu 100.000₫ trở lên.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}