import React, { useEffect } from "react";
import type { Product } from "./ProductCard";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const PlaceholderIcon = () => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-4 select-none bg-gradient-to-br from-[#E2E8CE]/40 to-[#E2E8CE]/10 rounded-2xl min-h-[300px]">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-20 h-20 text-[#FF8C00]/40"
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
    <span className="text-sm font-medium text-[#FF8C00]/50 tracking-widest uppercase">
      Resim Yok
    </span>
  </div>
);

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const inStock = product.stock > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      {/* Background overlay click handler */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Content */}
      <div
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row transform transition-all animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-gray-50 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-[#E2E8CE]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full max-h-[40vh] md:max-h-[60vh] object-contain drop-shadow-md"
            />
          ) : (
            <PlaceholderIcon />
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
          {/* Header Info */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {product.category && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-lg border border-gray-200">
                  {product.category}
                </span>
              )}
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-lg border ${
                  inStock
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    inStock ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                {inStock ? "Stokta Var" : "Stokta Yok"}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h2>
          </div>

          {/* Price */}
          <div className="mb-8 p-5 bg-gradient-to-br from-[#FF8C00]/10 to-transparent border border-[#FF8C00]/20 rounded-2xl">
            <p className="text-sm font-semibold text-[#FF8C00] tracking-widest mb-1">
              FİYAT
            </p>
            <p className="text-3xl md:text-4xl font-black text-gray-900">
              {product.price.toLocaleString("tr-TR", {
                style: "currency",
                currency: "TRY",
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Description */}
          <div className="flex-grow mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#FF8C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ürün Açıklaması
            </h3>
            <div className="prose prose-sm md:prose-base text-gray-600">
              <p className="whitespace-pre-wrap leading-relaxed">
                {product.description || "Bu ürün için henüz bir açıklama girilmemiş."}
              </p>
            </div>
          </div>

          {/* Action Area (Optional, for future use like Add to Cart) */}
          <div className="mt-auto pt-6 border-t border-[#E2E8CE] flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
