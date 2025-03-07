import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Lock } from 'lucide-react';

interface StationTypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectType: (type: 'public' | 'private') => void;
}

const StationTypeDialog: React.FC<StationTypeDialogProps> = ({
  open,
  onClose,
  onSelectType,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Station Type</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-auto"
            onClick={() => onSelectType('public')}
          >
            <MapPin className="h-8 w-8 mb-2" />
            <span className="font-semibold">Public Station</span>
            <span className="text-xs text-gray-500 mt-1">
              Available to everyone
            </span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center p-6 h-auto"
            onClick={() => onSelectType('private')}
          >
            <Lock className="h-8 w-8 mb-2" />
            <span className="font-semibold">Private Station</span>
            <span className="text-xs text-gray-500 mt-1">
              Limited access & hours
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StationTypeDialog;