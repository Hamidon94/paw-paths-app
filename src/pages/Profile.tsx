import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { ArrowLeft, User as UserIcon, Phone, Mail, MapPin, Edit } from 'lucide-react';

interface UserProfile {
  id: string;
  auth_user_id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    avatar_url: ''
  });

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      setSession(session);
      setUser(session.user);
      await fetchProfile(session.user.id);
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (authUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUserId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found is ok, we'll create it
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);

    try {
      if (profile) {
        // Update existing profile
        const { error } = await supabase
          .from('users')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('users')
          .insert({
            auth_user_id: user.id,
            email: user.email!,
            ...formData
          });

        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });

      // Refresh profile
      await fetchProfile(user.id);
      setEditing(false);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder le profil",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-primary">Mon profil</h1>
          </div>
          <Button 
            variant={editing ? "default" : "outline"} 
            onClick={editing ? handleSave : () => setEditing(true)}
            disabled={saving}
          >
            {editing ? (
              saving ? "Sauvegarde..." : "Sauvegarder"
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Gérez vos informations de profil et de contact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={editing ? formData.avatar_url : profile?.avatar_url} 
                  alt="Photo de profil" 
                />
                <AvatarFallback className="text-lg">
                  {(editing ? formData.first_name : profile?.first_name)?.[0] || 
                   user?.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">
                  {(editing ? `${formData.first_name} ${formData.last_name}` : 
                    `${profile?.first_name || ''} ${profile?.last_name || ''}`)?.trim() || 
                    user?.email}
                </h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {editing ? (
              // Edit Form
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">Prénom</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Nom</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Votre numéro de téléphone"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Votre adresse"
                  />
                </div>

                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Votre ville"
                  />
                </div>

                <div>
                  <Label htmlFor="avatar_url">Photo de profil (URL)</Label>
                  <Input
                    id="avatar_url"
                    type="url"
                    value={formData.avatar_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatar_url: e.target.value }))}
                    placeholder="https://exemple.com/photo.jpg"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={saving} className="flex-1">
                    {saving ? "Sauvegarde..." : "Sauvegarder"}
                  </Button>
                </div>
              </div>
            ) : (
              // Display Mode
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Nom complet:</span>
                  <span>{`${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Non renseigné'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span>{user?.email}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Téléphone:</span>
                  <span>{profile?.phone || 'Non renseigné'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Adresse:</span>
                  <span>{profile?.address || 'Non renseigné'}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Ville:</span>
                  <span>{profile?.city || 'Non renseigné'}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du compte</CardTitle>
            <CardDescription>
              Détails de votre compte et statistiques
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Compte créé le:</span>
              <span className="text-sm">
                {new Date(user?.created_at || '').toLocaleDateString('fr-FR')}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Statut:</span>
              <Badge variant="default">Actif</Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email vérifié:</span>
              <Badge variant={user?.email_confirmed_at ? "default" : "secondary"}>
                {user?.email_confirmed_at ? "Oui" : "Non"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Profile;