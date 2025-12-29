import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, User, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminOrder, Product } from "@/types/admin";

interface AdminOrdersTabProps {
  products: Product[];
}

export function AdminOrdersTab({ products }: AdminOrdersTabProps) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (pageNo: number) => {
    setLoading(true);
    const { data: ordersData, error: ordersError } = await supabase
        .rpc('get_admin_orders_paginated', {
            page_no: pageNo,
            page_size: pageSize
        });
        
    if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        toast({ title: "Error loading orders", description: ordersError.message, variant: "destructive" });
    } else if (ordersData) {
        setOrders(ordersData as AdminOrder[]);
        if (ordersData.length > 0) {
            setTotalCount(Number(ordersData[0].full_count));
        } else if (pageNo === 1) {
            setTotalCount(0);
        }
    }
    setLoading(false);
  };

  const getProductTitle = (id: string) => {
      const p = products.find(p => p.id === id);
      return p ? p.title : id;
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-neon" /> Historial de Ventas
            </CardTitle>
            <Badge variant="outline">
                Total: {totalCount}
            </Badge>
        </CardHeader>
        <CardContent>
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-neon" />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Monto</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                                    No hay ventas registradas.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {new Date(order.created_at).toLocaleDateString()} <br/>
                                        {new Date(order.created_at).toLocaleTimeString()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="bg-muted p-1 rounded-full">
                                                <User className="w-3 h-3 text-muted-foreground" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{order.user_email || "Anon/No Email"}</span>
                                                {(order.first_name || order.last_name) && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {order.first_name} {order.last_name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[200px] truncate" title={getProductTitle(order.product_id)}>
                                        {getProductTitle(order.product_id)}
                                    </TableCell>
                                    <TableCell className="text-neon font-mono">${order.amount}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === 'approved' ? 'default' : 'secondary'} className={order.status === 'approved' ? 'bg-green-500 hover:bg-green-600' : ''}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-border pt-4">
             <div className="text-xs text-muted-foreground">
                 Página {page} de {totalPages || 1}
             </div>
             <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                >
                    Siguiente <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
             </div>
        </CardFooter>
    </Card>
  );
}