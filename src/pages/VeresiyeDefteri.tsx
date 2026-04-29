import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";

type Musteri = {
  id: string;
  ad: string;
  telefon: string;
  created_at: string;
};

type MusteriWithBalance = Musteri & {
  toplamBorc: number;
};

const VeresiyeDefteri = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [musteriler, setMusteriler] = useState<MusteriWithBalance[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [ad, setAd] = useState("");
  const [telefon, setTelefon] = useState("");

  // Search state
  const [aramaMetni, setAramaMetni] = useState("");

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchMusteriler = async () => {
    setLoading(true);
    // Fetch customers with their ledger records to calculate dynamic balance
    const { data: musteriData, error: musteriError } = await supabase
      .from("musteriler")
      .select("*, veresiye(miktar, islem_tipi, is_deleted)")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (!musteriError && musteriData) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedMusteriler = musteriData.map((m: any) => {
        const toplamBorc =
          m.veresiye
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ?.filter((v: any) => !v.is_deleted)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .reduce((acc: number, item: any) => {
              if (item.islem_tipi === "borc") return acc + Number(item.miktar);
              return acc - Number(item.miktar);
            }, 0) || 0;

        return {
          id: m.id,
          ad: m.ad,
          telefon: m.telefon,
          created_at: m.created_at,
          toplamBorc,
        };
      });
      setMusteriler(formattedMusteriler);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchMusteriler();
  }, [user, navigate]);

  const handleMusteriEkle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ad) return;

    const { error } = await supabase
      .from("musteriler")
      .insert([{ ad, telefon }]);

    if (!error) {
      setAd("");
      setTelefon("");
      fetchMusteriler();
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    const { error } = await supabase
      .from("musteriler")
      .update({ is_deleted: true })
      .eq("id", deleteTargetId);
    if (!error) {
      fetchMusteriler();
    }
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const genelToplamBorc = musteriler.reduce((acc, m) => acc + m.toplamBorc, 0);

  const filtrelenmisMusteriler = musteriler.filter(
    (m) =>
      m.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      (m.telefon && m.telefon.toLowerCase().includes(aramaMetni.toLowerCase())),
  );

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-sm border border-[#E2E8CE]">
        <h2 className="text-2xl font-bold text-[#FF8C00] mb-6">
          Yeni Müşteri Ekle
        </h2>
        <form
          onSubmit={handleMusteriEkle}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Müşteri Adı Soyadı
            </label>
            <input
              type="text"
              required
              value={ad}
              onChange={(e) => setAd(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Telefon (Opsiyonel)
            </label>
            <input
              type="tel"
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#FF8C00] text-white rounded-xl font-bold hover:bg-[#e67e00] shadow-md transition-all hover:-translate-y-0.5"
            >
              Müşteri Ekle
            </button>
          </div>
        </form>
      </div>

      <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-sm border border-[#E2E8CE]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-[#FF8C00]">Müşteri Listesi</h2>
          {!loading && musteriler.length > 0 && (
            <div
              className={`px-6 py-3 rounded-xl border ${genelToplamBorc > 0 ? "bg-red-50 border-red-200" : genelToplamBorc < 0 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"} text-right`}
            >
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Piyasadaki Toplam Bakiye
              </p>
              <p
                className={`text-xl font-black ${genelToplamBorc > 0 ? "text-red-600" : genelToplamBorc < 0 ? "text-green-600" : "text-gray-700"}`}
              >
                {genelToplamBorc > 0
                  ? `${genelToplamBorc.toFixed(2)} ₺ Alacaklıyız`
                  : genelToplamBorc < 0
                    ? `${Math.abs(genelToplamBorc).toFixed(2)} ₺ Borçluyuz`
                    : "0.00 ₺"}
              </p>
            </div>
          )}
        </div>

        {musteriler.length > 0 && (
          <div className="mb-6">
            <input
              type="text"
              placeholder="Müşteri Ara (Ad veya Telefon ile)..."
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white shadow-sm"
            />
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-center py-8">Yükleniyor...</p>
        ) : musteriler.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Henüz kayıtlı müşteri bulunmamaktadır.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8CE] text-gray-600">
                  <th className="py-4 px-4 font-semibold">Müşteri Adı</th>
                  <th className="py-4 px-4 font-semibold">Telefon</th>
                  <th className="py-4 px-4 font-semibold text-right">
                    Kalan Borç / Bakiye
                  </th>
                  <th className="py-4 px-4 font-semibold text-center">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtrelenmisMusteriler.length === 0 && aramaMetni ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      Arama sonucunda müşteri bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filtrelenmisMusteriler.map((musteri) => (
                    <tr
                      key={musteri.id}
                      className="border-b border-[#E2E8CE]/50 hover:bg-[#E2E8CE]/20 transition-colors"
                    >
                      <td className="py-4 px-4 font-bold text-gray-800">
                        {musteri.ad}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {musteri.telefon || "-"}
                      </td>
                      <td
                        className={`py-4 px-4 text-right font-black ${
                          musteri.toplamBorc > 0
                            ? "text-red-600"
                            : musteri.toplamBorc < 0
                              ? "text-green-600"
                              : "text-gray-500"
                        }`}
                      >
                        {musteri.toplamBorc > 0
                          ? `${musteri.toplamBorc.toFixed(2)} ₺ Borçlu`
                          : musteri.toplamBorc < 0
                            ? `${Math.abs(musteri.toplamBorc).toFixed(2)} ₺ Alacaklı`
                            : "0.00 ₺"}
                      </td>
                      <td className="py-4 px-4 text-center space-x-3">
                        <Link
                          to={`/musteri/${musteri.id}`}
                          className="px-4 py-2 bg-[#E2E8CE] text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors inline-block"
                        >
                          Profil & İşlem Geçmişi
                        </Link>
                        <button
                          onClick={() => openDeleteModal(musteri.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors inline-block"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Müşteriyi Sil"
        message="Bu müşteriyi ve tüm işlem geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default VeresiyeDefteri;
