import { ReactNode } from "react";
import Image from "next/image";

type ProductProps = {
    children : ReactNode;
}

export default function Product({children}: ProductProps){
    return(
        <div className="product">
            <div className="flex justify-center">
                <h1 className="text-2xl text-white font-bold bg-green-400 rounded-4xl my-15 p-3 text-center w-200">{children}</h1>
            </div>       

            <div className="grid grid-cols-6 gap-6">
                {/* item 1 */}
                <div className="flex flex-col items-center">
                    <div className=""> 
                        <Image alt="Bó hoa" src="/images/products/quaTangTraiCay/bo-hoa-1.webp" width={182} height={182}></Image>
                    </div>
                    <div className="w-full">
                        <p className="px-3">Bó hoa dâu tây</p>
                        <p className="px-3 py-2 font-bold">855,000đ</p>
                    </div> 
                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm hover:bg-green-400 hover:text-white">CHỌN MUA</div>
                </div> 
                {/* item 1 */}
                <div className="flex flex-col items-center">
                    <div className=""> 
                        <Image alt="Bó hoa" src="/images/products/quaTangTraiCay/bo-hoa-1.webp" width={182} height={182}></Image>
                    </div>
                    <div className="w-full">
                        <p className="px-3">Bó hoa dâu tây</p>
                        <p className="px-3 py-2 font-bold">855,000đ</p>
                    </div> 
                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm">CHỌN MUA</div>
                </div> 
                {/* item 1 */}
                <div className="flex flex-col items-center">
                    <div className=""> 
                        <Image alt="Bó hoa" src="/images/products/quaTangTraiCay/bo-hoa-1.webp" width={182} height={182}></Image>
                    </div>
                    <div className="w-full">
                        <p className="px-3">Bó hoa dâu tây</p>
                        <p className="px-3 py-2 font-bold">855,000đ</p>
                    </div> 
                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm">CHỌN MUA</div>
                </div> 
                {/* item 1 */}
                <div className="flex flex-col items-center">
                    <div className=""> 
                        <Image alt="Bó hoa" src="/images/products/quaTangTraiCay/bo-hoa-1.webp" width={182} height={182}></Image>
                    </div>
                    <div className="w-full">
                        <p className="px-3">Bó hoa dâu tây</p>
                        <p className="px-3 py-2 font-bold">855,000đ</p>
                    </div> 
                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm">CHỌN MUA</div>
                </div>        
                {/* item 1 */}
                <div className="flex flex-col items-center">
                    <div className=""> 
                        <Image alt="Bó hoa" src="/images/products/quaTangTraiCay/bo-hoa-1.webp" width={182} height={182}></Image>
                    </div>
                    <div className="w-full">
                        <p className="px-3">Bó hoa dâu tây</p>
                        <p className="px-3 py-2 font-bold">855,000đ</p>
                    </div> 
                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm">CHỌN MUA</div>
                </div>        
                {/* item 1 */}
                <div className="flex flex-col items-center">
                    <div className=""> 
                        <Image alt="Bó hoa" src="/images/products/quaTangTraiCay/bo-hoa-1.webp" width={182} height={182}></Image>
                    </div>
                    <div className="w-full">
                        <p className="px-3">Bó hoa dâu tây</p>
                        <p className="px-3 py-2 font-bold">855,000đ</p>
                    </div> 
                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm">CHỌN MUA</div>
                </div>        
                {/* item 1 */}
                <div className="flex flex-col items-center">
                    <div className=""> 
                        <Image alt="Bó hoa" src="/images/products/quaTangTraiCay/bo-hoa-1.webp" width={182} height={182}></Image>
                    </div>
                    <div className="w-full">
                        <p className="px-3">Bó hoa dâu tây</p>
                        <p className="px-3 py-2 font-bold">855,000đ</p>
                    </div> 
                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm">CHỌN MUA</div>
                </div>        
                {/* item 1 */}
                <div className="flex flex-col items-center">
                    <div className=""> 
                        <Image alt="Bó hoa" src="/images/products/quaTangTraiCay/bo-hoa-1.webp" width={182} height={182}></Image>
                    </div>
                    <div className="w-full">
                        <p className="px-3">Bó hoa dâu tây</p>
                        <p className="px-3 py-2 font-bold">855,000đ</p>
                    </div> 
                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm">CHỌN MUA</div>
                </div>        
                {/* item 1 */}
                <div className="flex flex-col items-center">
                    <div className=""> 
                        <Image alt="Bó hoa" src="/images/products/quaTangTraiCay/bo-hoa-1.webp" width={182} height={182}></Image>
                    </div>
                    <div className="w-full">
                        <p className="px-3">Bó hoa dâu tây</p>
                        <p className="px-3 py-2 font-bold">855,000đ</p>
                    </div> 
                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm">CHỌN MUA</div>
                </div>        
                {/* item 1 */}
                <div className="flex flex-col items-center">
                    <div className=""> 
                        <Image alt="Bó hoa" src="/images/products/quaTangTraiCay/bo-hoa-1.webp" width={182} height={182}></Image>
                    </div>
                    <div className="w-full">
                        <p className="px-3">Bó hoa dâu tây</p>
                        <p className="px-3 py-2 font-bold">855,000đ</p>
                    </div> 
                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm">CHỌN MUA</div>
                </div>        
                {/* item 1 */}
                <div className="flex flex-col items-center">
                    <div className=""> 
                        <Image alt="Bó hoa" src="/images/products/quaTangTraiCay/bo-hoa-1.webp" width={182} height={182}></Image>
                    </div>
                    <div className="w-full">
                        <p className="px-3">Bó hoa dâu tây</p>
                        <p className="px-3 py-2 font-bold">855,000đ</p>
                    </div> 
                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm">CHỌN MUA</div>
                </div>        
                {/* item 1 */}
                <div className="flex flex-col items-center">
                    <div className=""> 
                        <Image alt="Bó hoa" src="/images/products/quaTangTraiCay/bo-hoa-1.webp" width={182} height={182}></Image>
                    </div>
                    <div className="w-full">
                        <p className="px-3">Bó hoa dâu tây</p>
                        <p className="px-3 py-2 font-bold">855,000đ</p>
                    </div> 
                    <div className="text-center text-sm border border-green-500 text-green-500 px-10 py-1 rounded-sm">CHỌN MUA</div>
                </div>        
            </div>

            <div className="text-center px-3 py-2 border text-sm border-green-500 w-100 m-auto my-15 rounded-sm text-green-600">
                Xem thêm sản phẩm <span className="font-bold">{children}</span> 
            </div>
        </div>
    );
}