import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Package2, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  BarChart3,
  RefreshCw,
  History,
  Package,
  ShoppingCart,
  Truck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Edit3,
  RotateCcw
} from 'lucide-react';

interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  stockValue: number;
  location: string;
  lastUpdated: string;
  status: 'optimal' | 'low' | 'critical' | 'overstock';
  supplier: string;
  leadTime: number;
}

interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  timestamp: string;
  user: string;
}

export default function InventoryPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock inventory data
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      productName: 'Premium Wireless Headphones',
      sku: 'WHD-001',
      category: 'Electronics',
      currentStock: 15,
      minStock: 20,
      maxStock: 100,
      stockValue: 2985,
      location: 'A-1-01',
      lastUpdated: '2024-01-15 14:30',
      status: 'low',
      supplier: 'TechCorp Inc.',
      leadTime: 7
    },
    {
      id: '2',
      productName: 'Organic Coffee Beans',
      sku: 'COF-002',
      category: 'Food & Beverage',
      currentStock: 5,
      minStock: 10,
      maxStock: 50,
      stockValue: 125,
      location: 'B-2-03',
      lastUpdated: '2024-01-15 09:45',
      status: 'critical',
      supplier: 'Organic Farms Co.',
      leadTime: 3
    },
    {
      id: '3',
      productName: 'Designer Laptop Bag',
      sku: 'BAG-003',
      category: 'Accessories',
      currentStock: 45,
      minStock: 15,
      maxStock: 60,
      stockValue: 4500,
      location: 'C-1-02',
      lastUpdated: '2024-01-15 11:20',
      status: 'optimal',
      supplier: 'Fashion Hub Ltd.',
      leadTime: 5
    },
    {
      id: '4',
      productName: 'Smart Fitness Watch',
      sku: 'WAT-004',
      category: 'Electronics',
      currentStock: 85,
      minStock: 25,
      maxStock: 80,
      stockValue: 21250,
      location: 'A-2-01',
      lastUpdated: '2024-01-15 16:00',
      status: 'overstock',
      supplier: 'SmartTech Solutions',
      leadTime: 10
    },
    {
      id: '5',
      productName: 'Artisan Ceramic Mug',
      sku: 'MUG-005',
      category: 'Home & Kitchen',
      currentStock: 30,
      minStock: 20,
      maxStock: 100,
      stockValue: 750,
      location: 'D-1-01',
      lastUpdated: '2024-01-14 13:15',
      status: 'optimal',
      supplier: 'Artisan Crafts',
      leadTime: 14
    }
  ];

  const stockMovements: StockMovement[] = [
    {
      id: '1',
      productId: '1',
      productName: 'Premium Wireless Headphones',
      type: 'out',
      quantity: 5,
      reason: 'Order fulfillment',
      timestamp: '2024-01-15 14:30',
      user: 'John Smith'
    },
    {
      id: '2',
      productId: '2',
      productName: 'Organic Coffee Beans',
      type: 'out',
      quantity: 8,
      reason: 'Order fulfillment',
      timestamp: '2024-01-15 09:45',
      user: 'Sarah Johnson'
    },
    {
      id: '3',
      productId: '4',
      productName: 'Smart Fitness Watch',
      type: 'in',
      quantity: 50,
      reason: 'New shipment received',
      timestamp: '2024-01-15 08:00',
      user: 'Mike Wilson'
    },
    {
      id: '4',
      productId: '3',
      productName: 'Designer Laptop Bag',
      type: 'adjustment',
      quantity: -2,
      reason: 'Damaged items removed',
      timestamp: '2024-01-14 16:20',
      user: 'Emma Davis'
    }
  ];

  // Filter inventory items based on search
  const filteredItems = useMemo(() => {
    return inventoryItems.filter(item =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Calculate inventory statistics
  const inventoryStats = useMemo(() => {
    const totalItems = inventoryItems.length;
    const totalValue = inventoryItems.reduce((sum, item) => sum + item.stockValue, 0);
    const lowStockItems = inventoryItems.filter(item => item.status === 'low' || item.status === 'critical').length;
    const overstockItems = inventoryItems.filter(item => item.status === 'overstock').length;
    
    return {
      totalItems,
      totalValue,
      lowStockItems,
      overstockItems,
      optimalItems: totalItems - lowStockItems - overstockItems
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500 text-white';
      case 'low': return 'bg-yellow-500 text-white';
      case 'optimal': return 'bg-green-500 text-white';
      case 'overstock': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStockLevel = (current: number, min: number, max: number) => {
    const percentage = (current / max) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  const getStockLevelColor = (current: number, min: number) => {
    if (current <= min * 0.5) return 'bg-red-500';
    if (current <= min) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleStockUpdate = (itemId: string, action: string) => {
    toast({
      title: "Stock Updated",
      description: `Stock ${action} has been processed successfully.`,
    });
  };

  const handleRefreshInventory = () => {
    toast({
      title: "Inventory Refreshed",
      description: "All inventory data has been updated from the latest sources.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefreshInventory}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => handleStockUpdate('', 'adjustment')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Inventory Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Active inventory items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${inventoryStats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Current stock value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimal Stock</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{inventoryStats.optimalItems}</div>
            <p className="text-xs text-muted-foreground">
              Items in good range
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Stock Overview</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="alerts">Inventory Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products, SKU, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredItems.length} of {inventoryItems.length} items
            </div>
          </div>

          {/* Inventory Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{item.productName}</h4>
                          <Badge variant="outline">{item.sku}</Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.category} • Location: {item.location} • Supplier: {item.supplier}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={() => handleStockUpdate(item.id, 'adjustment')}>
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleStockUpdate(item.id, 'reorder')}>
                          <RotateCcw className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Stock Level</span>
                          <span className="font-medium">{item.currentStock} / {item.maxStock}</span>
                        </div>
                        <Progress 
                          value={getStockLevel(item.currentStock, item.minStock, item.maxStock)} 
                          className="h-2"
                        />
                        <div className="text-xs text-muted-foreground">
                          Min: {item.minStock} • Lead time: {item.leadTime} days
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Stock Value</div>
                        <div className="text-lg font-bold text-primary">${item.stockValue.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          Last updated: {item.lastUpdated}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Status</div>
                        <div className="flex items-center gap-2">
                          {item.status === 'critical' && <AlertCircle className="h-4 w-4 text-red-500" />}
                          {item.status === 'low' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                          {item.status === 'optimal' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {item.status === 'overstock' && <Package2 className="h-4 w-4 text-blue-500" />}
                          <span className="text-sm capitalize">{item.status} Stock</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Stock Movements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        movement.type === 'in' ? 'bg-green-100 text-green-600' :
                        movement.type === 'out' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {movement.type === 'in' && <TrendingUp className="h-4 w-4" />}
                        {movement.type === 'out' && <ShoppingCart className="h-4 w-4" />}
                        {movement.type === 'adjustment' && <Edit3 className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-medium">{movement.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          {movement.reason} • {movement.user}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        movement.type === 'in' ? 'text-green-600' :
                        movement.type === 'out' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : '±'}{Math.abs(movement.quantity)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {movement.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <div className="grid gap-4">
            {/* Critical Stock Alerts */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Critical Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryItems.filter(item => item.status === 'critical').map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          Only {item.currentStock} left (Min: {item.minStock})
                        </div>
                      </div>
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
                        Reorder Now
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Warnings */}
            <Card className="border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-5 w-5" />
                  Low Stock Warnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryItems.filter(item => item.status === 'low').map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.currentStock} left (Min: {item.minStock}) • Lead time: {item.leadTime} days
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-yellow-600 text-yellow-600">
                        Schedule Reorder
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Overstock Alerts */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <Package2 className="h-5 w-5" />
                  Overstock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inventoryItems.filter(item => item.status === 'overstock').map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.currentStock} items (Max: {item.maxStock}) • Consider promotion
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-blue-600 text-blue-600">
                        Create Promotion
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}