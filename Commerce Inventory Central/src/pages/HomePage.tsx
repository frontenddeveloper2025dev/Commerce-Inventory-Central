import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  Package,
  DollarSign,
  ShoppingCart,
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Loader2
} from 'lucide-react';
import { useAppStore } from '@/store/app-store';
import { Product, Order, dataService } from '@/lib/data-service';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const { dashboardStats, loadDashboardStats } = useAppStore();
  const { toast } = useToast();
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [bestsellingProducts, setBestsellingProducts] = useState<Array<{
    product: Product;
    totalSold: number;
    revenue: number;
  }>>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load dashboard stats
      await loadDashboardStats();
      
      // Load additional data for widgets
      const [lowStock, bestsellers, pending] = await Promise.all([
        dataService.products.getLowStockProducts(),
        dataService.analytics.getBestsellingProducts(4),
        dataService.orders.getOrdersByStatus('pending')
      ]);

      setLowStockProducts(lowStock.slice(0, 3)); // Show only top 3
      setBestsellingProducts(bestsellers);
      setPendingOrders(pending.slice(0, 3)); // Show only top 3
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const parseOrderItems = (itemsJson: string) => {
    try {
      const items = JSON.parse(itemsJson);
      return Array.isArray(items) ? items.length : 0;
    } catch {
      return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Overview Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,349</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-warning flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +23%
              </span>
              from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$54,231</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8%
              </span>
              from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,832</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -3%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Inventory Alerts Widget */}
        <Card className="col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-warning" />
                Inventory Alerts
              </CardTitle>
              <Badge variant="destructive">{inventoryAlerts.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventoryAlerts.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product}</p>
                    <p className="text-xs text-muted-foreground">
                      Stock: {item.stock} / Threshold: {item.threshold}
                    </p>
                  </div>
                  <Badge variant={item.status === 'critical' ? 'destructive' : 'secondary'}>
                    {item.status === 'critical' ? 'Critical' : 'Low'}
                  </Badge>
                </div>
              ))}
              <Button className="w-full mt-3" variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bestselling Products Widget */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-success" />
              Bestselling Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bestsellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sales} sales · ${product.revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {product.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
              <Button className="w-full mt-3" variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Full Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Orders Widget */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-warning" />
                Pending Orders
              </div>
              <Badge variant="secondary">{pendingOrders.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{order.id}</p>
                      <Badge 
                        variant="outline" 
                        className={
                          order.priority === 'high' 
                            ? 'bg-red-100 text-red-800 border-red-200' 
                            : 'bg-blue-100 text-blue-800 border-blue-200'
                        }
                      >
                        {order.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.items} items · {order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${order.total.toFixed(2)}</p>
                    <Button size="sm" className="mt-1">
                      Process
                    </Button>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-3" variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Row */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col space-y-2">
              <Package className="h-6 w-6" />
              <span>Add Product</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ShoppingCart className="h-6 w-6" />
              <span>New Order</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <AlertTriangle className="h-6 w-6" />
              <span>Stock Alert</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HomePage 