import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
  Target,
  Award,
  AlertTriangle,
  Zap,
  RefreshCw
} from 'lucide-react';

interface BestsellerProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  totalSold: number;
  revenue: number;
  unitPrice: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
  profitMargin: number;
  stockRemaining: number;
}

interface InventoryReport {
  period: string;
  totalItems: number;
  totalValue: number;
  turnoverRate: number;
  lowStockItems: number;
  deadStock: number;
  fastMovingItems: number;
}

interface SalesMetric {
  period: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
  topCategory: string;
  growth: number;
}

export default function ReportsPage() {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('bestsellers');

  // Mock bestselling products data
  const bestsellingProducts: BestsellerProduct[] = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      sku: 'WHD-001',
      category: 'Electronics',
      totalSold: 156,
      revenue: 31200,
      unitPrice: 200,
      trend: 'up',
      trendPercent: 23.5,
      profitMargin: 35,
      stockRemaining: 15
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      sku: 'WAT-004',
      category: 'Electronics',
      totalSold: 98,
      revenue: 24500,
      unitPrice: 250,
      trend: 'up',
      trendPercent: 15.8,
      profitMargin: 42,
      stockRemaining: 85
    },
    {
      id: '3',
      name: 'Designer Laptop Bag',
      sku: 'BAG-003',
      category: 'Accessories',
      totalSold: 89,
      revenue: 8900,
      unitPrice: 100,
      trend: 'stable',
      trendPercent: 2.1,
      profitMargin: 28,
      stockRemaining: 45
    },
    {
      id: '4',
      name: 'Organic Coffee Beans',
      sku: 'COF-002',
      category: 'Food & Beverage',
      totalSold: 245,
      revenue: 6125,
      unitPrice: 25,
      trend: 'down',
      trendPercent: -8.3,
      profitMargin: 45,
      stockRemaining: 5
    },
    {
      id: '5',
      name: 'Artisan Ceramic Mug',
      sku: 'MUG-005',
      category: 'Home & Kitchen',
      totalSold: 67,
      revenue: 1675,
      unitPrice: 25,
      trend: 'up',
      trendPercent: 12.4,
      profitMargin: 38,
      stockRemaining: 30
    }
  ];

  // Mock inventory reports data
  const inventoryReports: InventoryReport[] = [
    {
      period: '7d',
      totalItems: 5,
      totalValue: 29610,
      turnoverRate: 3.2,
      lowStockItems: 2,
      deadStock: 0,
      fastMovingItems: 3
    },
    {
      period: '30d',
      totalItems: 5,
      totalValue: 29610,
      turnoverRate: 2.8,
      lowStockItems: 2,
      deadStock: 1,
      fastMovingItems: 2
    },
    {
      period: '90d',
      totalItems: 5,
      totalValue: 29610,
      turnoverRate: 2.5,
      lowStockItems: 2,
      deadStock: 1,
      fastMovingItems: 2
    }
  ];

  // Mock sales metrics
  const salesMetrics: SalesMetric[] = [
    {
      period: '7d',
      revenue: 18750,
      orders: 45,
      averageOrderValue: 416.67,
      topCategory: 'Electronics',
      growth: 15.2
    },
    {
      period: '30d',
      revenue: 72400,
      orders: 178,
      averageOrderValue: 406.74,
      topCategory: 'Electronics',
      growth: 8.7
    },
    {
      period: '90d',
      revenue: 185600,
      orders: 456,
      averageOrderValue: 407.02,
      topCategory: 'Electronics',
      growth: 12.3
    }
  ];

  const currentReport = inventoryReports.find(r => r.period === selectedPeriod) || inventoryReports[1];
  const currentMetrics = salesMetrics.find(m => m.period === selectedPeriod) || salesMetrics[1];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: "Your report has been exported successfully.",
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "All reporting data has been updated with the latest information.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Inventory Reports & Analytics</h2>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMetrics.revenue.toLocaleString()}</div>
            <p className={`text-xs flex items-center gap-1 ${
              currentMetrics.growth > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {currentMetrics.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(currentMetrics.growth)}% from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentReport.turnoverRate}x</div>
            <p className="text-xs text-muted-foreground">
              Average turnover rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fast Moving Items</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{currentReport.fastMovingItems}</div>
            <p className="text-xs text-muted-foreground">
              High demand products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMetrics.averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {currentMetrics.orders} orders total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bestsellers">Bestselling Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends & Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="bestsellers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Top Performing Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bestsellingProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          #{index + 1}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{product.name}</h4>
                          <Badge variant="outline">{product.sku}</Badge>
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{product.totalSold} units sold</span>
                          <span>•</span>
                          <span>{product.stockRemaining} remaining</span>
                          <span>•</span>
                          <span>{product.profitMargin}% margin</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="font-bold text-lg">${product.revenue.toLocaleString()}</div>
                      <div className={`flex items-center gap-1 text-sm ${getTrendColor(product.trend)}`}>
                        {getTrendIcon(product.trend)}
                        {product.trendPercent > 0 ? '+' : ''}{product.trendPercent}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Health */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Health Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fast Moving Items</span>
                    <span className="font-medium text-green-600">{currentReport.fastMovingItems}</span>
                  </div>
                  <Progress value={(currentReport.fastMovingItems / currentReport.totalItems) * 100} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Low Stock Items</span>
                    <span className="font-medium text-yellow-600">{currentReport.lowStockItems}</span>
                  </div>
                  <Progress value={(currentReport.lowStockItems / currentReport.totalItems) * 100} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Dead Stock Items</span>
                    <span className="font-medium text-red-600">{currentReport.deadStock}</span>
                  </div>
                  <Progress value={(currentReport.deadStock / currentReport.totalItems) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                    <div>
                      <div className="font-medium">Electronics</div>
                      <div className="text-sm text-muted-foreground">Top performing category</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">$55,700</div>
                      <div className="text-sm text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        +19.2%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Accessories</div>
                      <div className="text-sm text-muted-foreground">Steady performance</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">$8,900</div>
                      <div className="text-sm text-gray-600">+2.1%</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Food & Beverage</div>
                      <div className="text-sm text-muted-foreground">Needs attention</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">$6,125</div>
                      <div className="text-sm text-red-600 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        -8.3%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Key Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Strong Electronics Performance</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Electronics category shows 19.2% growth. Consider expanding this category with complementary products.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Low Stock Alert</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Organic Coffee Beans critically low (5 units). High demand but insufficient stock may lead to lost sales.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Inventory Optimization</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Smart Fitness Watch showing overstock. Consider promotional pricing to improve turnover rate.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800">Revenue Opportunity</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      Average order value increased to $407. Focus on upselling and cross-selling strategies.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>This Period Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Orders</span>
                  <span className="font-medium">{currentMetrics.orders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue Growth</span>
                  <span className={`font-medium ${currentMetrics.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currentMetrics.growth > 0 ? '+' : ''}{currentMetrics.growth}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Inventory Value</span>
                  <span className="font-medium">${currentReport.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Top Category</span>
                  <span className="font-medium">{currentMetrics.topCategory}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Reorder Coffee Beans (Critical)
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Review Headphone pricing strategy
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Create promotion for Fitness Watch
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Expand Electronics inventory
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}