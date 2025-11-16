import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileJson, FileText } from 'lucide-react';
import { toast } from 'sonner';

export const AdminConfiguration = () => {
  const configurationData = {
    project_info: {
      project_id: "vutshugqyopjitcmkwfx",
      supabase_url: "https://vutshugqyopjitcmkwfx.supabase.co",
      anon_key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dHNodWdxeW9waml0Y21rd2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMDkyODMsImV4cCI6MjA3Njc4NTI4M30.KMMd0-pz5s_pqi400Bpr5i6HAWkAIvCVyhD9f5uDcfU"
    },
    
    tables: {
      users: {
        description: "Table principale des utilisateurs (propriétaires et promeneurs)",
        columns: {
          id: "uuid PRIMARY KEY (auth.uid())",
          email: "text NOT NULL",
          first_name: "text NOT NULL",
          last_name: "text NOT NULL",
          role: "text NOT NULL ('owner' ou 'sitter')",
          phone: "text",
          avatar_url: "text",
          bio: "text",
          location: "text",
          hourly_rate: "numeric (DEFAULT 20.0, pour sitters)",
          average_rating: "numeric (DEFAULT 0)",
          is_verified: "boolean (DEFAULT false)",
          is_active: "boolean (DEFAULT true)",
          background_checked: "boolean (DEFAULT false)",
          created_at: "timestamp",
          updated_at: "timestamp"
        },
        rls_policies: [
          "Users can view own complete profile (SELECT, id = auth.uid())",
          "Public can view sitter basic profiles (SELECT, role = 'sitter' AND id != auth.uid())",
          "Users can insert own profile (INSERT, id = auth.uid())",
          "Users can update own profile (UPDATE, id = auth.uid())"
        ]
      },
      
      pets: {
        description: "Table des animaux de compagnie",
        columns: {
          id: "uuid PRIMARY KEY",
          owner_id: "uuid REFERENCES users(id)",
          name: "text NOT NULL",
          type: "text NOT NULL",
          breed: "text",
          age: "integer",
          weight: "numeric",
          photo_url: "text",
          bio: "text",
          medical_history: "text",
          temperament: "text",
          dietary_needs: "text",
          exercise_level: "text",
          special_needs: "text",
          allergies: "text[]",
          vaccinations: "text[]",
          vet_name: "text",
          vet_phone: "text",
          last_vet_visit: "timestamp",
          created_at: "timestamp",
          updated_at: "timestamp"
        },
        rls_policies: [
          "Allow authenticated user to select their own pets (SELECT, owner_id = auth.uid())",
          "Allow authenticated user to insert their own pet (INSERT, owner_id = auth.uid())"
        ]
      },
      
      bookings: {
        description: "Table des réservations de promenades/garde",
        columns: {
          id: "uuid PRIMARY KEY",
          booking_number: "text NOT NULL",
          owner_id: "uuid REFERENCES users(id)",
          sitter_id: "uuid REFERENCES users(id)",
          pet_id: "uuid REFERENCES pets(id)",
          service_type: "text NOT NULL",
          start_date: "timestamp NOT NULL",
          end_date: "timestamp NOT NULL",
          duration: "integer NOT NULL (en minutes)",
          base_price: "numeric NOT NULL",
          additional_price: "numeric (DEFAULT 0)",
          total_price: "numeric NOT NULL",
          additional_services: "text[]",
          status: "text (DEFAULT 'PENDING': PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)",
          payment_status: "text (DEFAULT 'PENDING': PENDING, PAID, REFUNDED)",
          notes: "text",
          created_at: "timestamp",
          updated_at: "timestamp"
        },
        rls_policies: [
          "Users can view own bookings (SELECT, owner_id = auth.uid() OR sitter_id = auth.uid())",
          "Owners can create bookings (INSERT, owner_id = auth.uid())",
          "Users can update own bookings (UPDATE, owner_id = auth.uid() OR sitter_id = auth.uid())"
        ]
      },
      
      reviews: {
        description: "Table des avis clients",
        columns: {
          id: "uuid PRIMARY KEY",
          booking_id: "uuid REFERENCES bookings(id)",
          author_id: "uuid REFERENCES users(id)",
          sitter_id: "uuid REFERENCES users(id)",
          rating: "integer NOT NULL (1-5)",
          comment: "text NOT NULL",
          photo_urls: "text[]",
          is_verified: "boolean (DEFAULT false)",
          created_at: "timestamp",
          updated_at: "timestamp"
        },
        rls_policies: [
          "Anyone can view reviews (SELECT, true)",
          "Owners can create reviews (INSERT, author_id = auth.uid() AND booking exists)",
          "Authors can update own reviews (UPDATE, author_id = auth.uid())",
          "Authors can delete own reviews (DELETE, author_id = auth.uid())"
        ]
      },
      
      messages: {
        description: "Table de messagerie entre utilisateurs",
        columns: {
          id: "uuid PRIMARY KEY",
          sender_id: "uuid REFERENCES users(id)",
          recipient_id: "uuid REFERENCES users(id)",
          content: "text NOT NULL",
          attachment_url: "text",
          is_read: "boolean (DEFAULT false)",
          created_at: "timestamp"
        },
        rls_policies: [
          "Users can view own messages (SELECT, sender_id = auth.uid() OR recipient_id = auth.uid())",
          "Users can send messages (INSERT, sender_id = auth.uid())",
          "Users can update received messages (UPDATE, recipient_id = auth.uid())"
        ]
      },
      
      notifications: {
        description: "Table des notifications système",
        columns: {
          id: "uuid PRIMARY KEY",
          user_id: "uuid REFERENCES users(id)",
          type: "text NOT NULL",
          title: "text NOT NULL",
          description: "text NOT NULL",
          link: "text",
          is_read: "boolean (DEFAULT false)",
          created_at: "timestamp"
        },
        rls_policies: [
          "Users can view own notifications (SELECT, user_id = auth.uid())",
          "System can create notifications (INSERT, true)",
          "Users can update own notifications (UPDATE, user_id = auth.uid())"
        ]
      },
      
      payments: {
        description: "Table des paiements",
        columns: {
          id: "uuid PRIMARY KEY",
          booking_id: "uuid REFERENCES bookings(id)",
          amount: "numeric NOT NULL",
          payment_method: "text NOT NULL",
          status: "text (DEFAULT 'PENDING')",
          transaction_id: "text",
          paid_at: "timestamp",
          created_at: "timestamp",
          updated_at: "timestamp"
        },
        rls_policies: [
          "Users can view payments for own bookings (SELECT, via booking relationship)",
          "Owners can create payments (INSERT, via booking relationship)",
          "Users can update payments for own bookings (UPDATE, via booking relationship)"
        ]
      },
      
      earnings: {
        description: "Table des gains des promeneurs",
        columns: {
          id: "uuid PRIMARY KEY",
          sitter_id: "uuid REFERENCES users(id)",
          booking_id: "uuid REFERENCES bookings(id)",
          type: "text NOT NULL",
          amount: "numeric NOT NULL",
          description: "text",
          status: "text (DEFAULT 'PENDING')",
          created_at: "timestamp",
          updated_at: "timestamp"
        },
        rls_policies: [
          "Sitters can view own earnings (SELECT, sitter_id = auth.uid())",
          "Sitters can create own earnings (INSERT, sitter_id = auth.uid())",
          "Sitters can update own earnings (UPDATE, sitter_id = auth.uid())"
        ]
      },
      
      tips: {
        description: "Table des pourboires",
        columns: {
          id: "uuid PRIMARY KEY",
          booking_id: "uuid REFERENCES bookings(id)",
          client_user_id: "uuid REFERENCES users(id)",
          walker_id: "uuid REFERENCES users(id)",
          amount: "numeric NOT NULL",
          stripe_payment_intent_id: "text",
          created_at: "timestamp"
        },
        rls_policies: [
          "Users can view tips for their bookings (SELECT, client_user_id = auth.uid() OR walker_id = auth.uid())",
          "Clients can create tips (INSERT, client_user_id = auth.uid())"
        ]
      },
      
      documents: {
        description: "Table des documents utilisateurs (ID, certifications, etc.)",
        columns: {
          id: "uuid PRIMARY KEY",
          user_id: "uuid REFERENCES users(id)",
          type: "text NOT NULL",
          url: "text NOT NULL",
          status: "text (DEFAULT 'PENDING')",
          verified_at: "timestamp",
          created_at: "timestamp",
          updated_at: "timestamp"
        },
        rls_policies: [
          "Users can view own documents (SELECT, user_id = auth.uid())",
          "Users can create own documents (INSERT, user_id = auth.uid())",
          "Users can update own documents (UPDATE, user_id = auth.uid())",
          "Users can delete own documents (DELETE, user_id = auth.uid())"
        ]
      },
      
      availability: {
        description: "Table de disponibilité des promeneurs",
        columns: {
          id: "uuid PRIMARY KEY",
          sitter_id: "uuid REFERENCES users(id)",
          day_of_week: "integer (0-6)",
          start_time: "time",
          end_time: "time",
          created_at: "timestamp",
          updated_at: "timestamp"
        },
        rls_policies: [
          "Anyone can view availability (SELECT, true)",
          "Sitters can manage own availability (ALL, sitter_id = auth.uid())"
        ]
      },
      
      booking_locations: {
        description: "Table de tracking GPS des promenades",
        columns: {
          id: "uuid PRIMARY KEY",
          booking_id: "uuid REFERENCES bookings(id)",
          latitude: "numeric NOT NULL",
          longitude: "numeric NOT NULL",
          accuracy: "numeric",
          recorded_at: "timestamp",
          created_at: "timestamp"
        },
        rls_policies: [
          "Users can view locations for their bookings (SELECT, via booking relationship)",
          "Sitters can create locations for their bookings (INSERT, via booking relationship)"
        ]
      },
      
      booking_reports: {
        description: "Table des rapports de promenade",
        columns: {
          id: "uuid PRIMARY KEY",
          booking_id: "uuid REFERENCES bookings(id)",
          report_text: "text NOT NULL",
          duration_minutes: "integer",
          distance_km: "numeric",
          bathroom_breaks: "integer (DEFAULT 0)",
          water_provided: "boolean (DEFAULT false)",
          treats_given: "boolean (DEFAULT false)",
          behavior_notes: "text",
          incidents: "text",
          created_at: "timestamp",
          updated_at: "timestamp"
        },
        rls_policies: [
          "Users can view reports for their bookings (SELECT, via booking relationship)",
          "Sitters can create reports for their bookings (INSERT, via booking relationship)"
        ]
      },
      
      service_photos: {
        description: "Table des photos de service pendant les promenades",
        columns: {
          id: "uuid PRIMARY KEY",
          booking_id: "uuid REFERENCES bookings(id)",
          url: "text NOT NULL",
          caption: "text",
          sent: "boolean (DEFAULT false)",
          created_at: "timestamp"
        },
        rls_policies: [
          "Users can view photos for own bookings (SELECT, via booking relationship)",
          "Sitters can create photos (INSERT, via booking relationship)",
          "Sitters can update photos (UPDATE, via booking relationship)",
          "Sitters can delete photos (DELETE, via booking relationship)"
        ]
      }
    },
    
    views: {
      dogs: "Vue simplifiée des animaux de type 'dog' depuis la table pets",
      owner_profiles: "Vue des profils propriétaires (role = 'owner')",
      sitter_profiles: "Vue des profils promeneurs (role = 'sitter')",
      walkers: "Vue étendue des promeneurs avec statistiques",
      user_documents: "Vue des documents utilisateurs",
      booking_media: "Vue unifiée des médias de réservation"
    },
    
    storage_buckets: {
      avatars: {
        public: true,
        description: "Photos de profil des utilisateurs",
        allowed_mime_types: ["image/jpeg", "image/png", "image/webp"]
      },
      "pet-photos": {
        public: true,
        description: "Photos des animaux de compagnie",
        allowed_mime_types: ["image/jpeg", "image/png", "image/webp"]
      },
      "service-photos": {
        public: false,
        description: "Photos prises pendant les services (RLS appliqué)",
        allowed_mime_types: ["image/jpeg", "image/png", "image/webp", "video/mp4"]
      },
      documents: {
        public: false,
        description: "Documents d'identité et certifications (RLS appliqué)",
        allowed_mime_types: ["application/pdf", "image/jpeg", "image/png"]
      }
    },
    
    roles_system: {
      description: "Système de rôles utilisateur",
      roles: {
        owner: "Propriétaire d'animaux - Peut créer des réservations",
        sitter: "Promeneur/Gardien - Peut accepter des réservations",
        admin: "Administrateur - Accès complet (via email hardcodé)"
      },
      admin_email: "dogwalking94@gmail.com",
      note: "IMPORTANT: Les rôles doivent être stockés dans une table séparée pour la sécurité. Actuellement stockés dans users.role"
    },
    
    authentication: {
      provider: "Supabase Auth (Email/Password)",
      email_confirmation: "Recommandé de désactiver en développement",
      password_requirements: "Minimum 6 caractères",
      session_management: "Tokens JWT avec refresh automatique"
    },
    
    functions: {
      get_public_profiles: {
        description: "Fonction SQL pour récupérer les profils publics",
        type: "SECURITY DEFINER",
        returns: "Liste des utilisateurs avec informations de base"
      }
    },
    
    integration_guide: {
      step1: "Créer un nouveau projet Supabase",
      step2: "Exécuter toutes les migrations SQL depuis supabase/migrations/",
      step3: "Configurer les storage buckets avec les politiques RLS appropriées",
      step4: "Mettre à jour les variables d'environnement: VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY",
      step5: "Importer ce fichier de configuration comme référence",
      step6: "Configurer l'authentification email dans les paramètres Supabase",
      step7: "CRITIQUE: Migrer le système de rôles vers une table dédiée user_roles"
    },
    
    security_notes: [
      "RLS activé sur toutes les tables sensibles",
      "Les storage buckets documents et service-photos ont des politiques RLS strictes",
      "L'admin est vérifié côté serveur via email hardcodé (à migrer vers user_roles)",
      "Les tokens d'authentification sont gérés automatiquement par Supabase",
      "ATTENTION: Migrer les rôles vers une table dédiée pour éviter les escalades de privilèges"
    ],
    
    todo_critical: [
      "Créer une table user_roles séparée avec enum app_role",
      "Migrer la vérification admin vers la table user_roles avec fonction SECURITY DEFINER",
      "Implémenter le système de paiement Stripe",
      "Configurer les webhooks Stripe pour les paiements",
      "Ajouter les notifications push (email/SMS)",
      "Compléter l'intégration GPS en temps réel"
    ]
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(configurationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'supabase-configuration.json';
    link.click();
    toast.success('Configuration téléchargée en JSON');
  };

  const downloadMarkdown = () => {
    let markdown = `# Configuration Supabase - DogWalking Platform\n\n`;
    markdown += `**Date de génération:** ${new Date().toLocaleString('fr-FR')}\n\n`;
    
    markdown += `## 📋 Informations du Projet\n\n`;
    markdown += `- **Project ID:** ${configurationData.project_info.project_id}\n`;
    markdown += `- **Supabase URL:** ${configurationData.project_info.supabase_url}\n`;
    markdown += `- **Anon Key:** ${configurationData.project_info.anon_key}\n\n`;
    
    markdown += `## 🗄️ Tables de la Base de Données\n\n`;
    Object.entries(configurationData.tables).forEach(([tableName, tableInfo]: [string, any]) => {
      markdown += `### ${tableName}\n\n`;
      markdown += `**Description:** ${tableInfo.description}\n\n`;
      markdown += `**Colonnes:**\n`;
      Object.entries(tableInfo.columns).forEach(([colName, colType]) => {
        markdown += `- \`${colName}\`: ${colType}\n`;
      });
      markdown += `\n**Politiques RLS:**\n`;
      tableInfo.rls_policies.forEach((policy: string) => {
        markdown += `- ${policy}\n`;
      });
      markdown += `\n`;
    });
    
    markdown += `## 👁️ Vues\n\n`;
    Object.entries(configurationData.views).forEach(([viewName, description]) => {
      markdown += `- **${viewName}:** ${description}\n`;
    });
    
    markdown += `\n## 📦 Storage Buckets\n\n`;
    Object.entries(configurationData.storage_buckets).forEach(([bucketName, bucketInfo]: [string, any]) => {
      markdown += `### ${bucketName}\n\n`;
      markdown += `- **Public:** ${bucketInfo.public ? 'Oui' : 'Non'}\n`;
      markdown += `- **Description:** ${bucketInfo.description}\n`;
      markdown += `- **Types MIME autorisés:** ${bucketInfo.allowed_mime_types.join(', ')}\n\n`;
    });
    
    markdown += `## 👥 Système de Rôles\n\n`;
    markdown += `${configurationData.roles_system.description}\n\n`;
    Object.entries(configurationData.roles_system.roles).forEach(([role, desc]) => {
      markdown += `- **${role}:** ${desc}\n`;
    });
    markdown += `\n**Email Admin:** ${configurationData.roles_system.admin_email}\n`;
    markdown += `\n⚠️ **Note:** ${configurationData.roles_system.note}\n\n`;
    
    markdown += `## 🔐 Authentification\n\n`;
    Object.entries(configurationData.authentication).forEach(([key, value]) => {
      markdown += `- **${key}:** ${value}\n`;
    });
    
    markdown += `\n## ⚙️ Fonctions\n\n`;
    Object.entries(configurationData.functions).forEach(([funcName, funcInfo]: [string, any]) => {
      markdown += `### ${funcName}\n\n`;
      markdown += `- **Description:** ${funcInfo.description}\n`;
      markdown += `- **Type:** ${funcInfo.type}\n`;
      markdown += `- **Retourne:** ${funcInfo.returns}\n\n`;
    });
    
    markdown += `## 🚀 Guide d'Intégration\n\n`;
    Object.entries(configurationData.integration_guide).forEach(([step, instruction]) => {
      markdown += `${step.replace('step', '')}. ${instruction}\n`;
    });
    
    markdown += `\n## 🔒 Notes de Sécurité\n\n`;
    configurationData.security_notes.forEach((note: string) => {
      markdown += `- ${note}\n`;
    });
    
    markdown += `\n## ⚠️ TODO Critique\n\n`;
    configurationData.todo_critical.forEach((item: string) => {
      markdown += `- [ ] ${item}\n`;
    });
    
    const dataBlob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'supabase-configuration.md';
    link.click();
    toast.success('Configuration téléchargée en Markdown');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration Supabase - Rapport Complet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Ce rapport contient toutes les informations de configuration de votre base de données Supabase,
            incluant les tables, colonnes, politiques RLS, storage buckets, rôles et guides d'intégration.
          </p>
          
          <div className="flex gap-4">
            <Button onClick={downloadJSON} className="gap-2">
              <FileJson className="h-4 w-4" />
              Télécharger JSON
            </Button>
            <Button onClick={downloadMarkdown} variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Télécharger Markdown
            </Button>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Aperçu du contenu:</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Informations du projet (ID, URL, clés)</li>
              <li>14 tables avec colonnes et politiques RLS</li>
              <li>6 vues de base de données</li>
              <li>4 storage buckets avec configurations</li>
              <li>Système de rôles et authentification</li>
              <li>Fonctions SQL de sécurité</li>
              <li>Guide d'intégration étape par étape</li>
              <li>Notes de sécurité importantes</li>
              <li>Liste des tâches critiques à accomplir</li>
            </ul>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              ⚠️ <strong>Important:</strong> Ce rapport contient des clés sensibles. Ne partagez ce fichier que dans un environnement sécurisé.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques de Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">14</div>
              <div className="text-sm text-muted-foreground">Tables</div>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">6</div>
              <div className="text-sm text-muted-foreground">Vues</div>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">4</div>
              <div className="text-sm text-muted-foreground">Storage Buckets</div>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Rôles Utilisateur</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
