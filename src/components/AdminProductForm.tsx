import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Product } from "./ProductCard";

interface AdminProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, "id">) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  categories?: string[];
}

const AdminProductForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  categories = [],
}: AdminProductFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [category, setCategory] = useState(initialData?.category || "");
  const [stock, setStock] = useState(initialData?.stock || 0);
  const [price, setPrice] = useState(initialData?.price || 0);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setCategory(initialData.category || "");
      setStock(initialData.stock);
      setPrice(initialData.price);
      setImageUrl(initialData.image_url || "");
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl || null;

    setUploadingImage(true);
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile);

    setUploadingImage(false);

    if (uploadError) {
      return imageUrl || null;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uploadedUrl = await uploadImage();

    await onSubmit({
      name,
      description,
      category,
      stock: Number(stock),
      price: Number(price),
      image_url: uploadedUrl,
    });
  };

  return (
    <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-sm border border-[#E2E8CE]">
      <h2 className="text-2xl font-bold text-[#FF8C00] mb-6">
        {initialData ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Ürün Adı
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white resize-none"
            />
          </div>

          <div className="md:col-span-2 relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Kategori
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Listeden seçin veya yeni yazın..."
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setIsCategoryDropdownOpen(true);
                }}
                onFocus={() => setIsCategoryDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsCategoryDropdownOpen(false), 200)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white text-gray-700 pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {isCategoryDropdownOpen && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {categories.length > 0 && categories
                  .filter((cat) => cat.toLowerCase().includes(category.toLowerCase()))
                  .map((cat, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 hover:bg-[#FF8C00]/10 cursor-pointer text-gray-700 transition-colors"
                      onClick={() => {
                        setCategory(cat);
                        setIsCategoryDropdownOpen(false);
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                {category && !categories.some(c => c.toLowerCase() === category.toLowerCase()) && (
                  <div className="px-4 py-3 text-sm text-[#FF8C00] font-medium italic bg-[#FF8C00]/5">
                    "{category}" yeni kategori olarak eklenecek
                  </div>
                )}
                {categories.length === 0 && !category && (
                   <div className="px-4 py-3 text-sm text-gray-500 italic">
                     Henüz kategori yok, yazarak ekleyebilirsiniz.
                   </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer pt-6">
              <input
                type="checkbox"
                checked={stock > 0}
                onChange={(e) => setStock(e.target.checked ? 1 : 0)}
                className="w-5 h-5 rounded text-[#FF8C00] focus:ring-[#FF8C00] accent-[#FF8C00]"
              />
              <span className="text-sm font-semibold text-gray-700">
                Ürün Stokta Var
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Fiyat (₺)
            </label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Ürün Görseli (Opsiyonel)
            </label>
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#E2E8CE] file:text-gray-700 hover:file:bg-gray-200 transition-all cursor-pointer"
              />
              <p className="text-xs text-gray-500 font-medium">
                <strong className="text-[#FF8C00]">Not:</strong> Tasarıma tam
                oturması ve kartların düzgün görünmesi için yükleyeceğiniz
                görsellerin yatay (tercihen 16:9 veya 4:3 oranında) olmasına
                dikkat ediniz. Önerilen minimum boyut: 800x600 pikseldir.
              </p>
            </div>
            {imageUrl && !imageFile && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">Mevcut Görsel:</p>
                <img
                  src={imageUrl}
                  alt="Mevcut"
                  className="h-24 w-auto rounded-lg object-cover border border-[#E2E8CE]"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E2E8CE]">
          {initialData && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting || uploadingImage}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              İptal
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || uploadingImage}
            className="px-6 py-3 bg-[#FF8C00] text-white rounded-xl font-bold hover:bg-[#e67e00] shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {uploadingImage
              ? "Görsel Yükleniyor..."
              : isSubmitting
                ? "Kaydediliyor..."
                : initialData
                  ? "Güncelle"
                  : "Ekle"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
