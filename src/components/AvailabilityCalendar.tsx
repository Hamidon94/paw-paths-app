import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Clock, Save, Trash2 } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TimeSlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Dimanche' },
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
];

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { value: `${hour}:00`, label: `${hour}:00` };
});

interface AvailabilityCalendarProps {
  userId?: string;
  readOnly?: boolean;
}

export const AvailabilityCalendar = ({ userId, readOnly = false }: AvailabilityCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, [userId]);

  const fetchAvailability = async () => {
    try {
      const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
      if (!targetUserId) return;

      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('sitter_id', targetUserId);

      if (error) throw error;

      const slots: TimeSlot[] = data?.map(slot => ({
        id: slot.id,
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_available: true,
      })) || [];

      // Fill in missing days with default unavailable
      DAYS_OF_WEEK.forEach(day => {
        if (!slots.some(s => s.day_of_week === day.value)) {
          slots.push({
            day_of_week: day.value,
            start_time: '09:00',
            end_time: '18:00',
            is_available: false,
          });
        }
      });

      setAvailability(slots.sort((a, b) => a.day_of_week - b.day_of_week));
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Erreur lors du chargement des disponibilités');
    } finally {
      setLoading(false);
    }
  };

  const updateSlot = (dayOfWeek: number, field: keyof TimeSlot, value: any) => {
    setAvailability(prev => 
      prev.map(slot => 
        slot.day_of_week === dayOfWeek ? { ...slot, [field]: value } : slot
      )
    );
  };

  const saveAvailability = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Delete existing availability
      await supabase
        .from('availability')
        .delete()
        .eq('sitter_id', user.id);

      // Insert new availability (only available slots)
      const availableSlots = availability
        .filter(slot => slot.is_available)
        .map(slot => ({
          sitter_id: user.id,
          day_of_week: slot.day_of_week,
          start_time: slot.start_time,
          end_time: slot.end_time,
        }));

      if (availableSlots.length > 0) {
        const { error } = await supabase
          .from('availability')
          .insert(availableSlots);

        if (error) throw error;
      }

      toast.success('Disponibilités enregistrées');
      await fetchAvailability();
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const getAvailabilityForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    return availability.find(slot => slot.day_of_week === dayOfWeek && slot.is_available);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Calendrier
          </CardTitle>
          <CardDescription>
            Visualisez vos disponibilités
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            className="rounded-md border"
            modifiers={{
              available: (date) => !!getAvailabilityForDate(date),
            }}
            modifiersStyles={{
              available: {
                backgroundColor: 'hsl(142, 76%, 90%)',
                color: 'hsl(142, 76%, 36%)',
              },
            }}
          />
          {selectedDate && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-medium">
                {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
              </p>
              {getAvailabilityForDate(selectedDate) ? (
                <p className="text-sm text-muted-foreground">
                  Disponible de {getAvailabilityForDate(selectedDate)?.start_time} à {getAvailabilityForDate(selectedDate)?.end_time}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Non disponible</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      {!readOnly && (
        <Card>
          <CardHeader>
            <CardTitle>Planning hebdomadaire</CardTitle>
            <CardDescription>
              Définissez vos horaires de disponibilité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DAYS_OF_WEEK.map((day) => {
              const slot = availability.find(s => s.day_of_week === day.value);
              if (!slot) return null;

              return (
                <div key={day.value} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-24">
                    <Label className="font-medium">{day.label}</Label>
                  </div>
                  
                  <Switch
                    checked={slot.is_available}
                    onCheckedChange={(checked) => updateSlot(day.value, 'is_available', checked)}
                  />

                  {slot.is_available && (
                    <>
                      <Select
                        value={slot.start_time}
                        onValueChange={(value) => updateSlot(day.value, 'start_time', value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map(time => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span className="text-muted-foreground">à</span>

                      <Select
                        value={slot.end_time}
                        onValueChange={(value) => updateSlot(day.value, 'end_time', value)}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map(time => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}

                  {!slot.is_available && (
                    <Badge variant="secondary">Indisponible</Badge>
                  )}
                </div>
              );
            })}

            <Button onClick={saveAvailability} disabled={saving} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Enregistrement...' : 'Enregistrer les disponibilités'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
