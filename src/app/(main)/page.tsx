import Carousel from "./components/home/Carousel";
import Product from "./components/home/Product";
import Partner from "./components/home/Partner";

export default function Home() {
  return (
    <>
      <Carousel/>
      <Product id = "trai-cay-viet-nam"></Product>
      <Product id = "trai-cay-nhap-khau"></Product>
      <Product id = "mam-ngu-qua"></Product>
      <Product id = "qua-tang-trai-cay"></Product>
      <Product id = "hop-qua-nguyet-cat"></Product>
      <Partner/>
    </>
  );
}
