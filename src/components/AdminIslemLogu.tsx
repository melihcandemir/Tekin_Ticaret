import React from 'react';

export type IslemLog = {
  id: string;
  islem_tipi: string;
  aciklama: string;
  admin_email: string;
  hedef_adi?: string;
  extra?: Record<string, unknown>;
  created_at: string;
};

type Props = {
  loglar: IslemLog[];
  loading?: boolean;
  baslik?: string;
  maxItems?: number;
};

const islemConfig: Record<
  string,
  { label: string; renk: string; bg: string; ikon: React.ReactNode }
> = {
  musteri_ekle: {
    label: 'Müşteri Eklendi',
    renk: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    ikon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  musteri_sil: {
    label: 'Müşteri Silindi',
    renk: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    ikon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
      </svg>
    ),
  },
  veresiye_ekle: {
    label: 'Kayıt Eklendi',
    renk: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
    ikon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  veresiye_sil: {
    label: 'Kayıt Silindi',
    renk: 'text-orange-700',
    bg: 'bg-orange-50 border-orange-200',
    ikon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
  },
  profil_guncelle: {
    label: 'Profil Güncellendi',
    renk: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
    ikon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
};

const formatTarih = (dateStr: string) => {
  const d = new Date(dateStr);
  return {
    tarih: d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }),
    saat: d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
  };
};

const AdminIslemLogu: React.FC<Props> = ({
  loglar,
  loading = false,
  baslik = 'İşlem Geçmişi',
  maxItems,
}) => {
  const gosterilecek = maxItems ? loglar.slice(0, maxItems) : loglar;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8CE] shadow-sm overflow-hidden">
      {/* Başlık */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E2E8CE] bg-gradient-to-r from-[#FF8C00]/5 to-transparent">
        <div className="w-8 h-8 bg-[#FF8C00] rounded-lg flex items-center justify-center text-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-800">{baslik}</h3>
        {!loading && (
          <span className="ml-auto text-xs font-semibold bg-[#E2E8CE] text-gray-600 px-2.5 py-1 rounded-full">
            {loglar.length} kayıt
          </span>
        )}
      </div>

      {/* İçerik */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-8 h-8 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Yükleniyor...</p>
        </div>
      ) : gosterilecek.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-medium">Henüz işlem kaydı yok</p>
        </div>
      ) : (
        <div className="divide-y divide-[#E2E8CE]/60">
          {gosterilecek.map((log) => {
            const config = islemConfig[log.islem_tipi] ?? {
              label: log.islem_tipi,
              renk: 'text-gray-700',
              bg: 'bg-gray-50 border-gray-200',
              ikon: null,
            };
            const { tarih, saat } = formatTarih(log.created_at);

            return (
              <div key={log.id} className="flex items-start gap-4 px-6 py-4 hover:bg-[#E2E8CE]/10 transition-colors">
                {/* İkon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center mt-0.5 ${config.bg} ${config.renk}`}>
                  {config.ikon}
                </div>

                {/* İçerik */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${config.bg} ${config.renk}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-snug">{log.aciklama}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1.5">
                    {/* Admin */}
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-semibold text-[#FF8C00]">{log.admin_email}</span>
                    </span>
                    {/* Tarih */}
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {tarih}
                    </span>
                    {/* Saat */}
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {saat}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminIslemLogu;
