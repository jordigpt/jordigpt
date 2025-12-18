import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, ShoppingBag, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  first_name: string;
  last_name: string;
  total_orders: number;
  total_spend: number;
}

export function AdminUsersTab() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // KPIs State
  const [stats, setStats] = useState({
    totalUsers: 0,
    newToday: 0,
    activeBuyers: 0, // Han comprado/descargado al menos 1 vez
    conversionRate: 0
  });

  // Chart Data State
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_admin_users_data');

    if (error) {
      console.error("Error fetching users:", error);
    } else if (data) {
      setUsers(data);
      calculateStats(data);
      prepareChartData(data);
    }
    setLoading(false);
  };

  const calculateStats = (data: UserData[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const newUsers = data.filter(u => new Date(u.created_at).getTime() >= today).length;
    const buyers = data.filter(u => u.total_orders > 0).length;

    setStats({
      totalUsers: data.length,
      newToday: newUsers,
      activeBuyers: buyers,
      conversionRate: data.length > 0 ? (buyers / data.length) * 100 : 0
    });
  };

  const prepareChartData = (data: UserData[]) => {
      // Agrupar por fecha (últimos 7 días o días con actividad)
      const dateGroups: Record<string, number> = {};
      
      // Ordenar por fecha ascendente para el gráfico
      [...data].reverse().forEach(user => {
          const date = new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          dateGroups[date] = (dateGroups[date] || 0) + 1;
      });

      // Convertir a array
      const formatted = Object.keys(dateGroups).map(date => ({
          name: date,
          users: dateGroups[date]
      }));

      // Tomar los últimos 14 registros para que el gráfico no explote
      setChartData(formatted.slice(-14));
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
        {/* 1. KPIs Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                    <Users className="h-4 w-4 text-neon" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    <p className="text-xs text-muted-foreground">Registrados en la plataforma</p>
                </CardContent>
            </Card>
            
            <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nuevos Hoy</CardTitle>
                    <UserPlus className="h-4 w-4 text-neon" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.newToday}</div>
                    <p className="text-xs text-muted-foreground">Crecimiento diario</p>
                </CardContent>
            </Card>

            <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
                    <ShoppingBag className="h-4 w-4 text-neon" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activeBuyers}</div>
                    <p className="text-xs text-muted-foreground">Tienen al menos 1 producto</p>
                </CardContent>
            </Card>

            <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Conversión</CardTitle>
                    <Calendar className="h-4 w-4 text-neon" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">De usuario a cliente</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
            {/* 2. Chart Section */}
            <Card className="col-span-4 border-border">
                <CardHeader>
                    <CardTitle>Crecimiento de Usuarios</CardTitle>
                    <CardDescription>Nuevos registros por día</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                />
                                <YAxis 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    allowDecimals={false}
                                />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#d4e83a' }}
                                />
                                <Bar dataKey="users" fill="#d4e83a" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* 3. Recent Users / List Section */}
            <Card className="col-span-3 border-border flex flex-col">
                <CardHeader>
                    <CardTitle>Base de Datos</CardTitle>
                    <div className="flex items-center space-x-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="Buscar email..." 
                            className="h-8 bg-background/50" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto max-h-[400px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead className="text-right">Productos</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="font-medium text-sm">{user.email}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <Badge variant={user.total_orders > 0 ? "default" : "secondary"} className={user.total_orders > 0 ? "bg-neon text-black hover:bg-neon" : ""}>
                                                {user.total_orders} Items
                                            </Badge>
                                            {user.total_spend > 0 && (
                                                <span className="text-[10px] text-green-500 font-mono">
                                                    ${user.total_spend}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}