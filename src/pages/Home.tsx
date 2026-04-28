import { useEffect, useState, useMemo } from "react";
import ProductCard, { type Product } from "../components/ProductCard";
import ProductFilter from "../components/ProductFilter";
import { supabase } from "../lib/supabase";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

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

  return (
    <div>
      {/* Hero başlık */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#FF8C00] mb-2">
          Ürünlerimiz
        </h1>
        <p className="text-gray-500 text-base">
          {loading ? (
            "Ürünler yükleniyor..."
          ) : (
            <>
              Toplam <span className="font-semibold text-gray-700">{filteredProducts.length}</span> ürün listeleniyor.
            </>
          )}
        </p>
      </div>

      {/* Filtreleme Componenti */}
      {!loading && products.length > 0 && (
        <ProductFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      )}

      {/* Ürün grid */}
      {!loading && filteredProducts.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-[#E2E8CE] p-8 text-center mt-6">
          <p className="text-gray-500 text-lg">
            {products.length === 0 
              ? "Şu anda sistemde listelenecek ürün bulunmamaktadır." 
              : "Arama ve filtre kriterlerinize uygun ürün bulunamadı."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
