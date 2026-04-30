import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import AdminIslemLogu, { type IslemLog } from '../components/AdminIslemLogu';

type FiltreTipi = 'hepsi' | 'musteri_ekle' | 'musteri_sil' | 'veresiye_ekle' | 'veresiye_sil' | 'profil_guncelle';

const filtreler: { deger: FiltreTipi; label: string }[] = [
  { deger: 'hepsi', label: 'Hepsi' },
  { deger: 'veresiye_ekle', label: 'Kayıt Eklendi' },
  { deger: 'veresiye_sil', label: 'Kayıt Silindi' },
  { deger: 'musteri_ekle', label: 'Müşteri Eklendi' },
  { deger: 'musteri_sil', label: 'Müşteri Silindi' },
  { deger: 'profil_guncelle', label: 'Profil Güncellendi' },
];

const IslemGecmisi = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loglar, setLoglar] = useState<IslemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [aktifFiltre, setAktifFiltre] = useState<FiltreTipi>('hepsi');
  const [aramaMetni, setAramaMetni] = useState('');
  const [adminFiltre, setAdminFiltre] = useState('');
  const [adminler, setAdminler] = useState<string[]>([]);

  const fetchLoglar = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('admin_islem_loglari')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setLoglar(data as IslemLog[]);
      // Unique admin emails
      const emails = [...new Set((data as IslemLog[]).map((l) => l.admin_email))];
      setAdminler(emails);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchLoglar();
  }, [user, fetchLoglar]);

  const filtrelenmis = loglar.filter((log) => {
    const tipUygun = aktifFiltre === 'hepsi' || log.islem_tipi === aktifFiltre;
    const aramaUygun =
      !aramaMetni ||
      log.aciklama.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      (log.hedef_adi ?? '').toLowerCase().includes(aramaMetni.toLowerCase());
    const adminUygun = !adminFiltre || log.admin_email === adminFiltre;
    return tipUygun && aramaUygun && adminUygun;
  });

  // İstatistikler
  const istatistikler = {
    toplam: loglar.length,
    bugun: loglar.filter((l) => {
      const bugun = new Date();
      const logTarih = new Date(l.created_at);
      return logTarih.toDateString() === bugun.toDateString();
    }).length,
    veresiyeEkle: loglar.filter((l) => l.islem_tipi === 'veresiye_ekle').length,
    musteriEkle: loglar.filter((l) => l.islem_tipi === 'musteri_ekle').length,
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İşlem Geçmişi</h1>
          <p className="text-gray-500 mt-1">Veresiye defterindeki tüm işlemlerin kaydı.</p>
        </div>
        <button
          onClick={fetchLoglar}
          id="refresh-loglar-btn"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#E2E8CE] hover:bg-[#d4dabb] text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Yenile
        </button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Toplam İşlem', deger: istatistikler.toplam, renk: 'from-[#FF8C00] to-orange-400', ikon: '📋' },
          { label: 'Bugün', deger: istatistikler.bugun, renk: 'from-blue-500 to-blue-400', ikon: '📅' },
          { label: 'Kayıt Eklendi', deger: istatistikler.veresiyeEkle, renk: 'from-green-500 to-green-400', ikon: '➕' },
          { label: 'Müşteri Eklendi', deger: istatistikler.musteriEkle, renk: 'from-purple-500 to-purple-400', ikon: '👤' },
        ].map((kart) => (
          <div
            key={kart.label}
            className={`bg-gradient-to-br ${kart.renk} rounded-2xl p-4 text-white shadow-md`}
          >
            <p className="text-2xl mb-1">{kart.ikon}</p>
            <p className="text-2xl font-black">{kart.deger}</p>
            <p className="text-xs font-semibold opacity-90 mt-0.5">{kart.label}</p>
          </div>
        ))}
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-2xl border border-[#E2E8CE] p-4 space-y-4">
        {/* Arama & Admin filtresi */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="islem-arama"
              type="text"
              placeholder="Açıklama veya müşteri adı ara..."
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white text-sm"
            />
          </div>
          {adminler.length > 1 && (
            <select
              id="admin-filtre"
              value={adminFiltre}
              onChange={(e) => setAdminFiltre(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white text-sm font-medium"
            >
              <option value="">Tüm Adminler</option>
              {adminler.map((email) => (
                <option key={email} value={email}>{email}</option>
              ))}
            </select>
          )}
        </div>

        {/* İşlem tipi filtreleri */}
        <div className="flex flex-wrap gap-2">
          {filtreler.map((f) => (
            <button
              key={f.deger}
              id={`filtre-${f.deger}`}
              onClick={() => setAktifFiltre(f.deger)}
              className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                aktifFiltre === f.deger
                  ? 'bg-[#FF8C00] text-white shadow-md shadow-[#FF8C00]/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-[#E2E8CE]'
              }`}
            >
              {f.label}
              {f.deger !== 'hepsi' && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  aktifFiltre === f.deger ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {loglar.filter((l) => l.islem_tipi === f.deger).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Log Listesi */}
      <AdminIslemLogu
        loglar={filtrelenmis}
        loading={loading}
        baslik={`İşlem Listesi${filtrelenmis.length !== loglar.length ? ` (${filtrelenmis.length}/${loglar.length})` : ''}`}
      />
    </div>
  );
};

export default IslemGecmisi;
