'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/contexts/CartContext';

// Enum cho phương thức thanh toán
enum PaymentMethod {
  COD = 'Thanh toán khi nhận hàng',
  BANKING = 'Chuyển khoản ngân hàng',
  MOMO = 'Ví MoMo',
  VISA = 'Thẻ tín dụng/ghi nợ'
}

// Enum cho phương thức vận chuyển
enum ShippingMethod {
  STANDARD = 'Giao hàng tiêu chuẩn',
  EXPRESS = 'Giao hàng nhanh',
  STORE_PICKUP = 'Nhận tại cửa hàng'
}

interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  notes: string;
}

export default function Checkout() {
  const router = useRouter();
  const { cartItems, totalPrice, clearCart } = useCart();
  
  // State cho thông tin khách hàng
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: ''
  });
  
  // State cho phương thức thanh toán và vận chuyển
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>(ShippingMethod.STANDARD);
  
  // State cho chi phí vận chuyển và tổng thanh toán
  const [shippingCost, setShippingCost] = useState(30000);
  
  // State cho validation và progress
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Xử lý thay đổi thông tin khách hàng
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
    
    // Xóa lỗi khi người dùng nhập
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Xử lý thay đổi phương thức vận chuyển
  const handleShippingMethodChange = (method: ShippingMethod) => {
    setShippingMethod(method);
    
    // Cập nhật chi phí vận chuyển dựa trên phương thức
    switch (method) {
      case ShippingMethod.EXPRESS:
        setShippingCost(50000);
        break;
      case ShippingMethod.STORE_PICKUP:
        setShippingCost(0);
        break;
      default:
        setShippingCost(30000);
    }
  };
  
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
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ tên';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(customerInfo.phone.trim())) {
      newErrors.phone = 'Số điện thoại không hợp lệ (10 số)';
    }
    
    if (customerInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!customerInfo.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ';
    }
    
    if (!customerInfo.city.trim()) {
      newErrors.city = 'Vui lòng chọn tỉnh/thành phố';
    }
    
    if (!customerInfo.district.trim()) {
      newErrors.district = 'Vui lòng chọn quận/huyện';
    }
    
    if (!customerInfo.ward.trim()) {
      newErrors.ward = 'Vui lòng chọn phường/xã';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Xử lý khi đặt hàng
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống');
      return;
    }
    
    if (!validateForm()) {
      // Scroll đến phần tử đầu tiên có lỗi
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    setApiError(null);
    
    try {
      // Tạo đối tượng đơn hàng để gửi đến API
      const orderData = {
        customerInfo,
        paymentMethod,
        shippingMethod,
        shippingCost,
        items: cartItems,
        totalPrice
      };
      
      // Gọi API đặt hàng
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Có lỗi xảy ra khi đặt hàng');
      }
      
      // Lưu mã đơn hàng vào localStorage để hiển thị ở trang thành công
      localStorage.setItem('lastOrderNumber', result.orderNumber);
      
      // Xóa giỏ hàng
      clearCart();
      
      // Chuyển đến trang xác nhận
      router.push('/order-success');
      
    } catch (error: any) {
      console.error('Error placing order:', error);
      setApiError(error.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
      
      // Scroll to top để hiển thị thông báo lỗi
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="checkout mb-20">
      <div className="text-sm p-2">
        <Link href="/">Trang chủ</Link> {' > '} 
        <Link href="/cart">Giỏ hàng</Link> {' > '}
        <span className="text-black/50">Thanh toán</span>
      </div>
      
      {apiError && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Lỗi:</p>
          <p>{apiError}</p>
        </div>
      )}
      
      <h1 className="text-2xl font-bold text-green-600 my-5">THANH TOÁN</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bên trái: Form thanh toán */}
        <div className="md:col-span-2">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Thông tin khách hàng */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-green-600 mb-4">Thông tin khách hàng</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={customerInfo.fullName}
                    onChange={handleCustomerInfoChange}
                    className={`w-full p-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                    className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="0xxxxxxxxx"
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleCustomerInfoChange}
                    className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="example@gmail.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>
            
            {/* Địa chỉ giao hàng */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-green-600 mb-4">Địa chỉ giao hàng</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={customerInfo.city}
                    onChange={handleCustomerInfoChange}
                    className={`w-full p-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận/Huyện <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={customerInfo.district}
                    onChange={handleCustomerInfoChange}
                    className={`w-full p-2 border rounded-md ${errors.district ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="Quận 2">Quận 2</option>
                    <option value="Quận 3">Quận 3</option>
                    <option value="Quận 4">Quận 4</option>
                  </select>
                  {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phường/Xã <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="ward"
                    value={customerInfo.ward}
                    onChange={handleCustomerInfoChange}
                    className={`w-full p-2 border rounded-md ${errors.ward ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Chọn Phường/Xã</option>
                    <option value="Phường 1">Phường 1</option>
                    <option value="Phường 2">Phường 2</option>
                    <option value="Phường 3">Phường 3</option>
                    <option value="Phường 4">Phường 4</option>
                  </select>
                  {errors.ward && <p className="text-red-500 text-xs mt-1">{errors.ward}</p>}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ chi tiết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleCustomerInfoChange}
                  className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Số nhà, đường, khu vực"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={customerInfo.notes}
                  onChange={handleCustomerInfoChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                />
              </div>
            </div>
            
            {/* Phương thức vận chuyển */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-green-600 mb-4">Phương thức vận chuyển</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="shipping-standard"
                    name="shipping"
                    className="h-4 w-4 text-green-600"
                    checked={shippingMethod === ShippingMethod.STANDARD}
                    onChange={() => handleShippingMethodChange(ShippingMethod.STANDARD)}
                  />
                  <label htmlFor="shipping-standard" className="ml-2 block text-sm text-gray-700">
                    Giao hàng tiêu chuẩn (2-3 ngày) - {formatPrice(30000)}
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="shipping-express"
                    name="shipping"
                    className="h-4 w-4 text-green-600"
                    checked={shippingMethod === ShippingMethod.EXPRESS}
                    onChange={() => handleShippingMethodChange(ShippingMethod.EXPRESS)}
                  />
                  <label htmlFor="shipping-express" className="ml-2 block text-sm text-gray-700">
                    Giao hàng nhanh (1-2 ngày) - {formatPrice(50000)}
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="shipping-pickup"
                    name="shipping"
                    className="h-4 w-4 text-green-600"
                    checked={shippingMethod === ShippingMethod.STORE_PICKUP}
                    onChange={() => handleShippingMethodChange(ShippingMethod.STORE_PICKUP)}
                  />
                  <label htmlFor="shipping-pickup" className="ml-2 block text-sm text-gray-700">
                    Nhận tại cửa hàng - Miễn phí
                  </label>
                </div>
              </div>
            </div>
            
            {/* Phương thức thanh toán */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-green-600 mb-4">Phương thức thanh toán</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="payment-cod"
                    name="payment"
                    className="h-4 w-4 text-green-600"
                    checked={paymentMethod === PaymentMethod.COD}
                    onChange={() => setPaymentMethod(PaymentMethod.COD)}
                  />
                  <label htmlFor="payment-cod" className="ml-2 block text-sm text-gray-700">
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="payment-banking"
                    name="payment"
                    className="h-4 w-4 text-green-600"
                    checked={paymentMethod === PaymentMethod.BANKING}
                    onChange={() => setPaymentMethod(PaymentMethod.BANKING)}
                  />
                  <label htmlFor="payment-banking" className="ml-2 block text-sm text-gray-700">
                    Chuyển khoản ngân hàng
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="payment-momo"
                    name="payment"
                    className="h-4 w-4 text-green-600"
                    checked={paymentMethod === PaymentMethod.MOMO}
                    onChange={() => setPaymentMethod(PaymentMethod.MOMO)}
                  />
                  <label htmlFor="payment-momo" className="ml-2 block text-sm text-gray-700">
                    Ví MoMo
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="payment-visa"
                    name="payment"
                    className="h-4 w-4 text-green-600"
                    checked={paymentMethod === PaymentMethod.VISA}
                    onChange={() => setPaymentMethod(PaymentMethod.VISA)}
                  />
                  <label htmlFor="payment-visa" className="ml-2 block text-sm text-gray-700">
                    Thẻ tín dụng/ghi nợ
                  </label>
                </div>
              </div>
              
              {paymentMethod === PaymentMethod.BANKING && (
                <div className="mt-4 p-4 bg-blue-50 rounded-md text-sm">
                  <p className="font-bold">Thông tin chuyển khoản:</p>
                  <p>Ngân hàng: BIDV</p>
                  <p>Số tài khoản: 123456789</p>
                  <p>Chủ tài khoản: SHOP FRUIT</p>
                  <p>Nội dung chuyển khoản: [Họ tên] - [Số điện thoại]</p>
                </div>
              )}
            </div>
            
            {/* Nút đặt hàng chỉ hiển thị trên giao diện mobile */}
            <div className="md:hidden">
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className={`w-full py-3 px-4 bg-green-600 text-white font-bold rounded-md ${(isSubmitting || cartItems.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
              >
                {isSubmitting ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Bên phải: Tóm tắt đơn hàng */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow sticky top-5">
            <h2 className="text-xl font-bold text-green-600 mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="max-h-80 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item.product.MaSP} className="flex items-start py-2 border-b">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <Image 
                      src={item.product.TenHinh || "/images/placeholder.jpg"} 
                      width={64} 
                      height={64} 
                      alt={item.product.TenSP}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-gray-900">
                        <h3>{item.product.TenSP}</h3>
                        <p>
                          {formatPrice(
                            typeof item.product.GiaBan === 'string' 
                              ? parseInt(item.product.GiaBan.replace(/[^\d]/g, '')) * item.quantity
                              : item.product.GiaBan * item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-xs">
                      <p className="text-gray-500">Số lượng: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <p>Tạm tính</p>
                <p>{formatPrice(totalPrice)}</p>
              </div>
              <div className="flex justify-between">
                <p>Phí vận chuyển</p>
                <p>{formatPrice(shippingCost)}</p>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <p>Tổng cộng</p>
                <p className="text-red-600">{formatPrice(totalPrice + shippingCost)}</p>
              </div>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting || cartItems.length === 0}
              className={`w-full mt-6 py-3 px-4 bg-green-600 text-white font-bold rounded-md ${(isSubmitting || cartItems.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
            >
              {isSubmitting ? 'Đang xử lý...' : 'ĐẶT HÀNG'}
            </button>
            
            <div className="mt-4 text-xs text-gray-500">
              <p>Bằng cách đặt hàng, bạn đồng ý với các điều khoản sử dụng và chính sách bảo mật của chúng tôi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}