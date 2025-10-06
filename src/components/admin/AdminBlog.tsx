import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Plus, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
}

export const AdminBlog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Données mockées en attendant la configuration de la table blog_posts
      const mockData: BlogPost[] = [
        {
          id: '1',
          title: 'Guide complet pour promener votre chien',
          slug: 'guide-promener-chien',
          excerpt: 'Découvrez nos meilleurs conseils pour des promenades réussies',
          category: 'Conseils',
          is_published: true,
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Les bienfaits de la promenade quotidienne',
          slug: 'bienfaits-promenade',
          excerpt: 'Pourquoi promener son chien chaque jour est essentiel',
          category: 'Santé',
          is_published: false,
          published_at: '',
          created_at: new Date().toISOString()
        }
      ];
      setPosts(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Erreur lors du chargement');
      setLoading(false);
    }
  };

  const togglePublish = async (postId: string, currentStatus: boolean) => {
    toast.info('Fonctionnalité en cours de développement');
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  const publishedPosts = posts.filter(p => p.is_published).length;
  const draftPosts = posts.filter(p => !p.is_published).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Articles</p>
                <div className="text-2xl font-bold">{posts.length}</div>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Publiés</p>
                <div className="text-2xl font-bold text-green-500">{publishedPosts}</div>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Brouillons</p>
                <div className="text-2xl font-bold text-orange-500">{draftPosts}</div>
              </div>
              <EyeOff className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Gestion du Blog
            </CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel article
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date de publication</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{post.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-md">
                        {post.excerpt}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{post.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={post.is_published ? 'default' : 'secondary'}>
                      {post.is_published ? 'Publié' : 'Brouillon'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {post.published_at 
                      ? new Date(post.published_at).toLocaleDateString()
                      : 'Non publié'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublish(post.id, post.is_published)}
                      >
                        {post.is_published ? (
                          <><EyeOff className="h-4 w-4 mr-1" /> Dépublier</>
                        ) : (
                          <><Eye className="h-4 w-4 mr-1" /> Publier</>
                        )}
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
