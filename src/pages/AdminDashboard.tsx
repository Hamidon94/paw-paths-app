import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Users, UserCog, FileCheck, DollarSign, MessageSquare, Gift, Ticket, FileText, Shield, Home } from 'lucide-react';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminDocuments } from '@/components/admin/AdminDocuments';
import { AdminPayments } from '@/components/admin/AdminPayments';
import { AdminReviews } from '@/components/admin/AdminReviews';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminWalkers } from '@/components/admin/AdminWalkers';
import { AdminPromotions } from '@/components/admin/AdminPromotions';
import { AdminSupport } from '@/components/admin/AdminSupport';
import { AdminBlog } from '@/components/admin/AdminBlog';
import { AdminProtection } from '@/components/AdminProtection';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  return (
    <AdminProtection>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Administration PawPaths
                </h1>
                <p className="text-muted-foreground mt-1">Tableau de bord centralisé</p>
              </div>
              <Button variant="outline" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                Retour au site
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-2 h-auto bg-muted/50 p-2">
              <TabsTrigger value="dashboard" className="flex-col h-auto py-3">
                <LayoutDashboard className="w-4 h-4 mb-1" />
                <span className="text-xs">Tableau de bord</span>
              </TabsTrigger>
              <TabsTrigger value="walkers" className="flex-col h-auto py-3">
                <UserCog className="w-4 h-4 mb-1" />
                <span className="text-xs">Promeneurs</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex-col h-auto py-3">
                <Users className="w-4 h-4 mb-1" />
                <span className="text-xs">Propriétaires</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex-col h-auto py-3">
                <FileCheck className="w-4 h-4 mb-1" />
                <span className="text-xs">Documents</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex-col h-auto py-3">
                <DollarSign className="w-4 h-4 mb-1" />
                <span className="text-xs">Paiements</span>
              </TabsTrigger>
              <TabsTrigger value="promotions" className="flex-col h-auto py-3">
                <Gift className="w-4 h-4 mb-1" />
                <span className="text-xs">Promotions</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex-col h-auto py-3">
                <MessageSquare className="w-4 h-4 mb-1" />
                <span className="text-xs">Avis</span>
              </TabsTrigger>
              <TabsTrigger value="support" className="flex-col h-auto py-3">
                <Ticket className="w-4 h-4 mb-1" />
                <span className="text-xs">Support</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex-col h-auto py-3">
                <FileText className="w-4 h-4 mb-1" />
                <span className="text-xs">Blog</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-col h-auto py-3">
                <Shield className="w-4 h-4 mb-1" />
                <span className="text-xs">Paramètres</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <AdminStats />
            </TabsContent>

            <TabsContent value="walkers">
              <AdminWalkers />
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

            <TabsContent value="promotions">
              <AdminPromotions />
            </TabsContent>

            <TabsContent value="reviews">
              <AdminReviews />
            </TabsContent>

            <TabsContent value="support">
              <AdminSupport />
            </TabsContent>

            <TabsContent value="blog">
              <AdminBlog />
            </TabsContent>

            <TabsContent value="settings">
              <AdminSettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminProtection>
  );
};

export default AdminDashboard;
