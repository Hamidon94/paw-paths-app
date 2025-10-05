import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileCheck, DollarSign, MessageSquare, TrendingUp, Shield } from 'lucide-react';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminDocuments } from '@/components/admin/AdminDocuments';
import { AdminPayments } from '@/components/admin/AdminPayments';
import { AdminReviews } from '@/components/admin/AdminReviews';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminSettings } from '@/components/admin/AdminSettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Administration</h1>
        <p className="text-muted-foreground">Gestion de la plateforme PawPaths</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="stats">
            <TrendingUp className="w-4 h-4 mr-2" />
            Statistiques
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileCheck className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="payments">
            <DollarSign className="w-4 h-4 mr-2" />
            Paiements
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <MessageSquare className="w-4 h-4 mr-2" />
            Avis
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Shield className="w-4 h-4 mr-2" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <AdminStats />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>

        <TabsContent value="documents">
          <AdminDocuments />
        </TabsContent>

        <TabsContent value="payments">
          <AdminPayments />
        </TabsContent>

        <TabsContent value="reviews">
          <AdminReviews />
        </TabsContent>

        <TabsContent value="settings">
          <AdminSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
