import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse } from '@fortawesome/free-solid-svg-icons';

export default function Menu(){
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
            <li className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300 text-green-600">
                <Link href="/" className="text-center">
                    Trái ngon hôm nay
                </Link>
            </li>
            <li className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300 text-green-600">
                <Link href="/" className="text-center">
                    Trái ngon hôm nay
                </Link>
            </li>
            <li className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300 text-green-600">
                <Link href="/" className="text-center">
                    Trái ngon hôm nay
                </Link>
            </li>
            <li className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300 text-green-600">
                <Link href="/" className="text-center">
                    Trái ngon hôm nay
                </Link>
            </li>
            <li className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300 text-green-600">
                <Link href="/" className="text-center">
                    Trái ngon hôm nay
                </Link>
            </li>
            <li className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300 text-green-600">
                <Link href="/" className="text-center">
                    Trái ngon hôm nay
                </Link>
            </li>
            <li className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300 text-green-600">
                <Link href="/" className="text-center">
                    Trái ngon hôm nay
                </Link>
            </li>
            <li className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300 text-green-600">
                <Link href="/" className="text-center">
                    Trái ngon hôm nay
                </Link>
            </li>
            <li className="w-23 h-23 rounded-md flex items-center justify-center border border-green-300 text-green-600">
                <Link href="/" className="text-center">
                    Trái ngon hôm nay
                </Link>
            </li>
            
            
        </ul>
    )
}