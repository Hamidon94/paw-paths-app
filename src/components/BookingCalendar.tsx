import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, isSameDay, startOfDay, setHours, setMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface BookingCalendarProps {
  availableDays?: number[]; // 0-6 (Sunday-Saturday)
  availableHours?: { start: string; end: string }[];
  bookedSlots?: { date: Date; time: string }[];
  onSelect?: (date: Date, time: string) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DEFAULT_TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export const BookingCalendar = ({
  availableDays = [1, 2, 3, 4, 5, 6], // Mon-Sat by default
  availableHours,
  bookedSlots = [],
  onSelect,
  minDate = new Date(),
  maxDate = addDays(new Date(), 60)
}: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');

  const isDateAvailable = (date: Date) => {
    const dayOfWeek = date.getDay();
    return availableDays.includes(dayOfWeek) && date >= startOfDay(minDate);
  };

  const isSlotBooked = (date: Date, time: string) => {
    return bookedSlots.some(
      slot => isSameDay(slot.date, date) && slot.time === time
    );
  };

  const getTimeSlots = (): TimeSlot[] => {
    if (!selectedDate) return [];

    const times = availableHours?.length 
      ? generateTimeSlots(availableHours[0].start, availableHours[0].end)
      : DEFAULT_TIME_SLOTS;

    return times.map(time => ({
      time,
      available: !isSlotBooked(selectedDate, time)
    }));
  };

  const generateTimeSlots = (start: string, end: string): string[] => {
    const slots: string[] = [];
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    
    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    
    return slots;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (selectedDate && onSelect) {
      onSelect(selectedDate, time);
    }
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime && onSelect) {
      onSelect(selectedDate, selectedTime);
    }
  };

  const timeSlots = getTimeSlots();

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Choisir une date</CardTitle>
          <CardDescription>
            Les jours disponibles sont en vert
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            locale={fr}
            disabled={(date) => !isDateAvailable(date) || date > maxDate}
            modifiers={{
              available: (date) => isDateAvailable(date) && date <= maxDate,
            }}
            modifiersStyles={{
              available: {
                backgroundColor: 'hsl(142, 76%, 90%)',
                color: 'hsl(142, 76%, 36%)',
              },
            }}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Choisir une heure
          </CardTitle>
          <CardDescription>
            {selectedDate 
              ? format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })
              : 'Sélectionnez d\'abord une date'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedDate ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p className="text-center">
                Veuillez d'abord sélectionner une date dans le calendrier
              </p>
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p className="text-center">
                Aucun créneau disponible pour cette date
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(({ time, available }) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? 'default' : 'outline'}
                    disabled={!available}
                    onClick={() => handleTimeSelect(time)}
                    className={`${!available ? 'opacity-50' : ''}`}
                  >
                    {time}
                  </Button>
                ))}
              </div>

              {selectedTime && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="font-medium text-center">
                    Créneau sélectionné
                  </p>
                  <p className="text-lg font-bold text-primary text-center">
                    {format(selectedDate, 'EEEE d MMMM', { locale: fr })} à {selectedTime}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface QuickDatePickerProps {
  onSelect: (date: Date) => void;
  selectedDate?: Date;
}

export const QuickDatePicker = ({ onSelect, selectedDate }: QuickDatePickerProps) => {
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {dates.map((date) => (
        <Button
          key={date.toISOString()}
          variant={selectedDate && isSameDay(date, selectedDate) ? 'default' : 'outline'}
          onClick={() => onSelect(date)}
          className="flex flex-col items-center min-w-[70px] h-auto py-2"
        >
          <span className="text-xs uppercase">
            {format(date, 'EEE', { locale: fr })}
          </span>
          <span className="text-lg font-bold">
            {format(date, 'd')}
          </span>
          <span className="text-xs">
            {format(date, 'MMM', { locale: fr })}
          </span>
        </Button>
      ))}
    </div>
  );
};
