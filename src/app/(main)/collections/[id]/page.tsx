"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface SanPham {
    MaSP: string;
    MaDM: string;
    MaHinh: string;
    TenSP: string;
    SoLuong: number;
    GiaBan: number | string;
    GiaGiam: number | string;
    MoTa: number;
    TenHinh: string;
    }

    interface DanhMuc {
    MaDM: string;
    TenDM: string;
    HinhAnh: string;
    }

    export default function Collections() {
    const params = useParams(); // ⚠️ Sử dụng useParams thay vì useRouter
    const id = params.id; // lấy 'id' từ URL
    const [products, setProducts] = useState<SanPham[]>([]);
    const [category, setCategory] = useState<DanhMuc | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return; // Chỉ chạy khi 'id' có giá trị
        const fetchProducts = async () => {
        try {
            const productsRes = await fetch(`/api/collections/${id}`);
            const productsData = await productsRes.json();
            setProducts(
            Array.isArray(productsData) ? productsData : [productsData]
            );

            const categoryRes = await fetch(`/api/categories/${id}`);
            const categoryData = await categoryRes.json();
            setCategory(categoryData);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchProducts();
    }, [id]); // Chạy lại mỗi khi 'id' thay đổi

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
        </div>
        );
    }

    return (
        <>
        <div className="text-sm p-2">
            <Link href="/">Trang chủ </Link> /{" "}
            <span className="text-black/50">{category?.TenDM}</span>
        </div>
        <div>
            <Image
            src={category?.HinhAnh || "/images/colections/trai-cay-viet-nam.webp"}
            alt=""
            width={1280}
            height={280}
            ></Image>
        </div>
        <div className="flex justify-between px-10 py-20 items-center">
            <div className="text-2xl text-green-500 font-bold">
            {category?.TenDM}
            </div>
            <div>Xắp xếp</div>
        </div>
        <div className="mb-20">
            <div className="grid grid-cols-6 gap-6">
            {products.map((product) => (
                <Link key={product.MaSP} href={`/products/${product.MaSP}`}>
                <div className="flex flex-col items-center">
                    <div className="">
                    <Image
                        alt="Bó hoa"
                        src={product.TenHinh}
                        width={182}
                        height={182}
                    ></Image>
                    </div>
                    <div className="w-full">
                    <p className="px-3">{product.TenSP}</p>
                    <p className="px-3 py-2 font-bold">{product.GiaBan}</p>
                    </div>
                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm hover:bg-green-400 hover:text-white">
                    CHỌN MUA
                    </div>
                </div>
                </Link>
            ))}
            </div>
        </div>
        </>
    );
}
