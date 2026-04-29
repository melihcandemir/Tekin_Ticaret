import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminProductForm from "../components/AdminProductForm";
import AdminProductList from "../components/AdminProductList";
import ConfirmModal from "../components/ConfirmModal";
import ProductFilter from "../components/ProductFilter";
import type { Product } from "../components/ProductCard";

const AdminProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query);

        let matchesStock = true;
        if (stockFilter === "inStock") matchesStock = p.stock > 0;
        if (stockFilter === "outOfStock") matchesStock = p.stock === 0;

        return matchesSearch && matchesStock;
      })
      .sort((a, b) => {
        if (sortOrder === "priceAsc") return a.price - b.price;
        if (sortOrder === "priceDesc") return b.price - a.price;
        return 0;
      });
  }, [products, searchQuery, stockFilter, sortOrder]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setIsLoading(false);
  };

  const handleOpenAddForm = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Omit<Product, "id">) => {
    setIsSubmitting(true);
    
    if (editingProduct) {
      // Update
      const { error } = await supabase
        .from("products")
        .update(data)
        .eq("id", editingProduct.id);
        
      if (!error) {
        setIsFormOpen(false);
        fetchProducts();
      }
    } else {
      // Insert
      const { error } = await supabase
        .from("products")
        .insert([data]);
        
      if (!error) {
        setIsFormOpen(false);
        fetchProducts();
      }
    }
    setIsSubmitting(false);
  };

  const openDeleteModal = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", deleteTargetId);
      
    if (!error) {
      fetchProducts();
    }
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const handleStockChange = async (id: number, newStock: number) => {
    if (newStock < 0) return;
    
    setProducts((prev) => 
      prev.map(p => p.id === id ? { ...p, stock: newStock } : p)
    );

    const { error } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", id);
      
    if (error) {
      fetchProducts();
    }
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FF8C00] mb-2">
            Ürün Yönetimi
          </h1>
          <p className="text-gray-500 text-base">
            Ana sayfada sergilenecek ürünleri buradan ekleyebilir ve düzenleyebilirsiniz.
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleOpenAddForm}
            className="px-6 py-3 bg-[#FF8C00] text-white rounded-xl font-bold hover:bg-[#e67e00] shadow-md transition-all hover:-translate-y-0.5 whitespace-nowrap"
          >
            + Yeni Ürün Ekle
          </button>
        )}
      </div>

      {isFormOpen ? (
        <AdminProductForm
          initialData={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      ) : (
        <div className="space-y-6">
          {!isLoading && products.length > 0 && (
            <ProductFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stockFilter={stockFilter}
              setStockFilter={setStockFilter}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          )}
          <AdminProductList
            products={filteredProducts}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            onStockChange={handleStockChange}
          />
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Ürünü Sil"
        message="Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default AdminProducts;
