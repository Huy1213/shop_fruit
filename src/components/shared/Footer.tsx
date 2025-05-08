import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
export default function Footer(){
    return(
        <footer className="border-t border-black/30">
            <div className="max-w-7xl mx-auto grid grid-cols-2 text-sm py-10">
                <div>
                    <div className="grid grid-cols-2">
                        <div>
                            <h3 className="text-xl font-bold">Về Morning Fruit</h3>
                            <p>Morning Fruit là thương hiệu trái cây tươi chất lượng cao, với đa dạng sản phẩm phục vụ mọi nhu cầu: đặc sản vùng miền, trái cây nhập khẩu, quà tặng trái cây, mâm ngũ quả, nước ép, và trái cây sấy.</p>
                        </div>
                        <div>
                            <p className="mt-8"><b>Chi nhánh 1:</b> Lầu 1, 43 Nguyễn Thái Học, phường Cầu Ông Lãnh, quận 1, TP. Hồ Chí Minh.</p>
                            <p><b>Điện thoại:</b> 0865660775</p>
                            <p><b>Email:</b> hello@morningfruit.com.vn</p>
                        </div>
                    </div>
                    <div className="mt-10">
                        <p><b>Bản quyền của Công ty TNHH Morning Fruit</b></p>
                        <p>Giấy chứng nhận Đăng ký Kinh doanh số 0316077880 do Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh cấp ngày 02/01/2020. Đăng ký thay đổi lần 4 ngày 22/04/2022
                        Giấy chứng nhận cơ sở đủ điều kiện an toàn thực phẩm số 3091/2022/BQLATTP-HCM do Ban Quản lý An toàn thực phẩm thành phố Hồ Chí Minh cấp ngày 17/06/2022</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2">
                    <div>
                        <p className="text-xl font-bold">Hỗ trợ khách hàng</p>
                        <ul className="flex flex-col gap-4 mt-4">
                            <li>Tìm kiếm</li>
                            <li>Câu chuyện thương hiệu</li>
                            <li>Chính sách thành viên</li>
                            <li>Chính sách bảo hành</li>
                            <li>Chính sách kiểm hàng</li>
                            <li>Chính sách thanh toán</li>
                            <li>Chính sách bảo mật</li>
                            <li>Hướng dẫn mua hàng Online</li>
                            <li>Kiến thức trái cây</li>
                            <li>Liên hệ</li>
                        </ul>
                    </div>
                    <div>
                        <p className="text-xl font-bold">Chăm sóc khách hàng</p>
                        <div className='flex items-center gap-5 border border-green-500 rounded-2xl p-3 mt-4'>
                            <div>
                                <FontAwesomeIcon icon={faPhoneVolume} className='text-3xl text-green-500' />
                            </div>
                            <div className='text-xl'>
                                <p>0337841105</p>
                                <p>thanhhuy9b@gmail.com</p>
                            </div>           
                        </div>
                        <div className='mt-4'>
                            <p className='text-xl'>Follow Us</p>
                            <div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='text-center py-2 border-t border-black/30 text-sm'>
                Copyright © 2025 Morning Fruit - Trái Cây Chất Lượng Cao
            </div>
        </footer>
    )
}