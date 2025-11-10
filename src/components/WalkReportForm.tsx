import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';

interface WalkReportFormProps {
  bookingId: string;
  walkerId: string;
  onReportCreated?: () => void;
}

export const WalkReportForm = ({ bookingId, walkerId, onReportCreated }: WalkReportFormProps) => {
  const [report, setReport] = useState({
    behaviorNotes: '',
    healthNotes: '',
    incidents: '',
    distanceKm: '',
    durationMinutes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('booking_reports')
        .insert({
          booking_id: bookingId,
          report_text: `Comportement: ${report.behaviorNotes}\n\nSanté: ${report.healthNotes}\n\nIncidents: ${report.incidents}`,
          behavior_notes: report.behaviorNotes,
          incidents: report.incidents,
          distance_km: report.distanceKm ? parseFloat(report.distanceKm) : null,
          duration_minutes: report.durationMinutes ? parseInt(report.durationMinutes) : null
        });

      if (error) throw error;

      toast.success('Rapport de promenade créé avec succès');
      setReport({
        behaviorNotes: '',
        healthNotes: '',
        incidents: '',
        distanceKm: '',
        durationMinutes: ''
      });
      onReportCreated?.();
    } catch (error) {
      console.error('Error creating report:', error);
      toast.error('Erreur lors de la création du rapport');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rapport de promenade</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Comportement du chien</Label>
            <Textarea
              value={report.behaviorNotes}
              onChange={(e) => setReport({ ...report, behaviorNotes: e.target.value })}
              placeholder="Décrivez le comportement du chien pendant la promenade..."
              rows={3}
            />
          </div>

          <div>
            <Label>Notes de santé</Label>
            <Textarea
              value={report.healthNotes}
              onChange={(e) => setReport({ ...report, healthNotes: e.target.value })}
              placeholder="Observations concernant la santé du chien..."
              rows={3}
            />
          </div>

          <div>
            <Label>Incidents</Label>
            <Textarea
              value={report.incidents}
              onChange={(e) => setReport({ ...report, incidents: e.target.value })}
              placeholder="Y a-t-il eu des incidents pendant la promenade ?"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Distance parcourue (km)</Label>
              <Input
                type="number"
                step="0.1"
                value={report.distanceKm}
                onChange={(e) => setReport({ ...report, distanceKm: e.target.value })}
                placeholder="5.2"
              />
            </div>

            <div>
              <Label>Durée réelle (minutes)</Label>
              <Input
                type="number"
                value={report.durationMinutes}
                onChange={(e) => setReport({ ...report, durationMinutes: e.target.value })}
                placeholder="45"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Création...' : 'Créer le rapport'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
