'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '@/app/contexts/CartContext';
import { useEffect } from 'react';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null); // Tạo ref
    
    // Sử dụng Context API thay vì truy cập localStorage trực tiếp
    const { cartCount } = useCart();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false); // Nếu click bên ngoài, đóng menu
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className='bg-green-600 text-white'>
            <nav className='max-w-7xl mx-auto flex justify-between px-4 py-3 items-center'>
                <div className='flex space-x-3 items-center'>
                    <div className='text-white relative'  ref={menuRef}>
                        {/* Icon bars */}
                        <button onClick={()=> setMenuOpen(!menuOpen)}>
                            <FontAwesomeIcon className='p-3 ' icon={faBars}  />
                        </button>
                        
                        {/* menu */}
                        {menuOpen && (
                            <div className='absolute z-100 bg-white border border-black/20 shadow-xl w-80 top-14 p-2'>
                                <div className='border-b border-black/20'>
                                    <FontAwesomeIcon className='text-green-600' icon={faHouse} />
                                </div>
                                <div className='text-black font-bold text-sm'>
                                    <ul className='flex flex-col gap-y-5 mt-5'>
                                        <li>
                                            <Link href="/" className=''>
                                                TRANG CHỦ
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/" className=''>
                                                TRÁI CÂY HÔM NAY
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/" className=''>
                                                TRÁI CÂY HÔM NAY
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/" className=''>
                                                TRÁI CÂY HÔM NAY
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/" className=''>
                                                TRÁI CÂY HÔM NAY
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/" className=''>
                                                TRÁI CÂY HÔM NAY
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/" className=''>
                                                CÂU CHUYỆN THƯƠNG HIỆU
                                            </Link>
                                        </li>
                                        <li>
                                            <Link href="/" className=''>
                                                LIÊN HỆ
                                            </Link>
                                        </li>
                                    </ul>   
                                    <ul className='mt-5 font-normal flex flex-col gap-y-5'>
                                        <li className=''>BẠN CẦN HỖ TRỢ</li>
                                        <li><FontAwesomeIcon icon={faPhone} /> 0337841105</li>
                                        <li><FontAwesomeIcon icon={faEnvelope} /> thanhhuy9b@gmail.com</li>
                                    </ul>                 
                                </div>
                            </div>
                        )}                     
                    </div>
                    {/* Logo */}
                    <Link href="/" className='text-xl font-bold text-white'>
                        SHOPFRUIT
                    </Link>
                    <div className='seach rounded overflow-hidden'>
                        <input type="text"  placeholder='Tìm kiếm sản phẩm...' className='px-3 py-1 outline-none bg-white text-black/70'/>
                        <button className='bg-white px-3 py-1 text-black cursor-pointer'>
                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#878f9b",}} />
                        </button>
                    </div>    
                </div> 
                <Link href="/" className='text-center text-sm'>
                    <div>Giao hoặc đến lấy tại <FontAwesomeIcon icon={faCaretDown} /></div>
                </Link>

                {/* Icon giỏ hàng */}
                <Link href="/" className='text-center text-sm'>
                    <FontAwesomeIcon icon={faPhone} />
                    <div>HostLine: 0337841105</div>
                </Link>
                <Link href="/" className='text-center text-sm'>
                    <FontAwesomeIcon icon={faUser} />
                    <div>Tài khoản</div>
                </Link>
                <Link href="/cart" className='text-center text-sm relative'>
                    <FontAwesomeIcon icon={faCartShopping} />
                    <div>Giỏ hàng</div>
                    {cartCount > 0 && (
                        <span className="absolute top-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {cartCount}
                        </span>
                    )}
                </Link>
            </nav>
        </header>
    );
}