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
              <th className="py-4 px-4 font-semibold">Ürün Adı</th>
              <th className="py-4 px-4 font-semibold text-center">Stok</th>
              <th className="py-4 px-4 font-semibold text-right">Fiyat</th>
              <th className="py-4 px-4 font-semibold text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-[#E2E8CE]/50 hover:bg-[#E2E8CE]/20 transition-colors"
              >
                <td className="py-3 px-4 text-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg mx-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FF8C00' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' opacity='0.4'%3E%3Crect x='2' y='3' width='20' height='14' rx='2'/%3E%3Cpath d='M8 21h8M12 17v4'/%3E%3Ccircle cx='12' cy='10' r='3'/%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#E2E8CE]/40 rounded-lg flex items-center justify-center mx-auto text-[#FF8C00]/40">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-col gap-1">
                    <div className="font-bold text-gray-800 line-clamp-1">{product.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {product.category || "Diğer"}
                      </span>
                      <span className="text-sm text-gray-500 line-clamp-1">{product.description}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onStockChange(product.id, product.stock > 0 ? 0 : 1)}
                    className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      product.stock > 0
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {product.stock > 0 ? "Stokta Var" : "Stokta Yok"}
                  </button>
                </td>
                <td className="py-3 px-4 text-right font-black text-[#FF8C00]">
                  {product.price.toLocaleString("tr-TR", {
                    style: "currency",
                    currency: "TRY",
                  })}
                </td>
                <td className="py-3 px-4 text-center space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="px-3 py-1.5 bg-[#E2E8CE] text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors inline-block"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors inline-block"
                  >
                    Sil
                  </button>
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
