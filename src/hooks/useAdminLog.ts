import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export type IslemTipi =
  | 'musteri_ekle'
  | 'musteri_sil'
  | 'veresiye_ekle'
  | 'veresiye_sil'
  | 'profil_guncelle';

type LogParams = {
  islem_tipi: IslemTipi;
  aciklama: string;
  hedef_id?: string;
  hedef_adi?: string;
  extra?: Record<string, unknown>;
};

export const useAdminLog = () => {
  const { user } = useAuth();

  const logIslem = useCallback(
    async (params: LogParams) => {
      if (!user?.email) return;

      await supabase.from('admin_islem_loglari').insert([
        {
          islem_tipi: params.islem_tipi,
          aciklama: params.aciklama,
          admin_id: user.id,
          admin_email: user.email,
          hedef_id: params.hedef_id ?? null,
          hedef_adi: params.hedef_adi ?? null,
          extra: params.extra ?? null,
        },
      ]);
    },
    [user],
  );

  return { logIslem };
};
