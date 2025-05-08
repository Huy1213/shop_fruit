"use client"
import { useState } from 'react';
import Image from "next/image"

const images = [
    '/images/partner/img_partner_1_medium.webp',
    '/images/partner/img_partner_2_medium.webp',
    '/images/partner/img_partner_3_medium.webp',
    '/images/partner/img_partner_5_medium.webp',
    '/images/partner/img_partner_6_medium.webp',
    '/images/partner/img_partner_8_medium.webp',
    '/images/partner/img_partner_9_medium.webp',
    '/images/partner/img_partner_10_medium.webp',
];

// Định nghĩa kiểu dữ liệu rõ ràng cho chunkedImages
const chunkedImages: string[][] = [];
for (let i = 0; i < images.length; i += 4) {
    chunkedImages.push(images.slice(i, i + 4));
}

export default function Partner() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % chunkedImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + chunkedImages.length) % chunkedImages.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <div className="partner container mx-auto py-12 px-4">
            <h1 className="bg-green-500 px-3 py-2 rounded-3xl text-center w-fit mx-auto font-bold text-2xl text-white mb-10">Đối tác đã tin tưởng</h1>
            
            <div className="relative">
                {/* Nút prev - cập nhật CSS để tạo hình tròn hoàn chỉnh */}
                <button 
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/50"
                >
                    &#10094;
                </button>
                
                {/* Hiển thị hình ảnh trong slide hiện tại */}
                <div className="flex justify-center gap-6">
                    {chunkedImages[currentSlide].map((img, index) => (
                        <div key={index} className="w-[200px] h-[182px] flex items-center justify-center">
                            <Image 
                                src={img} 
                                height={182} 
                                width={200} 
                                alt="đối tác" 
                                className="object-contain" 
                            />
                        </div>
                    ))}
                </div>
                
                {/* Nút next - cập nhật CSS để tạo hình tròn hoàn chỉnh */}
                <button 
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/30 text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/50"
                >
                    &#10095;
                </button>
            </div>
            
            {/* Điểm chuyển slide - cập nhật CSS */}
            <div className="flex justify-center mt-6 gap-3">
                {chunkedImages.map((_, index) => (
                    <button 
                        key={index} 
                        onClick={() => goToSlide(index)}
                        className={`w-4 h-4 rounded-full ${currentSlide === index ? 'bg-green-500' : 'bg-gray-300'} hover:bg-green-300 transition-colors`}
                        aria-label={`Đi đến slide ${index + 1}`}
                    ></button>
                ))}
            </div>
        </div>
    )
}