import Image from "next/image";
import Link from "next/link";
export default function products(){
    return(
        <>
            <div className="text-sm p-2">
                <Link href="/">Trang chủ </Link> 
                <span className="text-black/50">Trái cây việt nam</span>
            </div>
            <div className="grid grid-cols-2">
                <div>
                    <div className="h-[600px] w-[510px]">
                        <Image alt="" src="/images/products/traiCayVietNam/dua-luoi.webp" width={508} height={508}></Image>
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
                        <h1 className="text-3xl font-bold text-green-500 py-2">Sầu riêng Musang King</h1>
                        <p className="py-2">
                            Mã sản phẩm: <span className="text-green-500">2010323 </span> | Tình trạng: <span className="text-green-500">Còn hàng </span>
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
                            <div className="text-3xl py-4 text-red-500">355,000₫</div>
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
                                <button className="w-12 h-12 text-xl font-bold bg-black/10">-</button>
                                <input className="bg-white h-12 w-12 text-center" type="number" />
                                <button className="w-12 h-12 text-xl font-bold bg-black/10">+</button>
                            </div>
                            <div>
                                <button className="w-100 h-12 bg-green-500 text-white hover:font-bold hover:rounded-md">THÊM VÀO GIỎ</button>
                            </div>
                        </div>   
                        <div>
                            <h3 className="font-bold text-xl py-4">Mô tả</h3>
                            <p className="border border-green-500 w-130 h-60 rounded-3xl p-3">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Adipisci cumque eaque, consectetur mollitia doloribus qui error ratione nam facere corrupti. Pariatur, totam error. Qui quos, doloremque repellat reiciendis quas hic?
                                Quo explicabo, distinctio aut, temporibus neque amet ipsa labore dolores excepturi dolorum expedita dicta a ea quas! Laboriosam aperiam autem neque quae qui, labore totam ut earum consequuntur, maxime necessitatibus.
                                Blanditiis
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