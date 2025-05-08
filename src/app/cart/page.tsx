import Link from "next/link"
import Image from "next/image"
export default function cart(){
    return(
        <div className="cart mb-20">
            <div className="text-sm p-2">
                <Link href="/">Trang chủ </Link> 
                <span className="text-black/50">/ Giỏ hàng (1)</span>
            </div>
            <div className="p-2 flex">
                <div>
                    <h1 className="font-bold text-green-500">GIỎ HÀNG CỦA BẠN</h1>
                    <p className="py-2">Bạn đang có <span className="font-bold">3 sản phẩm</span> trong giỏ hàng</p>
                    <div className="p-5 border  border-black/30 rounded-2xl w-200">
                        {/* item 1 */}
                        <div className="items-center flex justify-between border-b border-black/30 pb-5">
                            <div className="flex gap-5">
                                <Image src="/images/products/traiCayVietNam/dua-hau.webp" width={80} height={80} alt=""></Image>
                                <div className="flex flex-col gap-2">
                                    <p>Dưa lưới hoàng kim</p>
                                    <p className="text-xs">Trái 1.6kg</p>
                                    <p className="font-bold text-black/50">105,000₫</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <p className="font-bold">105,000₫</p>
                                    <div>
                                        123
                                    </div>
                                </div>
                                <div>
                                    <button className="bg-red-500 py-2 px-6 rounded-xl text-xl text-white">xóa</button>
                                </div>  
                            </div>                  
                        </div>   
                        {/* item 1 */}
                        <div className="items-center flex justify-between border-b border-black/30 pb-5">
                            <div className="flex gap-5">
                                <Image src="/images/products/traiCayVietNam/dua-hau.webp" width={80} height={80} alt=""></Image>
                                <div className="flex flex-col gap-2">
                                    <p>Dưa lưới hoàng kim</p>
                                    <p className="text-xs">Trái 1.6kg</p>
                                    <p className="font-bold text-black/50">105,000₫</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <p className="font-bold">105,000₫</p>
                                    <div>
                                        123
                                    </div>
                                </div>
                                <div>
                                    <button className="bg-red-500 py-2 px-6 rounded-xl text-xl text-white">xóa</button>
                                </div>  
                            </div>                  
                        </div>   
                        {/* item 1 */}
                        <div className="items-center flex justify-between border-b border-black/30 pb-5">
                            <div className="flex gap-5">
                                <Image src="/images/products/traiCayVietNam/dua-hau.webp" width={80} height={80} alt=""></Image>
                                <div className="flex flex-col gap-2">
                                    <p>Dưa lưới hoàng kim</p>
                                    <p className="text-xs">Trái 1.6kg</p>
                                    <p className="font-bold text-black/50">105,000₫</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <p className="font-bold">105,000₫</p>
                                    <div>
                                        123
                                    </div>
                                </div>
                                <div>
                                    <button className="bg-red-500 py-2 px-6 rounded-xl text-xl text-white">xóa</button>
                                </div>  
                            </div>                  
                        </div>   
                        
                    </div>
                </div>
                <div className="w-100 p-4">
                    <h1 className="font-bold text-green-500">Thông tin đơn hàng</h1>
                    <div>
                        <div className="flex justify-between p-1">  
                            <p>Cà chua</p>
                            <p>x1</p>                   
                        </div>
                        <div className="flex justify-between p-1">  
                            <p>Cà chua nam phi</p>
                            <p>x10</p>                   
                        </div>
                        <div className="flex justify-between p-1">  
                            <p>Cà chua hoa đậu biếc thạch giòn</p>
                            <p>x1</p>                   
                        </div>
                    </div>
                    <div className="flex justify-between py-2 border-t border-black/30 items-center">
                        <p className="font-bold">Tổng tiền:</p>
                        <p className="font-bold text-2xl text-red-500">305,000₫</p>
                    </div>
                    <ul>
                        <li>Phí vận chuyển sẽ được tính ở trang thanh toán.</li>
                        <li>Bạn cũng có thể nhập mã giảm giá ở trang thanh toán.</li>
                    </ul>
                    <button className="bg-green-500 text-white w-90 px-4 py-2 rounded-md mt-5">
                        THANH TOÁN
                    </button>

                    <div className="p-5 rounded-sm bg-blue-100 mt-10">
                        <p className="font-bold">Chính sách mua hàng</p>
                        <p>Hiện chúng tôi chỉ áp dụng thanh toán với đơn hàng có giá trị tối thiểu 100.000₫ trở lên.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}