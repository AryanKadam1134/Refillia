import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

interface OperatingHoursProps {
  schedule: Record<string, DaySchedule>;
  onScheduleChange: (day: string, updates: Partial<DaySchedule>) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 24 }, (_, i) => 
  `${String(i).padStart(2, '0')}:00`
);

const OperatingHoursSection: React.FC<OperatingHoursProps> = ({
  schedule,
  onScheduleChange,
}) => {
  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Operating Hours</Label>
      <div className="space-y-2">
        {DAYS.map((day) => (
          <div key={day} className="flex items-center space-x-4 p-2 rounded bg-gray-50">
            <div className="w-32">
              <Label>{day}</Label>
            </div>
            <Switch
              checked={schedule[day].isOpen}
              onCheckedChange={(checked) => 
                onScheduleChange(day, { isOpen: checked })
              }
            />
            {schedule[day].isOpen && (
              <>
                <Select
                  value={schedule[day].openTime}
                  onValueChange={(value) => 
                    onScheduleChange(day, { openTime: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Open" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOURS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>to</span>
                <Select
                  value={schedule[day].closeTime}
                  onValueChange={(value) => 
                    onScheduleChange(day, { closeTime: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Close" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOURS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperatingHoursSection;