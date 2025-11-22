import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { ArrowLeft, MapPin, Euro, Clock, Star } from 'lucide-react';

const WalkerRegister = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    bio: '',
    experience_years: '',
    hourly_rate: '30',
    service_radius: '5',
    address: '',
    city: '',
    certifications: [] as string[],
    languages: ['Français'],
    availabilities: {
      monday: { enabled: false, start: '09:00', end: '17:00' },
      tuesday: { enabled: false, start: '09:00', end: '17:00' },
      wednesday: { enabled: false, start: '09:00', end: '17:00' },
      thursday: { enabled: false, start: '09:00', end: '17:00' },
      friday: { enabled: false, start: '09:00', end: '17:00' },
      saturday: { enabled: false, start: '09:00', end: '17:00' },
      sunday: { enabled: false, start: '09:00', end: '17:00' },
    }
  });

  const certificationOptions = [
    'Éducateur canin certifié',
    'Formation premiers secours animaux',
    'Comportementaliste canin',
    'Formation sécurité animale',
    'Certification dressage',
    'Formation vétérinaire'
  ];

  const dayNames = {
    monday: 'Lundi',
    tuesday: 'Mardi', 
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  };

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth?mode=walker');
        return;
      }
      setSession(session);
      setUser(session.user);
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate('/auth?mode=walker');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      // Use auth user id directly as user id
      const userId = user.id;

      // Update user to become a sitter
      const { data: walkerData, error: walkerError } = await supabase
        .from('users')
        .update({
          role: 'sitter',
          bio: formData.bio,
          hourly_rate: parseFloat(formData.hourly_rate),
          location: formData.city,
        })
        .eq('id', userId)
        .select()
        .single();

      if (walkerError) throw walkerError;

      // Create availability entries
      const availabilityEntries = [];
      Object.entries(formData.availabilities).forEach(([day, schedule], index) => {
        if (schedule.enabled) {
          availabilityEntries.push({
            sitter_id: userId,
            day_of_week: index + 1,
            start_time: schedule.start,
            end_time: schedule.end,
          });
        }
      });

      if (availabilityEntries.length > 0) {
        const { error: availabilityError } = await supabase
          .from('availability')
          .insert(availabilityEntries);

        if (availabilityError) throw availabilityError;
      }

      toast({
        title: "Inscription réussie !",
        description: "Votre profil de promeneur a été créé avec succès",
      });

      navigate('/walker/dashboard');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer votre profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateAvailability = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      availabilities: {
        ...prev.availabilities,
        [day]: {
          ...prev.availabilities[day as keyof typeof prev.availabilities],
          [field]: value
        }
      }
    }));
  };

  const toggleCertification = (cert: string) => {
    const current = formData.certifications;
    if (current.includes(cert)) {
      updateFormData('certifications', current.filter(c => c !== cert));
    } else {
      updateFormData('certifications', [...current, cert]);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-primary">Devenir promeneur</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {i}
                </div>
                {i < 3 && <div className={`w-16 h-0.5 mx-2 ${step > i ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground">
            {step === 1 && "Informations personnelles"}
            {step === 2 && "Certifications et compétences"}
            {step === 3 && "Disponibilités"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
                <CardDescription>
                  Parlez-nous de vous et de votre expérience avec les chiens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="bio">Présentation</Label>
                  <Textarea
                    id="bio"
                    placeholder="Parlez-nous de votre passion pour les chiens, votre expérience..."
                    value={formData.bio}
                    onChange={(e) => updateFormData('bio', e.target.value)}
                    required
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience">Années d'expérience</Label>
                    <Select value={formData.experience_years} onValueChange={(value) => updateFormData('experience_years', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Débutant</SelectItem>
                        <SelectItem value="1">1 an</SelectItem>
                        <SelectItem value="2">2 ans</SelectItem>
                        <SelectItem value="3">3 ans</SelectItem>
                        <SelectItem value="4">4 ans</SelectItem>
                        <SelectItem value="5">5+ ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rate">Tarif horaire (€)</Label>
                    <Input
                      id="rate"
                      type="number"
                      min="10"
                      max="100"
                      value={formData.hourly_rate}
                      onChange={(e) => updateFormData('hourly_rate', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      placeholder="123 rue des exemples"
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      placeholder="Paris"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="radius">Rayon de service (km)</Label>
                  <Select value={formData.service_radius} onValueChange={(value) => updateFormData('service_radius', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 km</SelectItem>
                      <SelectItem value="5">5 km</SelectItem>
                      <SelectItem value="10">10 km</SelectItem>
                      <SelectItem value="15">15 km</SelectItem>
                      <SelectItem value="20">20 km</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setStep(2)}>
                    Suivant
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Vérifications et documents</CardTitle>
                <CardDescription>
                  Documents requis pour valider votre profil de promeneur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">Documents obligatoires</h4>
                  <p className="text-sm text-blue-700">
                    Les documents suivants sont requis pour finaliser votre inscription en tant que promeneur professionnel.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">Carte d'identité</h5>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Obligatoire</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Pièce d'identité valide (CNI, passeport ou permis de conduire)
                    </p>
                    <Input type="file" accept=".jpg,.jpeg,.png,.pdf" />
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">Casier judiciaire</h5>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Obligatoire</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Extrait de casier judiciaire vierge (bulletin n°3)
                    </p>
                    <Input type="file" accept=".jpg,.jpeg,.png,.pdf" />
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">Attestation d'assurance</h5>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Obligatoire</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Assurance responsabilité civile professionnelle
                    </p>
                    <Input type="file" accept=".jpg,.jpeg,.png,.pdf" />
                  </div>
                </div>

                <div>
                  <Label>Certifications (optionnel)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {certificationOptions.map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <Checkbox
                          id={cert}
                          checked={formData.certifications.includes(cert)}
                          onCheckedChange={() => toggleCertification(cert)}
                        />
                        <Label htmlFor={cert} className="text-sm font-normal">
                          {cert}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Précédent
                  </Button>
                  <Button type="button" onClick={() => setStep(3)}>
                    Suivant
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Vos disponibilités</CardTitle>
                <CardDescription>
                  Définissez quand vous êtes disponible pour promener les chiens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(formData.availabilities).map(([day, schedule]) => (
                    <div key={day} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-4 mb-3">
                        <Checkbox
                          id={day}
                          checked={schedule.enabled}
                          onCheckedChange={(checked) => updateAvailability(day, 'enabled', checked)}
                        />
                        <Label htmlFor={day} className="text-base font-medium">
                          {dayNames[day as keyof typeof dayNames]}
                        </Label>
                      </div>
                      
                      {schedule.enabled && (
                        <div className="grid grid-cols-2 gap-4 ml-6">
                          <div>
                            <Label className="text-sm">Début</Label>
                            <Input
                              type="time"
                              value={schedule.start}
                              onChange={(e) => updateAvailability(day, 'start', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="text-sm">Fin</Label>
                            <Input
                              type="time"
                              value={schedule.end}
                              onChange={(e) => updateAvailability(day, 'end', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Précédent
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Création du profil..." : "Créer mon profil"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </main>
    </div>
  );
};

export default WalkerRegister;