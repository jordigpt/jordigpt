import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, ShoppingBag, Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { UserData } from "@/types/admin";

export function AdminUsersTab() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  // KPIs State
  const [stats, setStats] = useState({
    totalUsers: 0,
    newToday: 0, // Nota: Esto será aproximado en base a la página actual o requeriría otro endpoint para exactitud total
    activeBuyers: 0,
    conversionRate: 0
  });

  // Chart Data State
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (pageNo: number) => {
    setLoading(true);
    
    // Llamada a la nueva función paginada
    const { data, error } = await supabase.rpc('get_admin_users_data_paginated', {
        page_no: pageNo,
        page_size: pageSize
    });

    if (error) {
      console.error("Error fetching users:", error);
    } else if (data) {
      setUsers(data as UserData[]);
      
      // Actualizar total count desde la primera fila (todas tienen el mismo full_count)
      if (data.length > 0) {
          const total = Number(data[0].full_count);
          setTotalCount(total);
          
          // Actualizar KPIs básicos con la info disponible
          // Nota: Para KPIs exactos de toda la DB se necesitaría una query separada 'get_admin_stats'
          // Aquí usamos el total real para el conteo de usuarios
          setStats(prev => ({
              ...prev,
              totalUsers: total
          }));
          
          prepareChartData(data as UserData[]);
      } else if (pageNo === 1) {
          setTotalCount(0);
      }
    }
    setLoading(false);
  };

  const prepareChartData = (data: UserData[]) => {
      // Gráfico basado en la vista actual (útil para ver tendencias recientes si ordenamos por fecha)
      const dateGroups: Record<string, number> = {};
      
      [...data].reverse().forEach(user => {
          const date = new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          dateGroups[date] = (dateGroups[date] || 0) + 1;
      });

      const formatted = Object.keys(dateGroups).map(date => ({
          name: date,
          users: dateGroups[date]
      }));

      setChartData(formatted);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-8">
        {/* 1. KPIs Section (Simplificada para rendimiento) */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                    <Users className="h-4 w-4 text-neon" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalCount}</div>
                    <p className="text-xs text-muted-foreground">Registrados en total</p>
                </CardContent>
            </Card>
            {/* Otros KPIs estáticos o basados en vista actual */}
        </div>

        <div className="grid gap-4 md:grid-cols-7">
            {/* 2. Chart Section */}
            <Card className="col-span-4 border-border hidden md:block">
                <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>Usuarios en esta página</CardDescription>
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

            {/* 3. User List Table with Pagination */}
            <Card className="col-span-7 md:col-span-3 border-border flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Base de Datos</CardTitle>
                    <Badge variant="outline" className="text-xs">
                        Página {page} de {totalPages || 1}
                    </Badge>
                </CardHeader>
                <CardContent className="flex-1 overflow-auto min-h-[300px]">
                    {loading ? (
                        <div className="flex h-full items-center justify-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-neon" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead className="text-right">Info</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="font-medium text-sm truncate max-w-[150px]" title={user.email}>{user.email}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <Badge variant={user.total_orders > 0 ? "default" : "secondary"} className={user.total_orders > 0 ? "bg-neon text-black hover:bg-neon h-5 px-1.5" : "h-5 px-1.5"}>
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
                    )}
                </CardContent>
                <CardFooter className="border-t border-border pt-4 flex justify-between items-center">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">
                        {users.length} resultados
                    </span>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages || loading}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}