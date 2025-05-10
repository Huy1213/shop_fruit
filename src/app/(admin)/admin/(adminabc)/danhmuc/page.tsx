'use client';
import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';

interface DanhMuc {
  MaDM: number;
  TenDM: string;
  HinhAnh: string | null;
}

export default function QuanLyDanhMuc() {
  // State
  const [danhMucList, setDanhMucList] = useState<DanhMuc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<{[key: number]: boolean}>({});
  
  // State cho form thêm/sửa danh mục
  const [formData, setFormData] = useState<Partial<DanhMuc>>({
    MaDM: '',
    TenDM: '',
    HinhAnh: ''
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
        const response = await fetch('/admin/api/danhmuc');
        if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu danh mục');
        const data = await response.json();
        setDanhMucList(data);
        setError(null);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        setError('Không thể tải dữ liệu danh mục');
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý submit form thêm/sửa danh mục
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage({ type: null, text: '' });

    try {
      // Kiểm tra dữ liệu
      if (!formData.TenDM) {
        setFormMessage({
          type: 'error',
          text: 'Vui lòng nhập tên danh mục'
        });
        setIsSubmitting(false);
        return;
      }

      if (editMode) {
        // Cập nhật danh mục
        const response = await fetch(`/admin/api/danhmuc/${formData.MaDM}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Lỗi khi cập nhật danh mục');
        }

        setFormMessage({
          type: 'success',
          text: 'Cập nhật danh mục thành công!'
        });
      } else {
        // Thêm danh mục mới
        const response = await fetch('/admin/api/danhmuc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Lỗi khi thêm danh mục');
        }

        setFormMessage({
          type: 'success',
          text: 'Thêm danh mục thành công!'
        });
      }

      // Reset form
      resetForm();

      // Refresh danh sách danh mục
      const response = await fetch('/admin/api/danhmuc');
      if (response.ok) {
        const data = await response.json();
        setDanhMucList(data);
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

  // Xử lý chỉnh sửa danh mục
  const handleEdit = (danhMuc: DanhMuc) => {
    setFormData({
      MaDM: danhMuc.MaDM,
      TenDM: danhMuc.TenDM,
      HinhAnh: danhMuc.HinhAnh || ''
    });
    setEditMode(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý xóa danh mục
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      return;
    }

    try {
      const response = await fetch(`/admin/api/danhmuc/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400 && data.productCount) {
          throw new Error(`Không thể xóa danh mục này vì có ${data.productCount} sản phẩm liên quan`);
        } else {
          throw new Error(data.error || 'Lỗi khi xóa danh mục');
        }
      }

      setFormMessage({
        type: 'success',
        text: 'Xóa danh mục thành công!'
      });

      // Refresh danh sách danh mục
      const refreshResponse = await fetch('/admin/api/danhmuc');
      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        setDanhMucList(refreshData);
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
      MaDM: '',
      TenDM: '',
      HinhAnh: ''
    });
    setEditMode(false);
  };

  if (isLoading && danhMucList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error && danhMucList.length === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Quản Lý Danh Mục</h1>
      
      {/* Form thêm/sửa danh mục */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-medium mb-4">
          {editMode ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="MaDM" className="block text-sm font-medium text-gray-700 mb-1">
                Mã Danh Mục
              </label>
              <input
                type="text"
                id="MaDM"
                name="MaDM"
                value={formData.MaDM}
                onChange={handleInputChange}
                placeholder="Nhập mã danh mục (để trống nếu tự động)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={editMode}
              />
              {!editMode && <p className="text-xs text-gray-500 mt-1">Bỏ trống nếu muốn tự động tạo mã</p>}
            </div>
            
            <div>
              <label htmlFor="TenDM" className="block text-sm font-medium text-gray-700 mb-1">
                Tên Danh Mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="TenDM"
                name="TenDM"
                value={formData.TenDM}
                onChange={handleInputChange}
                placeholder="Nhập tên danh mục"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="HinhAnh" className="block text-sm font-medium text-gray-700 mb-1">
                Đường Dẫn Hình Ảnh
              </label>
              <input
                type="text"
                id="HinhAnh"
                name="HinhAnh"
                value={formData.HinhAnh || ''}
                onChange={handleInputChange}
                placeholder="Nhập đường dẫn hình ảnh (URL)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
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
      
      {/* Bảng hiển thị danh sách danh mục */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã DM
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên danh mục
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {danhMucList.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                  Không có dữ liệu danh mục
                </td>
              </tr>
            ) : (
              danhMucList.map((danhMuc) => {
                const hasImageError = imgErrors[danhMuc.MaDM] || !danhMuc.HinhAnh;
                
                return (
                  <tr key={danhMuc.MaDM}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {danhMuc.MaDM}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {hasImageError ? (
                        <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded-sm">
                          <span className="text-xs text-gray-500">Không có ảnh</span>
                        </div>
                      ) : (
                        <img
                          src={danhMuc.HinhAnh || ''}
                          alt={`DM ${danhMuc.MaDM}`}
                          className="h-12 w-12 object-cover rounded-sm"
                          onError={() => handleImageError(danhMuc.MaDM)}
                          width={48}
                          height={48}
                        />
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {danhMuc.TenDM}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(danhMuc)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(danhMuc.MaDM)}
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