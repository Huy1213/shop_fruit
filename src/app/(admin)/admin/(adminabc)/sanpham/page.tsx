'use client';
import { useState, useEffect, FormEvent } from 'react';

interface SanPham {
  MaSP: number;
  MaDM: number;
  MaHinh: number;
  TenSP: string;
  SoLuong: number;
  GiaBan: number;
  GiaGiam: number;
  MoTa: string;
  TenDM?: string;
  TenHinh?: string;
}

interface DanhMuc {
  MaDM: number;
  TenDM: string;
}

interface HinhAnh {
  MaHinh: number;
  TenHinh: string;
}

export default function SanPham() {
  // State
  const [sanPhamList, setSanPhamList] = useState<SanPham[]>([]);
  const [danhMucList, setDanhMucList] = useState<DanhMuc[]>([]);
  const [hinhAnhList, setHinhAnhList] = useState<HinhAnh[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<{[key: number]: boolean}>({});
  
  // State cho form thêm/sửa sản phẩm
  const [formData, setFormData] = useState<Partial<SanPham>>({
    MaSP: '',
    MaDM: '',
    MaHinh: '',
    TenSP: '',
    SoLuong: 0,
    GiaBan: 0,
    GiaGiam: 0,
    MoTa: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });
  const [editMode, setEditMode] = useState(false);

  // Fetch dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch danh sách sản phẩm
        const spResponse = await fetch('/admin/api/sanpham');
        if (!spResponse.ok) throw new Error('Lỗi khi lấy dữ liệu sản phẩm');
        const spData = await spResponse.json();
        setSanPhamList(spData);
        
        // Fetch danh sách danh mục
        const dmResponse = await fetch('/admin/api/danhmuc');
        if (!dmResponse.ok) throw new Error('Lỗi khi lấy dữ liệu danh mục');
        const dmData = await dmResponse.json();
        setDanhMucList(dmData);
        
        // Fetch danh sách hình ảnh
        const haResponse = await fetch('/admin/api/hinhanh');
        if (!haResponse.ok) throw new Error('Lỗi khi lấy dữ liệu hình ảnh');
        const haData = await haResponse.json();
        setHinhAnhList(haData);
        
        setError(null);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setError('Không thể tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Xử lý lỗi hình ảnh
  const handleImageError = (id: number) => {
    setImgErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Xử lý thay đổi trong form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Chuyển đổi giá trị cho các trường số
    if (['SoLuong', 'GiaBan', 'GiaGiam'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Xử lý submit form thêm/sửa sản phẩm
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage({ type: null, text: '' });

    try {
      // Kiểm tra dữ liệu
      if (!formData.TenSP || !formData.MaDM) {
        setFormMessage({
          type: 'error',
          text: 'Vui lòng nhập tên sản phẩm và chọn danh mục'
        });
        setIsSubmitting(false);
        return;
      }

      if (editMode) {
        // Cập nhật sản phẩm
        const response = await fetch(`/admin/api/sanpham/${formData.MaSP}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Lỗi khi cập nhật sản phẩm');
        }

        setFormMessage({
          type: 'success',
          text: 'Cập nhật sản phẩm thành công!'
        });
      } else {
        // Thêm sản phẩm mới
        const response = await fetch('/admin/api/sanpham', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Lỗi khi thêm sản phẩm');
        }

        setFormMessage({
          type: 'success',
          text: 'Thêm sản phẩm thành công!'
        });
      }

      // Reset form
      resetForm();

      // Refresh danh sách sản phẩm
      const spResponse = await fetch('/admin/api/sanpham');
      if (spResponse.ok) {
        const spData = await spResponse.json();
        setSanPhamList(spData);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      setFormMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Có lỗi xảy ra'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý chỉnh sửa sản phẩm
  const handleEdit = (sanPham: SanPham) => {
    setFormData({
      MaSP: sanPham.MaSP,
      MaDM: sanPham.MaDM,
      MaHinh: sanPham.MaHinh,
      TenSP: sanPham.TenSP,
      SoLuong: sanPham.SoLuong,
      GiaBan: sanPham.GiaBan,
      GiaGiam: sanPham.GiaGiam,
      MoTa: sanPham.MoTa || ''
    });
    setEditMode(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý xóa sản phẩm
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      return;
    }

    try {
      const response = await fetch(`/admin/api/sanpham/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi xóa sản phẩm');
      }

      setFormMessage({
        type: 'success',
        text: 'Xóa sản phẩm thành công!'
      });

      // Refresh danh sách sản phẩm
      const spResponse = await fetch('/admin/api/sanpham');
      if (spResponse.ok) {
        const spData = await spResponse.json();
        setSanPhamList(spData);
      }
    } catch (error) {
      console.error('Lỗi:', error);
      setFormMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Có lỗi xảy ra khi xóa'
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      MaSP: '',
      MaDM: '',
      MaHinh: '',
      TenSP: '',
      SoLuong: 0,
      GiaBan: 0,
      GiaGiam: 0,
      MoTa: ''
    });
    setEditMode(false);
  };

  // Format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (isLoading && sanPhamList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error && sanPhamList.length === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Quản Lý Sản Phẩm</h1>
      
      {/* Form thêm/sửa sản phẩm */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-medium mb-4">
          {editMode ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="MaSP" className="block text-sm font-medium text-gray-700 mb-1">
                Mã Sản Phẩm
              </label>
              <input
                type="text"
                id="MaSP"
                name="MaSP"
                value={formData.MaSP}
                onChange={handleInputChange}
                placeholder="Nhập mã sản phẩm (để trống nếu tự động)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={editMode}
              />
              {!editMode && <p className="text-xs text-gray-500 mt-1">Bỏ trống nếu muốn tự động tạo mã</p>}
            </div>
            
            <div>
              <label htmlFor="TenSP" className="block text-sm font-medium text-gray-700 mb-1">
                Tên Sản Phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="TenSP"
                name="TenSP"
                value={formData.TenSP}
                onChange={handleInputChange}
                placeholder="Nhập tên sản phẩm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="MaDM" className="block text-sm font-medium text-gray-700 mb-1">
                Danh Mục <span className="text-red-500">*</span>
              </label>
              <select
                id="MaDM"
                name="MaDM"
                value={formData.MaDM}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">-- Chọn Danh Mục --</option>
                {danhMucList.map((dm) => (
                  <option key={dm.MaDM} value={dm.MaDM}>
                    {dm.TenDM}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="MaHinh" className="block text-sm font-medium text-gray-700 mb-1">
                Hình Ảnh
              </label>
              <select
                id="MaHinh"
                name="MaHinh"
                value={formData.MaHinh}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Chọn Hình Ảnh --</option>
                {hinhAnhList.map((ha) => (
                  <option key={ha.MaHinh} value={ha.MaHinh}>
                    {ha.MaHinh} - {ha.TenHinh.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="SoLuong" className="block text-sm font-medium text-gray-700 mb-1">
                Số Lượng
              </label>
              <input
                type="number"
                id="SoLuong"
                name="SoLuong"
                value={formData.SoLuong}
                onChange={handleInputChange}
                placeholder="Nhập số lượng"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>
            
            <div>
              <label htmlFor="GiaBan" className="block text-sm font-medium text-gray-700 mb-1">
                Giá Bán
              </label>
              <input
                type="number"
                id="GiaBan"
                name="GiaBan"
                value={formData.GiaBan}
                onChange={handleInputChange}
                placeholder="Nhập giá bán"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>
            
            <div>
              <label htmlFor="GiaGiam" className="block text-sm font-medium text-gray-700 mb-1">
                Giá Giảm
              </label>
              <input
                type="number"
                id="GiaGiam"
                name="GiaGiam"
                value={formData.GiaGiam}
                onChange={handleInputChange}
                placeholder="Nhập giá giảm (nếu có)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="MoTa" className="block text-sm font-medium text-gray-700 mb-1">
              Mô Tả
            </label>
            <textarea
              id="MoTa"
              name="MoTa"
              value={formData.MoTa}
              onChange={handleInputChange}
              placeholder="Nhập mô tả sản phẩm"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
            ></textarea>
          </div>
          
          {formMessage.type && (
            <div className={`p-3 rounded mb-4 ${
              formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {formMessage.text}
            </div>
          )}
          
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting 
                ? (editMode ? 'Đang cập nhật...' : 'Đang thêm...') 
                : (editMode ? 'Cập Nhật' : 'Thêm Mới')}
            </button>
            
            {editMode && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Bảng hiển thị danh sách sản phẩm */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã SP
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên sản phẩm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Danh mục
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá bán
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giá giảm
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sanPhamList.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                  Không có dữ liệu sản phẩm
                </td>
              </tr>
            ) : (
              sanPhamList.map((sanPham) => {
                // Tìm hình ảnh tương ứng
                const hinhAnh = hinhAnhList.find(ha => ha.MaHinh === sanPham.MaHinh);
                const hinhAnhUrl = hinhAnh?.TenHinh || '';
                const hasImageError = imgErrors[sanPham.MaSP] || !hinhAnhUrl;
                
                return (
                  <tr key={sanPham.MaSP}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sanPham.MaSP}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {hasImageError ? (
                        <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded-sm">
                          <span className="text-xs text-gray-500">Không có ảnh</span>
                        </div>
                      ) : (
                        <img
                          src={hinhAnhUrl}
                          alt={`SP ${sanPham.MaSP}`}
                          className="h-12 w-12 object-cover rounded-sm"
                          onError={() => handleImageError(sanPham.MaSP)}
                        />
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sanPham.TenSP}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sanPham.TenDM || '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sanPham.SoLuong}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(sanPham.GiaBan)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sanPham.GiaGiam > 0 ? formatCurrency(sanPham.GiaGiam) : '-'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(sanPham)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(sanPham.MaSP)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}