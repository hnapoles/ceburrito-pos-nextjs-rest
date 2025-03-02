import { AlertTriangle, ShoppingCart, FileText, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  message: string;
  type?: 'error' | 'empty' | 'cart' | 'info';
  className?: string;
}

const iconMap = {
  error: <AlertTriangle className="h-6 w-6 text-red-500" />,
  empty: <FileText className="h-6 w-6 text-gray-500" />,
  cart: <ShoppingCart className="h-6 w-6 text-gray-500" />,
  info: <Info className="h-6 w-6 text-blue-500" />, // More semantic for "info"
};

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  type = 'info',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 p-6 rounded-lg bg-gray-100 dark:bg-gray-800',
        className,
      )}
    >
      {iconMap[type] || iconMap.info}
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
};

export default ErrorDisplay;
