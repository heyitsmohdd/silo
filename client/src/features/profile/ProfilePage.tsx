import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/ui/Button';
import { Mail, Shield, Calendar, GitBranch, Edit2, Lock, Trash2, User as UserIcon } from 'lucide-react';
import axiosClient from '@/lib/axios';
import EditProfileModal from './EditProfileModal';
import ChangePassword from './ChangePassword';
import { getIdentity } from '@/lib/identity';

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const [activeModal, setActiveModal] = useState<'edit' | 'password' | 'delete' | null>(null);

  // Guard: don't render if user is null
  if (!user) {
    return null;
  }

  const identity = getIdentity(user.userId, user.username);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      window.location.href = '/login';
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(
      'Are you sure you want to delete your account? This action is permanent and cannot be undone.'
    )) {
      return;
    }

    try {
      await axiosClient.delete('/auth/account');
      logout();
      window.location.href = '/login';
    } catch (error) {
      alert('Failed to delete account. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="glass-card p-8 overflow-hidden border border-zinc-800">
        <div className="flex items-center gap-6">
          <div className="relative flex-shrink-0">
            <img
              src={identity.avatar}
              alt={identity.name}
              className="w-20 h-20 rounded-full bg-zinc-900 ring-4 ring-zinc-800 shadow-2xl shadow-emerald-500/10"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 ring-4 ring-zinc-950 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {identity.name}
              </h1>
              <div className="px-2.5 py-0.5 rounded-md bg-zinc-800/60 border border-zinc-700">
                <span className="text-xs font-mono text-zinc-400">ANON</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/40 border border-zinc-700">
                <Shield className="w-3 h-3 text-zinc-400" />
                <span className="text-xs font-medium text-zinc-300">
                  {user.role === 'STUDENT' ? 'Student' : 'Professor'}
                </span>
              </div>
              <div className="text-xs text-zinc-500 font-mono">
                {user.year} • {user.branch}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="glass-card p-6 border border-zinc-800">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-zinc-100">Account Information</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800">
              <Mail className="w-4 h-4 text-zinc-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Email Address</p>
                <p className="text-sm text-zinc-200 font-mono">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800">
              <Shield className="w-4 h-4 text-zinc-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Role</p>
                <p className="text-sm text-zinc-200 capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800">
              <Calendar className="w-4 h-4 text-zinc-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">Batch Context</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-zinc-500">Year:</span>
                    <span className="text-sm text-zinc-200 font-mono">{user.year}</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-zinc-700" />
                  <div className="flex items-center gap-1.5">
                    <GitBranch className="w-3 h-3 text-zinc-500" />
                    <span className="text-sm text-zinc-200 font-mono">{user.branch}</span>
                  </div>
                </div>
              </div>
            </div>

            {user.firstName && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/40 border border-zinc-800">
                <UserIcon className="w-4 h-4 text-zinc-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-1">First Name</p>
                  <p className="text-sm text-zinc-200">{user.firstName}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setActiveModal('edit')}
              variant="ghost"
              className="flex-1 border border-zinc-700 hover:border-zinc-600"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              onClick={() => setActiveModal('password')}
              variant="ghost"
              className="flex-1 border border-zinc-700 hover:border-zinc-600"
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => setActiveModal('delete')}
          variant="ghost"
          className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </div>

      {activeModal === 'edit' && (
        <EditProfileModal
          user={user}
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            window.location.reload();
          }}
        />
      )}

      {activeModal === 'password' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative w-full max-w-md">
            <ChangePassword
              onCancel={() => setActiveModal(null)}
              onSuccess={() => {
                setActiveModal(null);
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}

      {activeModal === 'delete' && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setActiveModal(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900/95 backdrop-blur-md border border-red-500/20 rounded-xl shadow-2xl shadow-black/50 p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-500/10 rounded-full">
                    <Trash2 className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-red-400">Delete Account</h2>
                    <p className="text-sm text-red-400/80">This action cannot be undone</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-zinc-300">
                  <p>• All your notes will be permanently deleted</p>
                  <p>• Your chat messages will be removed</p>
                  <p>• Your account data will be erased</p>
                  <p>• You will be logged out immediately</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setActiveModal(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800/40 transition-colors text-zinc-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
