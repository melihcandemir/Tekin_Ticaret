import React, { useState } from 'react';

type AdminUser = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
};

type AdminUserCardProps = {
  user: AdminUser;
  currentUserId: string;
  onDelete: (userId: string, email: string) => void;
  onUpdatePassword: (userId: string, email: string) => void;
};

const AdminUserCard: React.FC<AdminUserCardProps> = ({
  user,
  currentUserId,
  onDelete,
  onUpdatePassword,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const isCurrentUser = user.id === currentUserId;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getInitial = (email: string) => email.charAt(0).toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8CE] shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4 group">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-[#FF8C00] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
          {getInitial(user.email)}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-gray-800 truncate">{user.email}</p>
          {isCurrentUser && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FF8C00]/10 text-[#FF8C00] border border-[#FF8C00]/20">
              Siz
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Oluşturuldu: {formatDate(user.created_at)}
          </span>
          {user.last_sign_in_at && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Son giriş: {formatDate(user.last_sign_in_at)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          id={`update-password-${user.id}`}
          onClick={() => onUpdatePassword(user.id, user.email)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#E2E8CE] hover:bg-[#d4dabb] text-gray-700 font-semibold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          title="Şifre Güncelle"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <span className="hidden sm:inline">Şifre</span>
        </button>

        <div className="relative">
          <button
            id={`delete-${user.id}`}
            onClick={() => !isCurrentUser && onDelete(user.id, user.email)}
            onMouseEnter={() => isCurrentUser && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            disabled={isCurrentUser}
            className={`flex items-center gap-1.5 px-3 py-2 font-semibold text-sm rounded-xl transition-all duration-200 ${
              isCurrentUser
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-50 hover:bg-red-500 text-red-500 hover:text-white hover:-translate-y-0.5'
            }`}
            title="Sil"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline">Sil</span>
          </button>
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap shadow-lg z-10">
              Kendi hesabınızı silemezsiniz
              <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserCard;
