'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

interface DanhMuc{
    MaDM : string;
    TenDM : string;
}

export default function Menu(){
    const [danhMuc,setDanhMuc] = useState<DanhMuc[]>([]);
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
            <li className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300">
                <Link href="/">
                    <FontAwesomeIcon icon={faHouse} className="text-green-600"/>
                </Link>
            </li>
            <li className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300 bg-green-400 text-white">
                <Link href="/">
                    Trang chủ
                </Link>
            </li>
            {danhMuc.map((data)=>(
                <li key={data.MaDM} className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300 text-green-600">
                    <Link href={`/collections/${data.MaDM}`}className="text-center">
                        {data.TenDM}
                    </Link>
                </li>
            ))}
            <li className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300 text-green-600">
                <Link href="/" className="text-center">
                    Câu chuyện thương hiệu
                </Link>
            </li>
            <li className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300 text-green-600">
                <Link href="/" className="text-center">
                    Liên hệ
                </Link>
            </li>
            
        </ul>
    )
}