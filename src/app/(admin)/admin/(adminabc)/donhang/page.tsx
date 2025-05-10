'use client';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

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

interface ChiTietDonHang {
  MaDH: number;
  MaSP: number;
  SoLuong: number;
  TenSP?: string;
  GiaBan?: number;
  GiaGiam?: number;
}

export default function QuanLyDonHang() {
  // State
  const [donHangList, setDonHangList] = useState<DonHang[]>([]);
  const [selectedDonHang, setSelectedDonHang] = useState<DonHang | null>(null);
  const [chiTietDonHang, setChiTietDonHang] = useState<ChiTietDonHang[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [ghiChu, setGhiChu] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });

  // Danh sách trạng thái đơn hàng
  const trangThaiList = [
    'Chờ xác nhận',
    'Đã xác nhận',
    'Đang giao hàng',
    'Đã giao hàng',
    'Đã hủy'
  ];

  // Fetch danh sách đơn hàng
  const fetchDonHangList = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/admin/api/donhang');
      
      if (!response.ok) {
        throw new Error('Lỗi khi lấy dữ liệu đơn hàng');
      }
      
      const data = await response.json();
      setDonHangList(data);
      setError(null);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      setError('Không thể tải danh sách đơn hàng');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch chi tiết đơn hàng
  const fetchChiTietDonHang = async (id: number) => {
    try {
      const response = await fetch(`/admin/api/donhang/${id}`);
      
      if (!response.ok) {
        throw new Error('Lỗi khi lấy chi tiết đơn hàng');
      }
      
      const data = await response.json();
      setSelectedDonHang(data.donHang);
      setChiTietDonHang(data.chiTietDonHang);
      setUpdateStatus(data.donHang.TrangThai);
      setGhiChu(data.donHang.GhiChu || '');
      setIsModalOpen(true);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
      setStatusMessage({
        type: 'error',
        text: 'Không thể tải chi tiết đơn hàng'
      });
    }
  };

  // Cập nhật trạng thái đơn hàng
  const updateDonHangStatus = async () => {
    if (!selectedDonHang) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/admin/api/donhang/${selectedDonHang.MaDH}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TrangThai: updateStatus,
          GhiChu: ghiChu
        }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật trạng thái đơn hàng');
      }

      // Cập nhật state
      setDonHangList(prev => 
        prev.map(dh => 
          dh.MaDH === selectedDonHang.MaDH 
            ? { ...dh, TrangThai: updateStatus, GhiChu: ghiChu } 
            : dh
        )
      );
      
      setStatusMessage({
        type: 'success',
        text: 'Cập nhật trạng thái đơn hàng thành công'
      });
      
      setEditingStatus(false);
    } catch (error) {
      console.error('Lỗi:', error);
      setStatusMessage({
        type: 'error',
        text: 'Không thể cập nhật trạng thái đơn hàng'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hủy đơn hàng
  const cancelDonHang = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await fetch(`/admin/api/donhang/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Lỗi khi hủy đơn hàng');
      }

      setStatusMessage({
        type: 'success',
        text: 'Hủy đơn hàng thành công'
      });
      
      // Cập nhật danh sách đơn hàng
      fetchDonHangList();
      
      // Đóng modal nếu đang mở
      if (isModalOpen && selectedDonHang?.MaDH === id) {
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      setStatusMessage({
        type: 'error',
        text: 'Không thể hủy đơn hàng'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load danh sách đơn hàng khi component mount
  useEffect(() => {
    fetchDonHangList();
  }, []);

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

  // Đóng modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDonHang(null);
    setChiTietDonHang([]);
    setEditingStatus(false);
    setStatusMessage({ type: null, text: '' });
  };

  // Xử lý trạng thái loading
  if (isLoading && donHangList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Xử lý trạng thái lỗi
  if (error && donHangList.length === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Quản Lý Đơn Hàng</h1>
      
      {statusMessage.type && (
        <div className={`p-3 rounded mb-4 ${
          statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {statusMessage.text}
        </div>
      )}
      
      {/* Bảng danh sách đơn hàng */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã ĐH
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tổng tiền
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donHangList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                  Không có dữ liệu đơn hàng
                </td>
              </tr>
            ) : (
              donHangList.map((donHang) => (
                <tr key={donHang.MaDH}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{donHang.MaDH}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div>
                      <span className="font-medium">{donHang.HoTenKH}</span>
                    </div>
                    <div className="text-gray-500">{donHang.SDT}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(donHang.NgayDat)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {formatCurrency(donHang.TongTien)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(donHang.TrangThai)}`}>
                      {donHang.TrangThai}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => fetchChiTietDonHang(donHang.MaDH)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Chi tiết
                    </button>
                    {donHang.TrangThai !== 'Đã hủy' && donHang.TrangThai !== 'Đã giao hàng' && (
                      <button
                        onClick={() => cancelDonHang(donHang.MaDH)}
                        className="text-red-600 hover:text-red-900"
                        disabled={isSubmitting}
                      >
                        Hủy
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal Chi tiết đơn hàng */}
      {isModalOpen && selectedDonHang && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Chi tiết đơn hàng #{selectedDonHang.MaDH}</h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Thông tin khách hàng</h3>
                  <p className="text-sm"><span className="font-medium">Họ tên:</span> {selectedDonHang.HoTenKH}</p>
                  <p className="text-sm"><span className="font-medium">SĐT:</span> {selectedDonHang.SDT}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {selectedDonHang.Email || 'Không có'}</p>
                  <p className="text-sm"><span className="font-medium">Địa chỉ:</span> {selectedDonHang.DiaChi}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Thông tin đơn hàng</h3>
                  <p className="text-sm"><span className="font-medium">Ngày đặt:</span> {formatDate(selectedDonHang.NgayDat)}</p>
                  <p className="text-sm"><span className="font-medium">Phương thức thanh toán:</span> {selectedDonHang.PhuongThucThanhToan}</p>
                  <p className="text-sm">
                    <span className="font-medium">Trạng thái:</span>
                    {editingStatus ? (
                      <select
                        value={updateStatus}
                        onChange={(e) => setUpdateStatus(e.target.value)}
                        className="ml-2 border rounded px-2 py-1 text-sm"
                      >
                        {trangThaiList.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedDonHang.TrangThai)}`}>
                        {selectedDonHang.TrangThai}
                      </span>
                    )}
                    {!editingStatus && selectedDonHang.TrangThai !== 'Đã hủy' && selectedDonHang.TrangThai !== 'Đã giao hàng' && (
                      <button
                        onClick={() => setEditingStatus(true)}
                        className="ml-2 text-xs text-blue-600 hover:underline"
                      >
                        Thay đổi
                      </button>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Ghi chú */}
              <div className="mb-4">
                <h3 className="font-medium text-gray-700 mb-2">Ghi chú</h3>
                {editingStatus ? (
                  <textarea
                    value={ghiChu}
                    onChange={(e) => setGhiChu(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                    rows={2}
                  ></textarea>
                ) : (
                  <p className="text-sm text-gray-600">{selectedDonHang.GhiChu || 'Không có ghi chú'}</p>
                )}
              </div>
              
              {/* Danh sách sản phẩm */}
              <h3 className="font-medium text-gray-700 mb-2">Danh sách sản phẩm</h3>
              <div className="border rounded overflow-hidden mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã SP
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên sản phẩm
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Đơn giá
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số lượng
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thành tiền
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {chiTietDonHang.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-2 text-center text-sm text-gray-500">
                          Không có sản phẩm
                        </td>
                      </tr>
                    ) : (
                      chiTietDonHang.map((item) => {
                        const gia = item.GiaGiam && item.GiaGiam > 0 ? item.GiaGiam : item.GiaBan;
                        const thanhTien = gia ? gia * item.SoLuong : 0;
                        
                        return (
                          <tr key={`${item.MaDH}-${item.MaSP}`}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {item.MaSP}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                              {item.TenSP || `Sản phẩm #${item.MaSP}`}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {gia ? formatCurrency(gia) : 'N/A'}
                              {item.GiaGiam && item.GiaGiam > 0 && item.GiaBan && (
                                <span className="ml-1 text-xs line-through text-gray-500">
                                  {formatCurrency(item.GiaBan)}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {item.SoLuong}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(thanhTien)}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                        Tổng thanh toán:
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(selectedDonHang.TongTien)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {/* Nút cập nhật trạng thái */}
              {editingStatus && (
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingStatus(false)}
                    className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={updateDonHangStatus}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}