'use client';
import { useState, useEffect, FormEvent } from 'react';

interface HinhAnh {
  MaHinh: number;
  TenHinh: string;
}

export default function HinhAnh() {
  // State
  const [hinhAnhList, setHinhAnhList] = useState<HinhAnh[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<{[key: number]: boolean}>({});
  
  // State cho form thêm/sửa hình ảnh
  const [formData, setFormData] = useState({
    MaHinh: '',
    TenHinh: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });
  const [editMode, setEditMode] = useState(false);

  // Fetch danh sách hình ảnh
  const fetchHinhAnh = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/admin/api/hinhanh');
      
      if (!response.ok) {
        throw new Error('Lỗi khi lấy dữ liệu');
      }
      
      const data = await response.json();
      setHinhAnhList(data);
      setError(null);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách hình ảnh:', error);
      setError('Không thể tải danh sách hình ảnh');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHinhAnh();
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

  // Xử lý submit form thêm/sửa hình ảnh
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage({ type: null, text: '' });

    try {
      // Kiểm tra dữ liệu
      if (!formData.TenHinh) {
        setFormMessage({
          type: 'error',
          text: 'Vui lòng nhập đường dẫn hình ảnh'
        });
        setIsSubmitting(false);
        return;
      }

      if (editMode) {
        // Cập nhật hình ảnh
        const response = await fetch(`/admin/api/hinhanh/${formData.MaHinh}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ TenHinh: formData.TenHinh }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Lỗi khi cập nhật hình ảnh');
        }

        setFormMessage({
          type: 'success',
          text: 'Cập nhật hình ảnh thành công!'
        });
      } else {
        // Thêm hình ảnh mới
        const response = await fetch('/admin/api/hinhanh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Lỗi khi thêm hình ảnh');
        }

        setFormMessage({
          type: 'success',
          text: 'Thêm hình ảnh thành công!'
        });
      }

      // Reset form
      resetForm();

      // Refresh danh sách hình ảnh
      fetchHinhAnh();
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

  // Xử lý chỉnh sửa hình ảnh
  const handleEdit = (hinhAnh: HinhAnh) => {
    setFormData({
      MaHinh: hinhAnh.MaHinh.toString(),
      TenHinh: hinhAnh.TenHinh
    });
    setEditMode(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý xóa hình ảnh
  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
      return;
    }

    try {
      const response = await fetch(`/admin/api/hinhanh/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Lỗi khi xóa hình ảnh');
      }

      setFormMessage({
        type: 'success',
        text: 'Xóa hình ảnh thành công!'
      });

      // Refresh danh sách hình ảnh
      fetchHinhAnh();
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
      MaHinh: '',
      TenHinh: ''
    });
    setEditMode(false);
  };

  if (isLoading && hinhAnhList.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error && hinhAnhList.length === 0) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Quản Lý Hình Ảnh</h1>
      
      {/* Form thêm/sửa hình ảnh */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-medium mb-4">
          {editMode ? 'Chỉnh Sửa Hình Ảnh' : 'Thêm Hình Ảnh Mới'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="MaHinh" className="block text-sm font-medium text-gray-700 mb-1">
                Mã Hình
              </label>
              <input
                type="text"
                id="MaHinh"
                name="MaHinh"
                value={formData.MaHinh}
                onChange={handleInputChange}
                placeholder="Nhập mã hình (để trống nếu auto-increment)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={editMode}
              />
              {!editMode && <p className="text-xs text-gray-500 mt-1">Bỏ trống nếu muốn tự động tạo mã</p>}
            </div>
            
            <div>
              <label htmlFor="TenHinh" className="block text-sm font-medium text-gray-700 mb-1">
                Đường Dẫn Hình Ảnh
              </label>
              <input
                type="text"
                id="TenHinh"
                name="TenHinh"
                value={formData.TenHinh}
                onChange={handleInputChange}
                placeholder="Nhập đường dẫn hình ảnh"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
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
      
      {/* Bảng hiển thị danh sách hình ảnh */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã Hình
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đường dẫn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hinhAnhList.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không có dữ liệu hình ảnh
                </td>
              </tr>
            ) : (
              hinhAnhList.map((hinhAnh) => (
                <tr key={hinhAnh.MaHinh}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {hinhAnh.MaHinh}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {imgErrors[hinhAnh.MaHinh] ? (
                      <div className="h-12 w-12 bg-gray-200 flex items-center justify-center rounded-sm">
                        <span className="text-xs text-gray-500">Lỗi ảnh</span>
                      </div>
                    ) : (
                      // Thay thế bằng thẻ img để tránh lỗi URL
                      <img
                        src={hinhAnh.TenHinh}
                        alt={`Hình ${hinhAnh.MaHinh}`}
                        className="h-12 w-12 object-cover rounded-sm"
                        onError={() => handleImageError(hinhAnh.MaHinh)}
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-md truncate">
                    {hinhAnh.TenHinh}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEdit(hinhAnh)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(hinhAnh.MaHinh)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}