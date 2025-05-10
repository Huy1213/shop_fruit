'use client';

import { useState } from 'react';

// Định nghĩa kiểu dữ liệu danh mục
interface DanhMuc {
  MaDM: number;
  TenDM: string;
  HinhAnh: string;
}

export default function DanhMucPage() {
  // State cho danh sách danh mục
  const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([
    { MaDM: 1, TenDM: 'Trái cây nội địa', HinhAnh: '/images/categories/traicaynoida.jpg' },
    { MaDM: 2, TenDM: 'Trái cây nhập khẩu', HinhAnh: '/images/categories/traicaynhapkhau.jpg' },
    { MaDM: 3, TenDM: 'Quà tặng trái cây', HinhAnh: '/images/categories/quatangtraicay.jpg' },
  ]);

  // State cho form thêm/sửa danh mục
  const [formData, setFormData] = useState<Partial<DanhMuc>>({
    TenDM: '',
    HinhAnh: '',
  });

  // State kiểm soát form hiển thị (thêm mới/sửa)
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Xử lý thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && editingId) {
      // Cập nhật danh mục đã tồn tại
      setDanhMucs(
        danhMucs.map(item => 
          item.MaDM === editingId ? { ...item, ...formData as DanhMuc } : item
        )
      );
    } else {
      // Tạo danh mục mới
      const newId = Math.max(0, ...danhMucs.map(item => item.MaDM)) + 1;
      setDanhMucs([...danhMucs, { MaDM: newId, ...formData as DanhMuc }]);
    }
    
    // Reset form
    resetForm();
  };

  // Xử lý chỉnh sửa danh mục
  const handleEdit = (danhMuc: DanhMuc) => {
    setFormData({ TenDM: danhMuc.TenDM, HinhAnh: danhMuc.HinhAnh });
    setIsEditing(true);
    setEditingId(danhMuc.MaDM);
  };

  // Xử lý xóa danh mục
  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      setDanhMucs(danhMucs.filter(item => item.MaDM !== id));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({ TenDM: '', HinhAnh: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Quản lý Danh Mục</h1>
      </div>
      
      {/* Form thêm/sửa danh mục */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-medium mb-4">
          {isEditing ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="TenDM" className="block text-sm font-medium text-gray-700 mb-1">
                Tên Danh Mục
              </label>
              <input
                type="text"
                id="TenDM"
                name="TenDM"
                value={formData.TenDM}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label htmlFor="HinhAnh" className="block text-sm font-medium text-gray-700 mb-1">
                Đường dẫn Hình ảnh
              </label>
              <input
                type="text"
                id="HinhAnh"
                name="HinhAnh"
                value={formData.HinhAnh}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {isEditing ? 'Cập nhật' : 'Thêm mới'}
            </button>
            
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>
      
      {/* Danh sách danh mục */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã DM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên Danh Mục
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hình ảnh
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {danhMucs.map((danhMuc) => (
              <tr key={danhMuc.MaDM}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {danhMuc.MaDM}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {danhMuc.TenDM}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <img
                      src={danhMuc.HinhAnh}
                      alt={danhMuc.TenDM}
                      className="h-10 w-10 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/40';
                      }}
                    />
                    <span className="ml-2 truncate max-w-xs">{danhMuc.HinhAnh}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}