'use client';
import Image from "next/image";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

const Images = [
    '/images/carousels/slide_1.jpg',
    '/images/carousels/slide_2.webp',
    '/images/carousels/slide_3.webp',
];
export default function Carousel(){
    const [currentIndex,setCurrentIndex] = useState(0);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? Images.length - 1 : prev - 1));
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === Images.length - 1 ? 0 : prev + 1));
    }

    useEffect(()=>{
        const interval = setInterval(()=> {
            setCurrentIndex((prev) => (prev === Images.length - 1 ? 0 : prev + 1));
        },3000);

        return ()=>clearInterval(interval);
    },[]);

    return(
        <div className="carousel relative">
            <figure className="w-full">
                <Image src={Images[currentIndex]} alt="" width={1280} height={400}/>
            </figure>
            <div className="absolute top-1/2 left-3 -translate-y-1/2 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow hover:bg-green-500 hover:text-white"
            onClick={handlePrev}>
                <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
            </div>
            <div onClick={handleNext} className="absolute top-1/2 right-3 -translate-y-1/2 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow hover:bg-green-500 hover:text-white">
                <FontAwesomeIcon icon={faArrowRight} className="text-xl" />
            </div>
        </div>
    );
}