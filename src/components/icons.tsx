
import type { LucideProps } from 'lucide-react';
import {
  Moon,
  Sun,
  Laptop,
  Languages,
  Expand,
  Shrink,
  BookOpenText,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  RotateCcw,
  Settings2,
  Plus,
  Minus,
  ChevronsUpDown,
  Check,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Clock,
  Edit3,
  Save,
  Trash2,
  ALargeSmall, // Added
  Download,    // Added
} from 'lucide-react';

export type Icon = React.FC<LucideProps>;

export const Icons = {
  Sun,
  Moon,
  Laptop,
  Languages,
  Expand,
  Shrink,
  BookOpenText,
  ZoomIn,
  ZoomOut,
  Play,
  Pause,
  RotateCcw,
  Settings2,
  Plus,
  Minus,
  ChevronsUpDown,
  Check,
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  ClockIcon: Clock,
  EditIcon: Edit3,
  SaveIcon: Save,
  DeleteIcon: Trash2,
  ALargeSmall, // Added
  Download,    // Added
};

export default Icons;
