import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import Button from '@/components/ui/Button';
import { LogOut, Mail, Shield, Calendar, GitBranch } from 'lucide-react';

/**
 * ProfilePage Component
 * Displays user information and provides logout functionality
 */
const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    const email = user.userId || '';
    const parts = email.split('@')[0].split(/[._-]/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
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
                {getTruncatedId(user.userId)}
              </h2>

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

        {/* Actions */}
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
      <span className={`text-sm font-semibold text-card-foreground capitalize ${
        truncate ? 'max-w-[150px] truncate' : ''
      }`}>
        {value.toLowerCase()}
      </span>
    </div>
  );
};

export default ProfilePage;
