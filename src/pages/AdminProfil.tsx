import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import AdminUserCard from '../components/AdminUserCard';
import AdminUserForm from '../components/AdminUserForm';
import ConfirmModal from '../components/ConfirmModal';

type AdminUser = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
};

type FormMode = 'create' | 'update-password';

type Notification = {
  type: 'success' | 'error';
  message: string;
};

const EDGE_FUNCTION_URL =
  'https://vopkquojuikwqffsljea.supabase.co/functions/v1/admin-user-management';

const AdminProfil = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState('');
  const [deleteTargetEmail, setDeleteTargetEmail] = useState('');

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const callEdgeFunction = useCallback(async (body: object) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Bir hata oluştu.');
    return json;
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await callEdgeFunction({ action: 'list' });
      const sorted = (data.users as AdminUser[]).sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      setUsers(sorted);
    } catch {
      showNotification('error', 'Kullanıcılar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [callEdgeFunction]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, fetchUsers]);

  const handleCreate = async ({ password, email }: { email?: string; password: string }) => {
    try {
      await callEdgeFunction({ action: 'create', email, password });
      showNotification('success', `"${email}" başarıyla oluşturuldu.`);
      setFormOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kullanıcı oluşturulamadı.';
      showNotification('error', msg);
    }
  };

  const handleUpdatePassword = async ({ password }: { email?: string; password: string }) => {
    try {
      await callEdgeFunction({ action: 'update-password', userId: selectedUserId, newPassword: password });
      showNotification('success', `"${selectedEmail}" şifresi güncellendi.`);
      setFormOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Şifre güncellenemedi.';
      showNotification('error', msg);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteModalOpen(false);
    try {
      await callEdgeFunction({ action: 'delete', userId: deleteTargetId });
      showNotification('success', `"${deleteTargetEmail}" başarıyla silindi.`);
      fetchUsers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kullanıcı silinemedi.';
      showNotification('error', msg);
    }
  };

  const openCreateForm = () => {
    setFormMode('create');
    setSelectedUserId('');
    setSelectedEmail('');
    setFormOpen(true);
  };

  const openUpdatePasswordForm = (userId: string, email: string) => {
    setFormMode('update-password');
    setSelectedUserId(userId);
    setSelectedEmail(email);
    setFormOpen(true);
  };

  const openDeleteModal = (userId: string, email: string) => {
    setDeleteTargetId(userId);
    setDeleteTargetEmail(email);
    setDeleteModalOpen(true);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-24 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg font-semibold text-sm transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}
        >
          {notification.type === 'success' ? (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {notification.message}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Yönetimi</h1>
          <p className="text-gray-500 mt-1">Sisteme erişebilecek admin hesaplarını yönetin.</p>
        </div>
        <button
          id="add-new-admin-btn"
          onClick={openCreateForm}
          className="flex items-center gap-2 bg-[#FF8C00] hover:bg-[#e67e00] text-white font-bold px-5 py-3 rounded-xl shadow-md shadow-[#FF8C00]/30 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Yeni Admin Ekle
        </button>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-br from-[#FF8C00]/5 to-[#E2E8CE]/30 border border-[#E2E8CE] rounded-2xl p-5 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-[#FF8C00] rounded-xl flex items-center justify-center text-white shadow-md">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
          <p className="text-sm text-gray-500">Toplam Admin Hesabı</p>
        </div>
        <div className="ml-auto text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-700">Aktif Hesap</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* User List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Adminler yükleniyor...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="font-semibold text-lg">Henüz admin yok</p>
          <p className="text-sm">Yeni admin eklemek için butona tıklayın</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <AdminUserCard
              key={u.id}
              user={u}
              currentUserId={user.id}
              onDelete={openDeleteModal}
              onUpdatePassword={openUpdatePasswordForm}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <AdminUserForm
        isOpen={formOpen}
        mode={formMode}
        targetEmail={selectedEmail}
        targetUserId={selectedUserId}
        currentUserEmail={user.email}
        onClose={() => setFormOpen(false)}
        onSubmit={formMode === 'create' ? handleCreate : handleUpdatePassword}
      />

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Admini Sil"
        message={`"${deleteTargetEmail}" hesabını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default AdminProfil;
