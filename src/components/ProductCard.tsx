import { useState } from "react";

export type Product = {
  id: number;
  name: string;
  description: string;
  stock: number;
  price: number;
  image_url?: string | null;
  category?: string;
};

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

/* Resim yoksa gösterilecek placeholder icon */
const PlaceholderIcon = () => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-2 select-none">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-14 h-14 text-[#FF8C00]/40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <circle cx="12" cy="10" r="3" />
    </svg>
    <span className="text-xs font-medium text-[#FF8C00]/50 tracking-wide uppercase">
      Resim Yok
    </span>
  </div>
);

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const inStock = product.stock > 0;
  const [imgError, setImgError] = useState(false);
  const hasImage = !!product.image_url && !imgError;

  return (
    <div 
      className={`bg-white rounded-2xl border border-[#E2E8CE] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Resim alanı */}
      <div className="relative h-[350px] bg-gradient-to-br from-[#E2E8CE]/40 to-[#E2E8CE]/10 overflow-hidden">
        {hasImage ? (
          <img
            src={product.image_url!}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <PlaceholderIcon />
        )}

        {/* Stok bandı — resim üzerine overlay */}
        <span
          className={`absolute top-3 right-3 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full shadow-sm border backdrop-blur-sm ${
            inStock
              ? "bg-green-50/90 text-green-700 border-green-200"
              : "bg-red-50/90 text-red-600 border-red-200"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              inStock ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {inStock ? "Stokta" : "Stok Yok"}
        </span>
      </div>

      {/* İçerik */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Kategori Bandı */}
        {product.category && (
          <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md mb-3 w-fit">
            {product.category}
          </span>
        )}

        {/* Ürün adı */}
        <h2 className="text-base font-bold text-gray-800 mb-1.5 group-hover:text-[#FF8C00] transition-colors duration-200 line-clamp-1">
          {product.name}
        </h2>

        {/* Açıklama */}
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Fiyat + ayırıcı */}
        <div className="mt-4 pt-4 border-t border-[#E2E8CE] flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Fiyat
          </span>
          <span className="text-xl font-extrabold text-[#FF8C00]">
            {product.price.toLocaleString("tr-TR", {
              style: "currency",
              currency: "TRY",
              minimumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
