import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Euro, Users, Dog } from 'lucide-react';

interface StatsChartProps {
  data: {
    bookingsOverTime: { date: string; count: number; revenue: number }[];
    statusDistribution: { name: string; value: number }[];
    topDogs: { name: string; walks: number }[];
  };
  title?: string;
  type?: 'area' | 'bar' | 'pie';
}

const COLORS = ['hsl(142, 76%, 36%)', 'hsl(200, 98%, 39%)', 'hsl(45, 93%, 47%)', 'hsl(0, 84%, 60%)', 'hsl(280, 65%, 60%)'];

export const StatsChart = ({ data, title = "Statistiques", type = 'area' }: StatsChartProps) => {
  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data.bookingsOverTime}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(200, 98%, 39%)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(200, 98%, 39%)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="date" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Area 
          type="monotone" 
          dataKey="revenue" 
          stroke="hsl(142, 76%, 36%)" 
          fillOpacity={1} 
          fill="url(#colorRevenue)" 
          name="Revenus (€)"
        />
        <Area 
          type="monotone" 
          dataKey="count" 
          stroke="hsl(200, 98%, 39%)" 
          fillOpacity={1} 
          fill="url(#colorCount)" 
          name="Réservations"
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data.topDogs}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="name" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Bar dataKey="walks" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Promenades" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data.statusDistribution}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.statusDistribution.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Aperçu de vos statistiques</CardDescription>
      </CardHeader>
      <CardContent>
        {type === 'area' && renderAreaChart()}
        {type === 'bar' && renderBarChart()}
        {type === 'pie' && renderPieChart()}
      </CardContent>
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  icon?: React.ReactNode;
}

export const StatCard = ({ title, value, description, trend, icon }: StatCardProps) => {
  const isPositive = trend && trend > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon || <Calendar className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend !== undefined) && (
          <div className="flex items-center text-xs text-muted-foreground">
            {trend !== undefined && (
              <span className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                <TrendIcon className="h-3 w-3 mr-1" />
                {Math.abs(trend)}%
              </span>
            )}
            {description && <span className="ml-1">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
