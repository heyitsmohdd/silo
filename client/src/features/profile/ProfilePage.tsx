import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/ui/Button';
import { Mail, Shield, Calendar, GitBranch, Edit2, Lock, Trash2, User as UserIcon } from 'lucide-react';
import axiosClient from '@/lib/axios';
import EditProfileModal from './EditProfileModal';
import ChangePassword from './ChangePassword';
import { getIdentity } from '@/lib/identity';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

const DISPLAY_FONT = "'Instrument Serif', serif";
const MUTED = 'hsl(240, 4%, 66%)';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const [activeModal, setActiveModal] = useState<'edit' | 'password' | 'delete' | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  if (!user) return null;

  const identity = getIdentity(user.userId, user.username);

  const confirmLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleDeleteAccount = async () => {
    try {
      await axiosClient.delete('/auth/account');
      logout();
      window.location.href = '/login';
    } catch {
      setActiveModal(null);
      setAlertMessage('Failed to delete account. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-rise">
      {/* Profile header card */}
      <div className="liquid-glass rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative flex-shrink-0">
            <img
              src={identity.avatar}
              alt={identity.name}
              className="w-20 h-20 rounded-full ring-2 ring-white/10 shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-zinc-950 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
              <h1
                className="text-2xl sm:text-3xl font-normal text-white leading-tight"
                style={{ fontFamily: DISPLAY_FONT }}
              >
                {identity.name}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10" style={{ color: MUTED }}>
                ANON
              </span>
            </div>

            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {user.role === 'STUDENT' ? 'Student' : 'Professor'}
              </span>
              <span className="text-xs font-mono" style={{ color: MUTED }}>
                {user.year} · {user.branch}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="text-sm transition-colors font-medium mt-2 sm:mt-0 hover:text-white"
            style={{ color: MUTED }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Account info card */}
      <div className="liquid-glass rounded-2xl p-6 sm:p-8 space-y-6">
        <h2
          className="text-xl font-normal text-white"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          Account{' '}
          <em className="not-italic" style={{ color: MUTED }}>Information</em>
        </h2>

        <div className="space-y-3">
          {[
            { icon: Mail, label: 'Email Address', value: user.email, mono: true },
            { icon: Shield, label: 'Role', value: user.role.toLowerCase(), mono: false },
            { icon: Calendar, label: 'Batch Context', value: `${user.year} · ${user.branch}`, mono: true },
            ...(user.firstName ? [{ icon: UserIcon, label: 'First Name', value: user.firstName, mono: false }] : []),
          ].map(({ icon: Icon, label, value, mono }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: MUTED }} />
              <div>
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: MUTED }}>{label}</p>
                <p className={`text-sm text-white ${mono ? 'font-mono' : ''} capitalize`}>{value}</p>
              </div>
            </div>
          ))}

          {user.firstName && user.lastName && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <GitBranch className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: MUTED }} />
              <div>
                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: MUTED }}>Last Name</p>
                <p className="text-sm text-white">{user.lastName}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button onClick={() => setActiveModal('edit')} variant="ghost" className="flex-1 border border-white/10 hover:border-white/20">
            <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
          </Button>
          <Button onClick={() => setActiveModal('password')} variant="ghost" className="flex-1 border border-white/10 hover:border-white/20">
            <Lock className="w-4 h-4 mr-2" /> Change Password
          </Button>
        </div>
      </div>

      {/* Danger zone */}
      <Button
        onClick={() => setActiveModal('delete')}
        variant="ghost"
        className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/20"
      >
        <Trash2 className="w-4 h-4 mr-2" /> Delete Account
      </Button>

      {/* Modals — untouched logic */}
      {activeModal === 'edit' && (
        <EditProfileModal
          user={user}
          onClose={() => setActiveModal(null)}
          onSuccess={() => { setActiveModal(null); window.location.reload(); }}
        />
      )}

      {activeModal === 'password' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative w-full max-w-md">
            <ChangePassword onCancel={() => setActiveModal(null)} onSuccess={() => { setActiveModal(null); window.location.reload(); }} />
          </div>
        </div>
      )}

      {activeModal === 'delete' && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setActiveModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md liquid-glass rounded-2xl p-6 border border-red-500/20">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-red-400">Delete Account</h2>
                    <p className="text-xs text-red-400/70">This action cannot be undone</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm" style={{ color: MUTED }}>
                  <p>• All your notes will be permanently deleted</p>
                  <p>• Your chat messages will be removed</p>
                  <p>• Your account data will be erased</p>
                  <p>• You will be logged out immediately</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setActiveModal(null)} className="flex-1 px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white text-sm">
                    Cancel
                  </button>
                  <button onClick={handleDeleteAccount} className="flex-1 px-4 py-2 rounded-xl bg-red-500/90 text-white hover:bg-red-600 transition-colors text-sm shadow-lg shadow-red-500/20">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        variant="info"
      />

      <ConfirmationModal
        isOpen={!!alertMessage}
        onClose={() => setAlertMessage(null)}
        onConfirm={() => setAlertMessage(null)}
        title="Error"
        description={alertMessage || ''}
        confirmText="OK"
        variant="danger"
        hideCancel
      />
    </div>
  );
};

export default ProfilePage;
