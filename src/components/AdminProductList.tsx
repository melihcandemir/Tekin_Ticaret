import type { Product } from "./ProductCard";

interface AdminProductListProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onStockChange: (id: number, newStock: number) => void;
}

const AdminProductList = ({
  products,
  isLoading,
  onEdit,
  onDelete,
  onStockChange,
}: AdminProductListProps) => {
  if (isLoading) {
    return <p className="text-gray-500 text-center py-8">Yükleniyor...</p>;
  }

  if (products.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8 bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E2E8CE]">
        Henüz eklenmiş ürün bulunmuyor.
      </p>
    );
  }

  return (
    <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E2E8CE] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-[#E2E8CE] text-gray-600">
              <th className="py-4 px-4 font-semibold w-16 text-center">Görsel</th>
              <th className="py-4 px-4 font-semibold">Ürün Bilgisi</th>
              <th className="py-4 px-4 font-semibold text-center">Kategori</th>
              <th className="py-4 px-4 font-semibold text-center">Stok</th>
              <th className="py-4 px-4 font-semibold text-right">Fiyat</th>
              <th className="py-4 px-4 font-semibold text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8CE]/50">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-[#E2E8CE]/10 transition-colors"
              >
                <td className="py-4 px-4 text-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-xl mx-auto shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FF8C00' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' opacity='0.4'%3E%3Crect x='2' y='3' width='20' height='14' rx='2'/%3E%3Cpath d='M8 21h8M12 17v4'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mx-auto text-gray-400 border border-gray-100 shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 min-w-[220px]">
                  <div className="flex flex-col gap-1">
                    <div className="font-bold text-gray-800 text-base">{product.name}</div>
                    <div className="text-sm text-gray-500 line-clamp-2 max-w-sm leading-snug">
                      {product.description}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex px-3 py-1 bg-white text-gray-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-[#E2E8CE] shadow-sm">
                    {product.category || "Diğer"}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => onStockChange(product.id, product.stock > 0 ? 0 : 1)}
                    className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                      product.stock > 0
                        ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                        : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                    }`}
                  >
                    {product.stock > 0 ? "Stokta Var" : "Stokta Yok"}
                  </button>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="font-black text-[#FF8C00] text-lg bg-[#FF8C00]/10 px-3 py-1 rounded-lg">
                    {product.price.toLocaleString("tr-TR", {
                      style: "currency",
                      currency: "TRY",
                    })}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors border border-blue-100 flex items-center justify-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      <span className="hidden lg:inline">Düzenle</span>
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors border border-red-100 flex items-center justify-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      <span className="hidden lg:inline">Sil</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductList;
