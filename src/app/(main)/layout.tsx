import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Menu from "./components/home/Menu";
import { CartProvider } from "./contexts/CartContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <Header/>
      <main className="max-w-7xl mx-auto">
        <Menu></Menu>
        {children}
      </main>
      <Footer/>
    </CartProvider>
  );
}