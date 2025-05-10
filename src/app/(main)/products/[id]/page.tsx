'use client';
import { useState, useEffect } from "react";; 
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCart } from "../../contexts/CartContext";

interface SanPham {
    MaSP: string;
    MaDM : string;
    TenHinh : string;
    TenSP: string;
    SoLuong : number;
    GiaBan: number | string;
    GiaGiam: number | string;
    MoTa: number;
}

interface CartItem {
    product: SanPham;
    quantity: number;
}

export default function Products(){
    const params = useParams();
    const id = params.id; 
    const [product, setProduct] = useState<SanPham | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const { addToCart } = useCart();

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            setQuantity(value);
        }
    };
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };



    useEffect(()=>{
        if(!id) return;
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`)
                const data = await res.json();
                if(data.error){
                    setError(data.error);
                    setProduct(null);
                }else {
                    setProduct(data);
                }  
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally{
                setLoading(false);
            }
        }
        fetchProduct();
    },[id]);

    // Hàm thêm vào giỏ hàng sử dụng localStorage
    const handleAddToCart = () => {
        if (!product) return;
        
        setIsAddingToCart(true);
        
        try {
            // Sử dụng addToCart từ context
            addToCart(product, quantity);
            
            // Hiển thị thông báo thành công
            alert("Đã thêm sản phẩm vào giỏ hàng!");
            // Có thể chuyển hướng đến trang giỏ hàng
            // router.push('/cart');
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            alert("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng");
        } finally {
            setIsAddingToCart(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-green-500 animate-spin" />               
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-red-500 mb-4">Sản phẩm không tồn tại</h1>
                <p className="mb-6">{error}</p>
                <Link href="/">
                    <span className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600">
                        Quay về trang chủ
                    </span>
                </Link>
            </div>
        );
    }

    return(
        <>
            <div className="text-sm p-2">
                <Link href="/">Trang chủ </Link> 
                <span className="text-black/50">Trái cây việt nam</span>
            </div>
            <div className="grid grid-cols-2">
                <div>
                    <div className="h-[600px] w-[510px]">
                        <Image alt="" src={product?.TenHinh || "/images/placeholder.jpg"} width={508} height={508}></Image>
                    </div>
                    <div className="grid grid-cols-6">
                        <Image alt="" src="/images/products/traiCayVietNam/dua-luoi.webp" width={75} height={75}></Image>
                        <Image alt="" src="/images/products/traiCayVietNam/dua-luoi.webp" width={75} height={75}></Image>
                        <Image alt="" src="/images/products/traiCayVietNam/dua-luoi.webp" width={75} height={75}></Image>
                        <Image alt="" src="/images/products/traiCayVietNam/dua-luoi.webp" width={75} height={75}></Image>
                        <Image alt="" src="/images/products/traiCayVietNam/dua-luoi.webp" width={75} height={75}></Image>
                    </div>
                </div>
                <div>
                    <div>
                        <h1 className="text-3xl font-bold text-green-500 py-2">{product?.TenSP}</h1>
                        <p className="py-2">
                            Mã sản phẩm: <span className="text-green-500">{product?.MaSP}</span> | Tình trạng: <span className="text-green-500">Còn hàng </span>
                        </p>
                        <div>
                            <h3 className="py-2 text-2xl font-bold text-green-500">Mã giảm giá</h3>
                            <div className="flex gap-4">
                                <div className="border border-green-500 p-2 rounded-xl">
                                    FREESHIP40K
                                </div>
                                <div className="border border-green-500 p-2 rounded-xl">
                                    FREESHIP30K
                                </div>
                                <div className="border border-green-500 p-2 rounded-xl">
                                    FREESHIP30K
                                </div>
                            </div>
                            <div className="text-3xl py-4 text-red-500">{product?.GiaBan}</div>
                            <div className="flex items-center gap-5">
                                <div>Tiêu đề:</div>
                                <div className="flex gap-2">
                                    <div className="bg-green-500 p-2 rounded-xl text-white">Nguyên trái</div>
                                    <div className="bg-green-500 p-2 rounded-xl text-white">Thơm</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-5 mt-10 items-center">
                            <div className="border border-black/40">
                                <button className="w-12 h-12 text-xl font-bold bg-black/10" onClick={decreaseQuantity}>-</button>
                                <input className="bg-white h-12 w-12 text-center" type="number" value={quantity}
                                    onChange={handleQuantityChange}
                                    min="1" readOnly/>
                                <button className="w-12 h-12 text-xl font-bold bg-black/10" onClick={increaseQuantity}>+</button>
                            </div>
                            <div>
                                <button 
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className={`w-100 h-12 bg-green-500 text-white px-4 hover:font-bold hover:rounded-md ${isAddingToCart ? 'opacity-50 cursor-wait' : ''}`}
                                >
                                    {isAddingToCart ? 'ĐANG THÊM...' : 'THÊM VÀO GIỎ'}
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-xl py-4">Mô tả</h3>
                            <p className="border border-green-500 w-130 h-60 rounded-3xl p-3">
                                {product?.MoTa}
                            </p>
                        </div>  
                    </div>
                </div>
            </div>
            <div className="mt-10 border-t border-black/30">
                <h1 className="text-center text-3xl font-bold text-green-500 py-4">Sản phẩm liên quan</h1>
                <div>
                    <div className="grid grid-cols-6 gap-6 mb-20">
                                {/* item 1 */}
                                <div className="flex flex-col items-center">
                                    <div className="">
                                    <Image
                                        alt="Bó hoa"
                                        src="/images/products/traiCayVietNam/buoi-da-xanh.webp"
                                        width={182}
                                        height={182}
                                    ></Image>
                                    </div>
                                    <div className="w-full">
                                    <p className="px-3">Bó hoa dâu tây</p>
                                    <p className="px-3 py-2 font-bold">855,000đ</p>
                                    </div>
                                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm hover:bg-green-400 hover:text-white">
                                    CHỌN MUA
                                    </div>
                                </div>
                                {/* item 1 */}
                                <div className="flex flex-col items-center">
                                    <div className="">
                                    <Image
                                        alt="Bó hoa"
                                        src="/images/products/quaTangTraiCay/bo-hoa-1.webp"
                                        width={182}
                                        height={182}
                                    ></Image>
                                    </div>
                                    <div className="w-full">
                                    <p className="px-3">Bó hoa dâu tây</p>
                                    <p className="px-3 py-2 font-bold">855,000đ</p>
                                    </div>
                                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm hover:bg-green-400 hover:text-white">
                                    CHỌN MUA
                                    </div>
                                </div>
                                {/* item 1 */}
                                <div className="flex flex-col items-center">
                                    <div className="">
                                    <Image
                                        alt="Bó hoa"
                                        src="/images/products/quaTangTraiCay/bo-hoa-1.webp"
                                        width={182}
                                        height={182}
                                    ></Image>
                                    </div>
                                    <div className="w-full">
                                    <p className="px-3">Bó hoa dâu tây</p>
                                    <p className="px-3 py-2 font-bold">855,000đ</p>
                                    </div>
                                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm hover:bg-green-400 hover:text-white">
                                    CHỌN MUA
                                    </div>
                                </div>
                                {/* item 1 */}
                                <div className="flex flex-col items-center">
                                    <div className="">
                                    <Image
                                        alt="Bó hoa"
                                        src="/images/products/quaTangTraiCay/bo-hoa-1.webp"
                                        width={182}
                                        height={182}
                                    ></Image>
                                    </div>
                                    <div className="w-full">
                                    <p className="px-3">Bó hoa dâu tây</p>
                                    <p className="px-3 py-2 font-bold">855,000đ</p>
                                    </div>
                                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm hover:bg-green-400 hover:text-white">
                                    CHỌN MUA
                                    </div>
                                </div>
                                {/* item 1 */}
                                <div className="flex flex-col items-center">
                                    <div className="">
                                    <Image
                                        alt="Bó hoa"
                                        src="/images/products/quaTangTraiCay/bo-hoa-1.webp"
                                        width={182}
                                        height={182}
                                    ></Image>
                                    </div>
                                    <div className="w-full">
                                    <p className="px-3">Bó hoa dâu tây</p>
                                    <p className="px-3 py-2 font-bold">855,000đ</p>
                                    </div>
                                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm hover:bg-green-400 hover:text-white">
                                    CHỌN MUA
                                    </div>
                                </div>
                                {/* item 1 */}
                                <div className="flex flex-col items-center">
                                    <div className="">
                                    <Image
                                        alt="Bó hoa"
                                        src="/images/products/quaTangTraiCay/bo-hoa-1.webp"
                                        width={182}
                                        height={182}
                                    ></Image>
                                    </div>
                                    <div className="w-full">
                                    <p className="px-3">Bó hoa dâu tây</p>
                                    <p className="px-3 py-2 font-bold">855,000đ</p>
                                    </div>
                                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm hover:bg-green-400 hover:text-white">
                                    CHỌN MUA
                                    </div>
                                </div>               
                                </div>
                </div>
            </div>
        </>
    )
}