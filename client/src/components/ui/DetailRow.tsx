import type { LucideIcon } from 'lucide-react';

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  truncate?: boolean;
}

const DetailRow = ({ icon: Icon, label, value, truncate }: DetailRowProps) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
          <span className={`text-sm text-muted-foreground capitalize ${truncate ? 'max-w-[150px] truncate' : ''}`}>
            {value.toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DetailRow;
