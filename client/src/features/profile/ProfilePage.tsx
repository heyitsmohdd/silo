import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/ui/Button';
import { LogOut, Mail, Shield, Calendar, GitBranch, Edit2, Lock, Trash2 } from 'lucide-react';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import axiosClient from '@/lib/axios';

/**
 * ProfilePage Component
 * Displays user information and provides account management
 */
const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'profile' | 'edit' | 'password' | 'delete'>('profile');

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
    )) {
      return;
    }

    if (!window.confirm(
      'This is your last chance! Are you absolutely sure you want to delete your account?'
    )) {
      return;
    }

    try {
      await axiosClient.delete('/auth/account');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const getInitials = () => {
    // Use firstName and lastName if available
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName.substring(0, 2).toUpperCase();
    }
    // Fall back to email
    const email = user.userId || '';
    const parts = email.split('@')[0].split(/[._-]/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    return getTruncatedId(user.userId);
  };

  const getAvatarGradient = () => {
    const str = user.userId || 'default';
    const hash = str.split('').reduce((acc: number, char: string) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const hue = Math.abs(hash % 360);
    return `linear-gradient(135deg, hsl(${hue}, 70%, 50%), hsl(${(hue + 60) % 360}, 70%, 60%))`;
  };

  const getTruncatedId = (str: string) => {
    if (str.length > 20) {
      return `${str.substring(0, 8)}...${str.substring(str.length - 8)}`;
    }
    return str;
  };

  if (activeView === 'edit') {
    return (
      <div className="max-w-2xl mx-auto">
        <EditProfile
          user={user}
          onCancel={() => setActiveView('profile')}
          onSuccess={() => {
            setActiveView('profile');
            window.location.reload();
          }}
        />
      </div>
    );
  }

  if (activeView === 'password') {
    return (
      <div className="max-w-2xl mx-auto">
        <ChangePassword
          onCancel={() => setActiveView('profile')}
          onSuccess={() => {
            setActiveView('profile');
            alert('Password changed successfully!');
          }}
        />
      </div>
    );
  }

  if (activeView === 'delete') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-destructive rounded-lg shadow-soft-lg overflow-hidden">
          <div className="p-6 md:p-8 border-b border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">
                  Delete Account
                </h2>
                <p className="text-sm text-muted-foreground">
                  This action is permanent and cannot be undone
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-3">
              <h3 className="font-medium text-card-foreground">
                What happens when you delete your account?
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>All your notes and content will be permanently deleted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Your chat messages will be deleted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>Your account information will be removed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>You will be logged out immediately</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setActiveView('profile')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-card border border-border rounded-lg shadow-soft-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-border">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-md"
              style={{ background: getAvatarGradient() }}
            >
              {getInitials()}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-semibold text-card-foreground mb-3">
                {getDisplayName()}
              </h2>

              {(user.firstName || user.lastName) && (
                <p className="text-sm text-muted-foreground mb-2">
                  {getTruncatedId(user.userId)}
                </p>
              )}

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  {user.role === 'STUDENT' ? 'Active Student' : 'Professor'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 md:p-8 space-y-2">
          <DetailRow
            icon={Mail}
            label="Email"
            value={user.userId}
            truncate
          />
          <DetailRow
            icon={Shield}
            label="Role"
            value={user.role.toLowerCase()}
          />
          <DetailRow
            icon={Calendar}
            label="Year"
            value={user.year.toString()}
          />
          <DetailRow
            icon={GitBranch}
            label="Branch"
            value={user.branch}
          />
        </div>

        {/* Quick Actions */}
        <div className="p-6 border-t border-border bg-muted/30 space-y-3">
          <Button
            variant="outline"
            onClick={() => setActiveView('edit')}
            className="w-full justify-start"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveView('password')}
            className="w-full justify-start"
          >
            <Lock className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="p-6 border-t border-destructive/20 bg-destructive/5">
          <Button
            variant="ghost"
            onClick={() => setActiveView('delete')}
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </div>

        {/* Sign Out */}
        <div className="p-6 border-t border-border bg-muted/30">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Logged in to Silo
          </p>
        </div>
      </div>
    </div>
  );
};

// Detail Row Component
interface DetailRowProps {
  icon: any;
  label: string;
  value: string;
  truncate?: boolean;
}

const DetailRow = ({ icon: Icon, label, value, truncate }: DetailRowProps) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <span className={`text-sm font-semibold text-card-foreground capitalize ${truncate ? 'max-w-[150px] truncate' : ''
        }`}>
        {value.toLowerCase()}
      </span>
    </div>
  );
};

export default ProfilePage;
