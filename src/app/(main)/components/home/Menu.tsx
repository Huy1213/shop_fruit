'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Thêm hook này
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

interface DanhMuc{
    MaDM : string;
    TenDM : string;
}

export default function Menu(){
    const [danhMuc, setDanhMuc] = useState<DanhMuc[]>([]);
    const pathname = usePathname(); // Lấy URL hiện tại
    
    useEffect(()=> {
        try {
            const fetchData = async () =>{
                const res = await fetch("/api/collections");
                const data = await res.json();
                setDanhMuc(data);
            }
            fetchData();
        } catch (error) {
            console.log(error);
        }
    },[]);
    
    return(
        <ul className="flex justify-between mt-5 p-2">
            <li className={`w-23 h-23 rounded-md flex items-center justify-center border border-green-300 ${pathname === "/" ? "bg-green-400 text-white" : "text-green-600"}`}>
                <Link href="/">
                    <FontAwesomeIcon icon={faHouse} className={pathname === "/" ? "text-white" : "text-green-600"} />
                </Link>
            </li>
            <li className={`w-23 h-23 rounded-md flex items-center justify-center border border-green-300 ${pathname === "/" ? "bg-green-400 text-white" : "text-green-600"}`}>
                <Link href="/">
                    Trang chủ
                </Link>
            </li>
            {danhMuc.map((data)=>{
                const href = `/collections/${data.MaDM}`;
                const isActiveLink = pathname === href || pathname.startsWith(href);
                
                return (
                    <li key={data.MaDM} className={`w-23 h-23 rounded-md flex items-center justify-center border border-green-300 ${isActiveLink ? "bg-green-400 text-white" : "text-green-600"}`}>
                        <Link href={href} className="text-center">
                            {data.TenDM}
                        </Link>
                    </li>
                );
            })}
            <li className={`w-23 h-23 rounded-md flex items-center justify-center border border-green-300 ${pathname === "/thuong-hieu" ? "bg-green-400 text-white" : "text-green-600"}`}>
                <Link href="/thuong-hieu" className="text-center">
                    Câu chuyện thương hiệu
                </Link>
            </li>
            <li className={`w-23 h-23 rounded-md flex items-center justify-center border border-green-300 ${pathname === "/lien-he" ? "bg-green-400 text-white" : "text-green-600"}`}>
                <Link href="/lien-he" className="text-center">
                    Liên hệ
                </Link>
            </li>
        </ul>
    )
}