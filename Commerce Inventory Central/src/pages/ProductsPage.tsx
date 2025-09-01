import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import ProductModal from '@/components/ProductModal';
import { useAppStore } from '@/store/app-store';
import { Product } from '@/lib/data-service';
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  Copy,
  Eye,
  AlertTriangle,
  Loader2
} from 'lucide-react';

type SortField = keyof Product;
type SortOrder = 'asc' | 'desc';

export default function ProductsPage() {
  const { toast } = useToast();
  const { 
    products, 
    productsLoading, 
    productFilters, 
    loadProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    setProductFilters 
  } = useAppStore();
  
  // State for sorting
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'duplicate'>('create');

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories.sort();
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = productFilters.search === '' || 
        product.name.toLowerCase().includes(productFilters.search.toLowerCase()) ||
        product.sku.toLowerCase().includes(productFilters.search.toLowerCase()) ||
        product.supplier.toLowerCase().includes(productFilters.search.toLowerCase());
      
      const matchesCategory = productFilters.category === '' || product.category === productFilters.category;
      const matchesStatus = productFilters.status === '' || 
                           (productFilters.status === 'Active' && product.status === 'Active') ||
                           (productFilters.status === 'Inactive' && product.status === 'Inactive') ||
                           (productFilters.status === 'Discontinued' && product.status === 'Discontinued') ||
                           (productFilters.status === 'low-stock' && product.current_stock <= product.min_stock);
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle numeric fields
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle string fields
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [products, productFilters, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getStockStatus = (product: Product) => {
    if (product.current_stock === 0) return 'out-of-stock';
    if (product.current_stock <= product.min_stock) return 'low-stock';
    if (product.current_stock >= product.max_stock) return 'overstock';
    return 'normal';
  };

  const getStockBadge = (product: Product) => {
    const status = getStockStatus(product);
    
    switch (status) {
      case 'out-of-stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      case 'low-stock':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      case 'overstock':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Overstock</Badge>;
      default:
        return <Badge variant="secondary" className="bg-green-100 text-green-800">In Stock</Badge>;
    }
  };

  const handleCreateProduct = () => {
    setSelectedProduct(undefined);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDuplicateProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('duplicate');
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!product._uid || !product._id) {
      toast({
        title: "Error",
        description: "Cannot delete product: missing required identifiers",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProduct(product._uid, product._id);
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  const handleProductSave = async (productData: Omit<Product, '_id' | '_uid' | 'created_at' | 'updated_at'>) => {
    try {
      if (modalMode === 'create' || modalMode === 'duplicate') {
        await createProduct(productData);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      } else if (modalMode === 'edit' && selectedProduct) {
        await updateProduct({
          ...selectedProduct,
          ...productData,
        });
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${modalMode === 'edit' ? 'update' : 'create'} product`,
        variant: "destructive",
      });
    }
  };

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and details
          </p>
        </div>
        <Button onClick={handleCreateProduct} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.status === 'Active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.current_stock <= p.min_stock).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${products.reduce((sum, p) => sum + (p.current_stock * p.price), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, SKU, or supplier..."
                  value={productFilters.search}
                  onChange={(e) => setProductFilters({ search: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select
              value={productFilters.category}
              onValueChange={(value) => setProductFilters({ category: value === 'all' ? '' : value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={productFilters.status}
              onValueChange={(value) => setProductFilters({ status: value === 'all' ? '' : value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Discontinued">Discontinued</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory ({filteredAndSortedProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Product {getSortIcon('name')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('sku')}
                  >
                    <div className="flex items-center gap-2">
                      SKU {getSortIcon('sku')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-2">
                      Category {getSortIcon('category')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-2">
                      Price {getSortIcon('price')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer select-none"
                    onClick={() => handleSort('current_stock')}
                  >
                    <div className="flex items-center gap-2">
                      Stock {getSortIcon('current_stock')}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProducts.length > 0 ? (
                  filteredAndSortedProducts.map((product) => (
                    <TableRow key={product._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.supplier}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{product.current_stock}</div>
                          <div className="text-muted-foreground">Min: {product.min_stock}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.status === 'Active' ? 'default' : 'secondary'}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStockBadge(product)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateProduct(product)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">No products found</p>
                        <Button onClick={handleCreateProduct}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Product
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Product Modal */}
      <ProductModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        product={selectedProduct}
        mode={modalMode}
        onSave={handleProductSave}
      />
    </div>
  );
}