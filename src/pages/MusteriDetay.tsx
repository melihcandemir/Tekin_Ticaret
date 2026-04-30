import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import { useAdminLog } from "../hooks/useAdminLog";

type Musteri = {
  id: string;
  ad: string;
  telefon: string;
  adres: string;
  created_at: string;
};

type VeresiyeKayit = {
  id: string;
  musteri_id: string;
  miktar: number;
  islem_tipi: "borc" | "odeme";
  aciklama: string;
  created_at: string;
};

const MusteriDetay = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { logIslem } = useAdminLog();

  const [musteri, setMusteri] = useState<Musteri | null>(null);
  const [kayitlar, setKayitlar] = useState<VeresiyeKayit[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [miktar, setMiktar] = useState("");
  const [islemTipi, setIslemTipi] = useState<"borc" | "odeme">("borc");
  const [aciklama, setAciklama] = useState("");

  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editAd, setEditAd] = useState("");
  const [editTelefon, setEditTelefon] = useState("");

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchMusteriVeKayitlar = async () => {
    setLoading(true);

    // Fetch Müşteri
    const { data: musteriData } = await supabase
      .from("musteriler")
      .select("*")
      .eq("id", id)
      .single();

    if (musteriData) {
      setMusteri(musteriData);
      setEditAd(musteriData.ad);
      setEditTelefon(musteriData.telefon || "");
    }

    // Fetch Kayıtlar
    const { data: kayitData } = await supabase
      .from("veresiye")
      .select("*")
      .eq("musteri_id", id)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (kayitData) {
      setKayitlar(kayitData);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (id) {
      fetchMusteriVeKayitlar();
    }
  }, [user, navigate, id]);

  const handleProfilGuncelle = async () => {
    if (!editAd || !id) return;
    const { error } = await supabase
      .from("musteriler")
      .update({ ad: editAd, telefon: editTelefon })
      .eq("id", id);

    if (!error) {
      await logIslem({
        islem_tipi: 'profil_guncelle',
        aciklama: `"${musteri?.ad}" müşteri profili güncellendi. Yeni ad: "${editAd}".`,
        hedef_id: id,
        hedef_adi: editAd,
        extra: { eski_ad: musteri?.ad, yeni_ad: editAd, eski_telefon: musteri?.telefon, yeni_telefon: editTelefon },
      });
      setMusteri((prev) =>
        prev ? { ...prev, ad: editAd, telefon: editTelefon } : null,
      );
      setIsEditingProfile(false);
    }
  };

  const handleEkle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!miktar || !id) return;

    const { data, error } = await supabase.from("veresiye").insert([
      {
        musteri_id: id,
        musteri_adi: musteri?.ad,
        miktar: parseFloat(miktar),
        islem_tipi: islemTipi,
        aciklama: aciklama,
      },
    ]).select().single();

    if (!error && data) {
      await logIslem({
        islem_tipi: 'veresiye_ekle',
        aciklama: `"${musteri?.ad}" için ${islemTipi === 'borc' ? 'borç' : 'ödeme'} eklendi: ${parseFloat(miktar).toFixed(2)} ₺${aciklama ? ` (${aciklama})` : ''}.`,
        hedef_id: data.id,
        hedef_adi: musteri?.ad,
        extra: { musteri_id: id, miktar: parseFloat(miktar), islem_tipi: islemTipi, aciklama },
      });
      setMiktar("");
      setIslemTipi("borc");
      setAciklama("");
      fetchMusteriVeKayitlar();
    }
  };

  const openDeleteModal = (kayitId: string) => {
    setDeleteTargetId(kayitId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    const hedefKayit = kayitlar.find((k) => k.id === deleteTargetId);
    const { error } = await supabase
      .from("veresiye")
      .update({ is_deleted: true })
      .eq("id", deleteTargetId);
    if (!error) {
      await logIslem({
        islem_tipi: 'veresiye_sil',
        aciklama: `"${musteri?.ad}" müşterisine ait ${hedefKayit?.islem_tipi === 'borc' ? 'borç' : 'ödeme'} kaydı silindi: ${Number(hedefKayit?.miktar ?? 0).toFixed(2)} ₺.`,
        hedef_id: deleteTargetId,
        hedef_adi: musteri?.ad,
        extra: { musteri_id: id, miktar: hedefKayit?.miktar, islem_tipi: hedefKayit?.islem_tipi },
      });
      fetchMusteriVeKayitlar();
    }
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);
  };

  if (!user) return null;

  if (loading) {
    return <p className="text-center py-8 text-gray-500">Yükleniyor...</p>;
  }

  if (!musteri) {
    return <p className="text-center py-8 text-red-500">Müşteri bulunamadı.</p>;
  }

  // Calculate dynamic balance
  const toplamBorc = kayitlar.reduce((acc, kayit) => {
    if (kayit.islem_tipi === "borc") return acc + Number(kayit.miktar);
    return acc - Number(kayit.miktar);
  }, 0);

  return (
    <div className="space-y-8">
      {/* Profil Özeti */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-sm border border-[#E2E8CE] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-grow w-full md:w-auto">
          {isEditingProfile ? (
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Müşteri Adı
                </label>
                <input
                  type="text"
                  value={editAd}
                  onChange={(e) => setEditAd(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  value={editTelefon}
                  onChange={(e) => setEditTelefon(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleProfilGuncelle}
                  className="px-4 py-2 bg-[#FF8C00] text-white rounded-lg font-semibold hover:bg-[#e67e00] shadow-sm transition-all"
                >
                  Kaydet
                </button>
                <button
                  onClick={() => {
                    setIsEditingProfile(false);
                    setEditAd(musteri.ad);
                    setEditTelefon(musteri.telefon || "");
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold text-[#FF8C00]">
                  {musteri.ad}
                </h2>
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-sm px-3 py-1 bg-[#E2E8CE] text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Düzenle
                </button>
              </div>
              {musteri.telefon && (
                <p className="text-gray-600 mt-2 font-medium">
                  Telefon: {musteri.telefon}
                </p>
              )}
              <p className="text-sm text-gray-400 mt-1">
                Kayıt:{" "}
                {new Date(musteri.created_at).toLocaleDateString("tr-TR")}
              </p>
            </>
          )}
        </div>
        <div
          className={`p-6 rounded-xl border ${toplamBorc > 0 ? "bg-red-50 border-red-200" : toplamBorc < 0 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"} text-center min-w-[200px]`}
        >
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
            Kalan Bakiye
          </p>
          <p
            className={`text-3xl font-black ${toplamBorc > 0 ? "text-red-600" : toplamBorc < 0 ? "text-green-600" : "text-gray-700"}`}
          >
            {toplamBorc > 0
              ? `${toplamBorc.toFixed(2)} ₺ Borçlu`
              : toplamBorc < 0
                ? `${Math.abs(toplamBorc).toFixed(2)} ₺ Alacaklı`
                : "0.00 ₺"}
          </p>
        </div>
      </div>

      {/* İşlem Ekleme Formu */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-sm border border-[#E2E8CE]">
        <h3 className="text-xl font-bold text-[#FF8C00] mb-6">
          Yeni İşlem Ekle
        </h3>
        <form
          onSubmit={handleEkle}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Miktar (₺)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={miktar}
              onChange={(e) => setMiktar(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              İşlem Tipi
            </label>
            <select
              value={islemTipi}
              onChange={(e) => setIslemTipi(e.target.value as "borc" | "odeme")}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white"
            >
              <option value="borc">Borç (Alınan Ürün)</option>
              <option value="odeme">Ödeme (Alınan Para)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Açıklama
            </label>
            <input
              type="text"
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-6 py-3 bg-[#FF8C00] text-white rounded-xl font-bold hover:bg-[#e67e00] shadow-md transition-all hover:-translate-y-0.5"
            >
              İşlemi Kaydet
            </button>
          </div>
        </form>
      </div>

      {/* İşlem Geçmişi */}
      <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-sm border border-[#E2E8CE]">
        <h3 className="text-xl font-bold text-[#FF8C00] mb-6">İşlem Geçmişi</h3>
        {kayitlar.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Henüz bu müşteriye ait bir işlem bulunmamaktadır.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E2E8CE] text-gray-600">
                  <th className="py-4 px-4 font-semibold">Tarih</th>
                  <th className="py-4 px-4 font-semibold">İşlem Tipi</th>
                  <th className="py-4 px-4 font-semibold">Açıklama</th>
                  <th className="py-4 px-4 font-semibold text-right">Miktar</th>
                  <th className="py-4 px-4 font-semibold text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8CE]/50">
                {kayitlar.map((kayit) => (
                  <tr
                    key={kayit.id}
                    className="hover:bg-[#E2E8CE]/10 transition-colors"
                  >
                    <td className="py-4 px-4 text-gray-800 text-sm font-medium">
                      {new Date(kayit.created_at).toLocaleDateString("tr-TR")}{" "}
                      <span className="text-gray-500 text-xs ml-1">
                        {new Date(kayit.created_at).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`font-black text-sm px-3 py-1 rounded-lg inline-block shadow-sm whitespace-nowrap border ${
                          kayit.islem_tipi === "borc"
                            ? "text-red-600 bg-red-50 border-red-100"
                            : "text-green-600 bg-green-50 border-green-100"
                        }`}
                      >
                        {kayit.islem_tipi === "borc" ? "Borç" : "Ödeme"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {kayit.aciklama || "-"}
                    </td>
                    <td
                      className={`py-4 px-4 text-right font-bold text-base ${
                        kayit.islem_tipi === "borc"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {kayit.islem_tipi === "borc" ? "+" : "-"}
                      {Number(kayit.miktar).toFixed(2)} ₺
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <button
                          onClick={() => openDeleteModal(kayit.id)}
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
        )}
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="İşlemi Sil"
        message="Bu işlemi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default MusteriDetay;
