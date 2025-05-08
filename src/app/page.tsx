import Image from "next/image";
import Menu from "@/components/home/Menu";
import Carousel from "@/components/home/Carousel";
import Product from "@/components/home/Product";
import Partner from "@/components/home/Partner";

export default function Home() {
  return (
    <>
      <Menu/>
      <Carousel/>
      <Product>Quà tặng trái cây</Product>
      <Partner/>
    </>
  );
}
