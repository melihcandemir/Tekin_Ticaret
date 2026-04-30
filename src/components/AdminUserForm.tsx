import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey } from '../lib/supabase';
type AdminUserFormProps = {
  isOpen: boolean;
  mode: 'create' | 'update-password';
  targetEmail?: string;
  targetUserId?: string;
  currentUserEmail?: string;
  onClose: () => void;
  onSubmit: (data: { email?: string; password: string }) => Promise<void>;
};

// Eye icon (visible)
const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

// Eye-off icon (hidden)
const EyeOffIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const TogglePasswordButton = ({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
  >
    {show ? <EyeOffIcon /> : <EyeIcon />}
  </button>
);

const AdminUserForm: React.FC<AdminUserFormProps> = ({
  isOpen,
  mode,
  targetEmail,
  currentUserEmail,
  onClose,
  onSubmit,
}) => {
  const [email, setEmail] = useState('');

  // update-password: step 1 — verify current password
  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [currentPasswordVerified, setCurrentPasswordVerified] = useState(false);

  // update-password: step 2 — new password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const isCreate = mode === 'create';

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setCurrentPassword('');
      setShowCurrentPassword(false);
      setCurrentPasswordVerified(false);
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setValidationError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Step 1: verify current password via temporary client to avoid session overwrite
  const handleVerifyCurrentPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!currentPassword) {
      setValidationError('Mevcut şifrenizi girin.');
      return;
    }

    setLoading(true);
    try {
      const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        }
      });

      // We use the current admin's email + the entered password to verify
      const { error } = await tempClient.auth.signInWithPassword({
        email: currentUserEmail ?? '',
        password: currentPassword,
      });

      if (error) {
        setValidationError('Mevcut şifre yanlış. Lütfen tekrar deneyin.');
      } else {
        setCurrentPasswordVerified(true);
        setValidationError('');
      }
    } catch (err) {
      setValidationError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: submit new password
  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (password.length < 6) {
      setValidationError('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (password === currentPassword) {
      setValidationError('Yeni şifre eskisiyle aynı olamaz.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Şifreler eşleşmiyor.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ password });
    } finally {
      setLoading(false);
    }
  };

  // Create mode submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (password.length < 6) {
      setValidationError('Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Şifreler eşleşmiyor.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ email, password });
    } finally {
      setLoading(false);
    }
  };

  const title = isCreate ? 'Yeni Admin Ekle' : 'Şifre Güncelle';
  const subtitle = isCreate
    ? 'Yeni admin hesabı oluşturun'
    : `"${targetEmail}" için şifre güncelleyin`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8CE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF8C00] rounded-xl flex items-center justify-center shadow-md">
              {isCreate ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{subtitle}</p>
            </div>
          </div>
          <button
            id="close-admin-form"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ─── UPDATE-PASSWORD: Step indicator ─── */}
        {!isCreate && (
          <div className="px-6 pt-5 flex items-center gap-3">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentPasswordVerified
                    ? 'bg-green-500 text-white'
                    : 'bg-[#FF8C00] text-white'
                }`}
              >
                {currentPasswordVerified ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  '1'
                )}
              </div>
              <span
                className={`text-xs font-semibold ${
                  currentPasswordVerified ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                Doğrulama
              </span>
            </div>
            <div className={`flex-1 h-px ${currentPasswordVerified ? 'bg-green-400' : 'bg-gray-200'}`} />
            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentPasswordVerified ? 'bg-[#FF8C00] text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                2
              </div>
              <span
                className={`text-xs font-semibold ${
                  currentPasswordVerified ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                Yeni Şifre
              </span>
            </div>
          </div>
        )}

        {/* ─── CREATE MODE ─── */}
        {isCreate && (
          <form onSubmit={handleCreateSubmit} className="p-6 space-y-5">
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                {validationError}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta Adresi</label>
              <input
                id="admin-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all bg-gray-50 focus:bg-white"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Şifre</label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all bg-gray-50 focus:bg-white"
                  placeholder="En az 6 karakter"
                />
                <TogglePasswordButton show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Şifre Tekrar</label>
              <div className="relative">
                <input
                  id="admin-confirm-password-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all bg-gray-50 focus:bg-white"
                  placeholder="Şifrenizi tekrar girin"
                />
                <TogglePasswordButton show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} id="cancel-admin-form"
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                İptal
              </button>
              <button type="submit" id="submit-admin-form" disabled={loading}
                className="flex-1 px-4 py-3 bg-[#FF8C00] hover:bg-[#e67e00] text-white font-bold rounded-xl shadow-md shadow-[#FF8C00]/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5">
                {loading ? <LoadingSpinner label="İşleniyor..." /> : 'Admin Ekle'}
              </button>
            </div>
          </form>
        )}

        {/* ─── UPDATE-PASSWORD: Step 1 — Verify current password ─── */}
        {!isCreate && !currentPasswordVerified && (
          <form onSubmit={handleVerifyCurrentPassword} className="p-6 space-y-5">
            <div className="p-3 bg-[#FF8C00]/8 border border-[#FF8C00]/20 rounded-xl text-sm text-gray-600">
              <p className="font-semibold text-gray-700 mb-0.5">Kimlik Doğrulama Gerekli</p>
              <p>Devam etmek için <span className="font-semibold text-[#FF8C00]">{currentUserEmail}</span> hesabının mevcut şifresini girin.</p>
            </div>

            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {validationError}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mevcut Şifre</label>
              <div className="relative">
                <input
                  id="admin-current-password-input"
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all bg-gray-50 focus:bg-white"
                  placeholder="Mevcut şifreyi girin"
                />
                <TogglePasswordButton show={showCurrentPassword} onToggle={() => setShowCurrentPassword(!showCurrentPassword)} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} id="cancel-admin-form"
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                İptal
              </button>
              <button type="submit" id="verify-current-password-btn" disabled={loading}
                className="flex-1 px-4 py-3 bg-[#FF8C00] hover:bg-[#e67e00] text-white font-bold rounded-xl shadow-md shadow-[#FF8C00]/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5">
                {loading ? <LoadingSpinner label="Doğrulanıyor..." /> : 'Doğrula →'}
              </button>
            </div>
          </form>
        )}

        {/* ─── UPDATE-PASSWORD: Step 2 — Enter new password ─── */}
        {!isCreate && currentPasswordVerified && (
          <form onSubmit={handleSubmitNewPassword} className="p-6 space-y-5">
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Kimlik doğrulandı. Yeni şifreyi belirleyin.</span>
            </div>

            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {validationError}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Yeni Şifre</label>
              <div className="relative">
                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all bg-gray-50 focus:bg-white"
                  placeholder="En az 6 karakter"
                />
                <TogglePasswordButton show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Yeni Şifre Tekrar</label>
              <div className="relative">
                <input
                  id="admin-confirm-password-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] transition-all bg-gray-50 focus:bg-white"
                  placeholder="Yeni şifreyi tekrar girin"
                />
                <TogglePasswordButton show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} id="cancel-admin-form"
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                İptal
              </button>
              <button type="submit" id="submit-admin-form" disabled={loading}
                className="flex-1 px-4 py-3 bg-[#FF8C00] hover:bg-[#e67e00] text-white font-bold rounded-xl shadow-md shadow-[#FF8C00]/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5">
                {loading ? <LoadingSpinner label="Güncelleniyor..." /> : 'Şifreyi Güncelle'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const LoadingSpinner = ({ label }: { label: string }) => (
  <span className="flex items-center justify-center gap-2">
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
    {label}
  </span>
);

export default AdminUserForm;
