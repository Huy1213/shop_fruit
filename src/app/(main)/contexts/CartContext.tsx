'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
    MaSP: number;
    TenSP: string;
    GiaBan: number | string;
    MoTa?: string;
    TenHinh?: string;
    }

    interface CartItem {
    product: Product;
    quantity: number;
    }

    interface CartContextProps {
    cartCount: number;
    cartItems: CartItem[];
    totalPrice: number;
    updateCartCount: (count: number) => void;
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    }

    interface CartProviderProps {
    children: ReactNode;
    }

    const CartContext = createContext<CartContextProps | undefined>(undefined);

    export function CartProvider({ children }: CartProviderProps) {
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // Khởi tạo giỏ hàng từ localStorage (client-side only)
    useEffect(() => {
        // Chỉ thực hiện ở phía client
        if (typeof window !== 'undefined') {
        const storedCart = localStorage.getItem('cart');
        
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            setCartItems(parsedCart);
            
            // Tính toán lại số lượng mặt hàng trong giỏ (không phải tổng số sản phẩm)
            setCartCount(parsedCart.length);
            
            const price = parsedCart.reduce((total: number, item: CartItem) => {
            const itemPrice = typeof item.product.GiaBan === 'string' 
                ? parseInt(item.product.GiaBan.replace(/[^\d]/g, '')) 
                : item.product.GiaBan;
            return total + (itemPrice * item.quantity);
            }, 0);
            setTotalPrice(price);
        }
        }
    }, []);

    // Cập nhật localStorage mỗi khi cartItems thay đổi
    useEffect(() => {
        if (cartItems.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        // Cập nhật tổng tiền mỗi khi cartItems thay đổi
        const price = cartItems.reduce((total, item) => {
            const itemPrice = typeof item.product.GiaBan === 'string' 
            ? parseInt(item.product.GiaBan.replace(/[^\d]/g, '')) 
            : item.product.GiaBan;
            return total + (itemPrice * item.quantity);
        }, 0);
        setTotalPrice(price);
        }
    }, [cartItems]);

    const updateCartCount = (count: number): void => {
        setCartCount(count);
    };

    const addToCart = (product: Product, quantity: number): void => {
        // Chuyển đổi MaSP sang string để so sánh chính xác
        const productId = String(product.MaSP);
        
        setCartItems((prevItems) => {
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = prevItems.findIndex(
            (item) => String(item.product.MaSP) === productId
        );

        let updatedItems;

        if (existingItemIndex >= 0) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            updatedItems = [...prevItems];
            updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity
            };
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm mới
            updatedItems = [...prevItems, { product, quantity }];
            // Tăng số lượng sản phẩm trong giỏ
            setCartCount(updatedItems.length);
        }
        
        return updatedItems;
        });
    };

    const removeFromCart = (productId: number): void => {
        setCartItems((prevItems) => {
        const updatedItems = prevItems.filter(
            (item) => item.product.MaSP !== productId
        );
        
        // Cập nhật số lượng sản phẩm trong giỏ
        setCartCount(updatedItems.length);
        
        // Nếu giỏ hàng trống, xóa khỏi localStorage
        if (updatedItems.length === 0) {
            localStorage.removeItem('cart');
            setTotalPrice(0);
        }
        
        return updatedItems;
        });
    };

    const updateQuantity = (productId: number, quantity: number): void => {
        if (quantity <= 0) {
        removeFromCart(productId);
        return;
        }
        
        setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
            item.product.MaSP === productId
            ? { ...item, quantity }
            : item
        );
        
        return updatedItems;
        });
    };
    
    // Thêm hàm clearCart để xóa toàn bộ giỏ hàng
    const clearCart = (): void => {
        setCartItems([]);
        setCartCount(0);
        setTotalPrice(0);
        localStorage.removeItem('cart');
    };

    return (
        <CartContext.Provider
        value={{
            cartCount,
            cartItems,
            totalPrice,
            updateCartCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}
        >
        {children}
        </CartContext.Provider>
    );
    }

    export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}