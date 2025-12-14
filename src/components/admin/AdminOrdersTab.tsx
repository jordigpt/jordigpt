import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminOrder, Product } from "@/types/admin";

interface AdminOrdersTabProps {
  products: Product[];
}

export function AdminOrdersTab({ products }: AdminOrdersTabProps) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data: ordersData, error: ordersError } = await supabase
        .rpc('get_admin_orders');
        
    if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        toast({ title: "Error loading orders", description: ordersError.message, variant: "destructive" });
    } else {
        setOrders(ordersData || []);
    }
  };

  const getProductTitle = (id: string) => {
      const p = products.find(p => p.id === id);
      return p ? p.title : id;
  }

  return (
    <Card className="border-border">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-neon" /> Sales History
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                                No sales yet.
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
                                <TableCell className="font-medium">
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
        </CardContent>
    </Card>
  );
}