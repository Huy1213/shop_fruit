import Link from "next/link";
export default function AdminDashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-green-600">Admin Panel</h1>
          </div>
          
          <nav className="py-4">
            <ul>
              <li>
                <Link href="/admin/dashboard" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/danhmuc" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Danh Mục
                </Link>
              </li>
              <li>
                <Link href="/admin/HinhAnh" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Hình ảnh
                </Link>
              </li>
              <li>
                <Link href="/admin/sanpham" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/admin/donhang" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/admin/customers" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Customers
                </Link>
              </li>
              <li>
                <Link href="/admin/settings" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
          
          <div className="p-4 mt-auto border-t">
            <Link href="/logout" className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
              Đăng Xuất
            </Link>
          </div>
        </div>
  
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white shadow">
            <div className="flex justify-between items-center px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-800">ShopFruit Admin</h1>
              <div className="flex items-center">
                <span className="mr-2 text-sm">Đỗ Thanh Huy</span>
                <img 
                  src="https://via.placeholder.com/40" 
                  alt="Admin user" 
                  className="w-8 h-8 rounded-full"
                />
              </div>
            </div>
          </header>
          
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }