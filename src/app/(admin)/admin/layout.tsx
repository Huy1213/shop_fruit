import { CartProvider } from "@/app/(main)/contexts/CartContext";
export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}