import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type VeresiyeKayit = {
  id: string;
  musteri_adi: string;
  miktar: number;
  islem_tipi: 'borc' | 'odeme';
  aciklama: string;
  created_at: string;
};

const VeresiyeDefteri = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kayitlar, setKayitlar] = useState<VeresiyeKayit[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [musteriAdi, setMusteriAdi] = useState('');
  const [miktar, setMiktar] = useState('');
  const [islemTipi, setIslemTipi] = useState<'borc' | 'odeme'>('borc');
  const [aciklama, setAciklama] = useState('');
  
  const [duzenlenecekId, setDuzenlenecekId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchKayitlar();
  }, [user, navigate]);

  const fetchKayitlar = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('veresiye')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setKayitlar(data);
    }
    setLoading(false);
  };

  const handleEkleVeyaGuncelle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!musteriAdi || !miktar) return;

    if (duzenlenecekId) {
      // Güncelleme
      const { error } = await supabase
        .from('veresiye')
        .update({
          musteri_adi: musteriAdi,
          miktar: parseFloat(miktar),
          islem_tipi: islemTipi,
          aciklama: aciklama
        })
        .eq('id', duzenlenecekId);
        
      if (!error) {
        setDuzenlenecekId(null);
        sifirlaForm();
        fetchKayitlar();
      }
    } else {
      // Ekleme
      const { error } = await supabase
        .from('veresiye')
        .insert([{
          musteri_adi: musteriAdi,
          miktar: parseFloat(miktar),
          islem_tipi: islemTipi,
          aciklama: aciklama
        }]);

      if (!error) {
        sifirlaForm();
        fetchKayitlar();
      }
    }
  };

  const handleSil = async (id: string) => {
    if (window.confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      const { error } = await supabase.from('veresiye').delete().eq('id', id);
      if (!error) {
        fetchKayitlar();
      }
    }
  };

  const handleDuzenle = (kayit: VeresiyeKayit) => {
    setDuzenlenecekId(kayit.id);
    setMusteriAdi(kayit.musteri_adi);
    setMiktar(kayit.miktar.toString());
    setIslemTipi(kayit.islem_tipi);
    setAciklama(kayit.aciklama || '');
  };

  const sifirlaForm = () => {
    setMusteriAdi('');
    setMiktar('');
    setIslemTipi('borc');
    setAciklama('');
    setDuzenlenecekId(null);
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-sm border border-[#E2E8CE]">
        <h2 className="text-2xl font-bold text-[#FF8C00] mb-6">
          {duzenlenecekId ? 'Kaydı Düzenle' : 'Yeni Kayıt Ekle'}
        </h2>
        <form onSubmit={handleEkleVeyaGuncelle} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Müşteri Adı</label>
            <input
              type="text"
              required
              value={musteriAdi}
              onChange={(e) => setMusteriAdi(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Miktar (₺)</label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">İşlem Tipi</label>
            <select
              value={islemTipi}
              onChange={(e) => setIslemTipi(e.target.value as 'borc' | 'odeme')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white"
            >
              <option value="borc">Borç (Alınan Ürün)</option>
              <option value="odeme">Ödeme (Alınan Para)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Açıklama</label>
            <input
              type="text"
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] bg-gray-50 focus:bg-white"
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-4">
            {duzenlenecekId && (
              <button
                type="button"
                onClick={sifirlaForm}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-3 bg-[#FF8C00] text-white rounded-xl font-bold hover:bg-[#e67e00] shadow-md transition-all hover:-translate-y-0.5"
            >
              {duzenlenecekId ? 'Güncelle' : 'Ekle'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-[#FFFFFF] p-6 rounded-2xl shadow-sm border border-[#E2E8CE]">
        <h2 className="text-2xl font-bold text-[#FF8C00] mb-6">Veresiye Kayıtları</h2>
        {loading ? (
          <p className="text-gray-500 text-center py-8">Yükleniyor...</p>
        ) : kayitlar.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Henüz kayıt bulunmamaktadır.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8CE] text-gray-600">
                  <th className="py-4 px-4 font-semibold">Tarih</th>
                  <th className="py-4 px-4 font-semibold">Müşteri</th>
                  <th className="py-4 px-4 font-semibold">İşlem Tipi</th>
                  <th className="py-4 px-4 font-semibold">Açıklama</th>
                  <th className="py-4 px-4 font-semibold text-right">Miktar</th>
                  <th className="py-4 px-4 font-semibold text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {kayitlar.map((kayit) => (
                  <tr key={kayit.id} className="border-b border-[#E2E8CE]/50 hover:bg-[#E2E8CE]/20 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(kayit.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-800">{kayit.musteri_adi}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        kayit.islem_tipi === 'borc' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {kayit.islem_tipi === 'borc' ? 'Borç' : 'Ödeme'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{kayit.aciklama}</td>
                    <td className={`py-4 px-4 text-right font-bold ${
                      kayit.islem_tipi === 'borc' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {kayit.islem_tipi === 'borc' ? '-' : '+'}{kayit.miktar} ₺
                    </td>
                    <td className="py-4 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleDuzenle(kayit)}
                        className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleSil(kayit.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-semibold"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VeresiyeDefteri;
