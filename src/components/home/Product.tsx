'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface SanPham {
    MaSP: string;
    MaDM: string;
    TenHinh : string;
    TenSP: string;
    SoLuong: number;
    GiaBan: number | string;
    GiaGiam: number | string;
    MoTa: string;
}
interface DanhMuc {
    MaDM: string;
    TenDM: string;
    HinhAnh?: string;
}
type ProductProps = {
    id: string; // Chỉ cần maDM, không cần children nữa
    limit?: number; // Số lượng sản phẩm tối đa hiển thị, mặc định là 6
};

export default function Product({ id, limit = 6 }: ProductProps){
    const [products, setProducts] = useState<SanPham[]>([]);
    const [category, setCategory] = useState<DanhMuc | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Lấy thông tin danh mục
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await fetch(`/api/categories/${id}`);
                const data = await res.json();
                setCategory(data);
            } catch (error) {
                console.error("Error fetching category:", error);
            }
        };
        
        if (id) {
            fetchCategory();
        }
    }, [id]);
    
    // Lấy danh sách sản phẩm dựa trên maDM
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/collections/${id}`);
                const data = await res.json();
                
                // Lấy số lượng sản phẩm giới hạn theo limit
                const limitedProducts = Array.isArray(data) 
                    ? data.slice(0, limit) 
                    : [];
                
                setProducts(limitedProducts);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        
        if (id) {
            fetchProducts();
        }
    }, [id, limit]);
    return(
        <div className="product">
            <div className="flex justify-center">
                <h1 className="text-2xl text-white font-bold bg-green-400 rounded-4xl my-15 p-3 text-center w-200">
                    {category ? category.TenDM : 'Đang tải...'}
                </h1>
            </div>       

            <div className="grid grid-cols-6 gap-6">
                {loading ? (
                    <p className="col-span-6 text-center">Đang tải...</p>
                ) : products.length > 0 ?(
                    products.map((product)=>(
                        <div key={product.MaSP} className="flex flex-col items-center">
                            <div className=""> 
                                <Image alt="Bó hoa" src={product.TenHinh} width={182} height={182}></Image>
                            </div>
                            <div className="w-full">
                                <p className="px-3">{product.TenSP}</p>
                                <p className="px-3 py-2 font-bold">{product.GiaBan}đ</p>
                            </div> 
                            <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm hover:bg-green-400 hover:text-white">CHỌN MUA</div>
                        </div>    
                    ))
                    
                ) : (
                    <p className="col-span-6 text-center">Không có sản phẩm nào</p>
                )}        
            </div>

            <div className="text-center px-3 py-2 border text-sm border-green-500 w-100 m-auto my-15 rounded-sm text-green-600">
                <Link href={`/collections/${category?.MaDM}`}> Xem thêm sản phẩm <span className="font-bold">{category?.TenDM}</span> </Link>
            </div>
        </div>
    );
}