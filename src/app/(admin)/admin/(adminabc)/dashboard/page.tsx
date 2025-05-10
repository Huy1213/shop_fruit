'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string | null;
}

interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: DonHang[];
  orderStatusStats: { TrangThai: string; count: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
  topProducts: { MaSP: number; TenSP: string; totalSold: number }[];
}

interface DonHang {
  MaDH: number;
  HoTenKH: string;
  DiaChi: string;
  Email: string | null;
  SDT: string;
  NgayDat: string;
  TongTien: number;
  TrangThai: string;
  PhuongThucThanhToan: string;
  GhiChu: string | null;
}

export default function AdminDashboard() {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [dataLoading, setDataLoading] = useState(true);
    const router = useRouter();
    
    useEffect(() => {
        // Kiểm tra xem người dùng đã đăng nhập chưa
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
        // Nếu không có token, chuyển hướng về trang đăng nhập
        router.push('/admin/login');
        return;
        }
        
        // Lấy thông tin user từ token (giải mã JWT client-side)
        try {
        // Thông thường không nên giải mã JWT client-side
        // Thay vào đó, nên gọi API để xác thực token
        // Nhưng để đơn giản, ta tạm thời lấy dữ liệu từ localStorage
        const userData = localStorage.getItem('adminUserData');
        
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            // Tạo API endpoint để xác thực token và lấy thông tin user
            const fetchUserInfo = async () => {
            try {
                const response = await fetch('/api/admin/verify-token', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
                });
                
                if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                localStorage.setItem('adminUserData', JSON.stringify(data.user));
                } else {
                // Token không hợp lệ
                localStorage.removeItem('adminToken');
                router.push('/admin/login');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
            } finally {
                setLoading(false);
            }
            };
            
            fetchUserInfo();
        }
        } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUserData');
        router.push('/admin/login');
        } finally {
        setLoading(false);
        }
    }, [router]);
    
    // Lấy dữ liệu dashboard
    useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          setDataLoading(true);
          const response = await fetch('/admin/api/dashboard');
          
          if (!response.ok) {
            throw new Error('Lỗi khi lấy dữ liệu dashboard');
          }
          
          const data = await response.json();
          setDashboardData(data);
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu dashboard:', error);
        } finally {
          setDataLoading(false);
        }
      };
      
      if (!loading && user) {
        fetchDashboardData();
      }
    }, [loading, user]);
    
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUserData');
        router.push('/admin/login');
    };
    
    // Format tiền tệ
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
    
    // Format thời gian
    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy HH:mm', { locale: vi });
      } catch (error) {
        return dateString;
      }
    };
    
    // Màu sắc cho trạng thái đơn hàng
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'Chờ xác nhận':
          return 'bg-yellow-100 text-yellow-800';
        case 'Đã xác nhận':
          return 'bg-blue-100 text-blue-800';
        case 'Đang giao hàng':
          return 'bg-indigo-100 text-indigo-800';
        case 'Đã giao hàng':
          return 'bg-green-100 text-green-800';
        case 'Đã hủy':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
    
    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-700">Đang tải...</p>
            </div>
        </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
                <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="ml-2 text-2xl font-bold text-green-600">ShopFruit Admin</span>
                </div>
                </div>
                <div className="flex items-center">
                <div className="ml-4 flex items-center md:ml-6">
                    <div className="ml-3 relative">
                    <div className="flex items-center">
                        <div>
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                            <span className="text-sm font-medium leading-none text-green-700">
                            {user?.name.charAt(0)}
                            </span>
                        </span>
                        </div>
                        <div className="ml-3">
                        <div className="text-base font-medium leading-none text-gray-800">{user?.name}</div>
                        <div className="text-sm font-medium leading-none text-gray-500 mt-1">{user?.username}</div>
                        </div>
                        <button 
                        onClick={handleLogout}
                        className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                        Đăng xuất
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </nav>
        
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
            {dataLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <p className="mt-4 text-gray-700">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : (
              <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Thống kê */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng đơn hàng</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{dashboardData?.totalOrders || 0}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <a href="/admin/donhang" className="font-medium text-green-600 hover:text-green-500">Xem tất cả</a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Tổng doanh thu</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {formatCurrency(dashboardData?.totalRevenue || 0)}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <a href="#" className="font-medium text-green-600 hover:text-green-500">Xem báo cáo</a>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Sản phẩm</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{dashboardData?.totalProducts || 0}</dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <a href="/admin/sanpham" className="font-medium text-green-600 hover:text-green-500">Quản lý sản phẩm</a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Thống kê theo trạng thái */}
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Trạng thái đơn hàng</h3>
                    <div className="space-y-2">
                      {dashboardData?.orderStatusStats?.map((stat) => (
                        <div key={stat.TrangThai} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(stat.TrangThai)}`}>
                              {stat.TrangThai}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{stat.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top 5 sản phẩm bán chạy</h3>
                    <div className="space-y-2">
                      {dashboardData?.topProducts?.map((product) => (
                        <div key={product.MaSP} className="flex items-center justify-between">
                          <div className="text-sm text-gray-900 truncate max-w-[70%]">
                            {product.TenSP}
                          </div>
                          <div className="text-sm font-medium text-gray-900">{product.totalSold} sản phẩm</div>
                        </div>
                      ))}
                      {(!dashboardData?.topProducts || dashboardData.topProducts.length === 0) && (
                        <div className="text-sm text-gray-500">Chưa có dữ liệu sản phẩm bán chạy</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Đơn hàng gần đây */}
              <div className="mt-8">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Đơn hàng gần đây</h2>
                <div className="mt-2 flex flex-col">
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Chi tiết</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 ? (
                              dashboardData.recentOrders.map((order) => (
                                <tr key={order.MaDH}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{order.MaDH}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{order.HoTenKH}</div>
                                    <div className="text-sm text-gray-500">{order.SDT}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(order.NgayDat)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.TrangThai)}`}>
                                      {order.TrangThai}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatCurrency(order.TongTien)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href={`/admin/donhang?id=${order.MaDH}`} className="text-green-600 hover:text-green-900">
                                      Chi tiết
                                    </a>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                  Không có đơn hàng nào.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </>
            )}
            </div>
        </main>
        </div>
    );
}