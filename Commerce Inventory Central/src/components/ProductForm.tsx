import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Check, Package, DollarSign, Info, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id?: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Inactive';
  supplier: string;
  description: string;
  weight: number;
  dimensions: string;
  minStock: number;
  maxStock: number;
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
  mode: 'create' | 'edit' | 'duplicate';
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel, mode }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Product>({
    name: product?.name || '',
    sku: product?.sku || (mode === 'duplicate' ? `${product?.sku}-copy` : ''),
    category: product?.category || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    status: product?.status || 'Active',
    supplier: product?.supplier || '',
    description: product?.description || '',
    weight: product?.weight || 0,
    dimensions: product?.dimensions || '',
    minStock: product?.minStock || 5,
    maxStock: product?.maxStock || 100,
  });

  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Product name, SKU, and category',
      icon: Package,
      fields: ['name', 'sku', 'category', 'supplier']
    },
    {
      id: 2,
      title: 'Pricing & Stock',
      description: 'Price and inventory levels',
      icon: DollarSign,
      fields: ['price', 'stock', 'minStock', 'maxStock']
    },
    {
      id: 3,
      title: 'Details',
      description: 'Description and specifications',
      icon: Info,
      fields: ['description', 'weight', 'dimensions']
    },
    {
      id: 4,
      title: 'Settings',
      description: 'Status and final review',
      icon: Settings,
      fields: ['status']
    }
  ];

  const handleInputChange = (field: keyof Product, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (stepId: number): boolean => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return false;

    for (const field of step.fields) {
      const value = formData[field as keyof Product];
      if (field === 'price' || field === 'stock' || field === 'weight' || field === 'minStock' || field === 'maxStock') {
        if (typeof value !== 'number' || value < 0) return false;
      } else {
        if (!value || (typeof value === 'string' && value.trim() === '')) return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData);
      toast({
        title: "Success",
        description: `Product ${mode === 'create' ? 'created' : mode === 'edit' ? 'updated' : 'duplicated'} successfully.`,
      });
    }
  };

  const getStepIcon = (step: typeof steps[0], index: number) => {
    const Icon = step.icon;
    const isCompleted = index + 1 < currentStep;
    const isCurrent = index + 1 === currentStep;
    
    return (
      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
        isCompleted 
          ? 'bg-primary border-primary text-primary-foreground' 
          : isCurrent 
          ? 'border-primary text-primary bg-primary/10' 
          : 'border-muted-foreground/30 text-muted-foreground'
      }`}>
        {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Enter SKU"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Input
                  id="supplier"
                  value={formData.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                  placeholder="Enter supplier name"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Current Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minStock">Minimum Stock Level *</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => handleInputChange('minStock', parseInt(e.target.value) || 0)}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStock">Maximum Stock Level *</Label>
                <Input
                  id="maxStock"
                  type="number"
                  min="0"
                  value={formData.maxStock}
                  onChange={(e) => handleInputChange('maxStock', parseInt(e.target.value) || 0)}
                  placeholder="100"
                />
              </div>
            </div>
            {formData.stock <= formData.minStock && formData.stock > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  ⚠️ Stock level is at or below minimum threshold. Consider restocking soon.
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Product Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter detailed product description"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions (L×W×H) *</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  placeholder="e.g., 10×5×3 cm"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="status">Product Status *</Label>
              <Select value={formData.status} onValueChange={(value: 'Active' | 'Inactive') => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Review Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Review Product Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <span className="ml-2 font-medium">{formData.name}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="ml-2 font-medium">{formData.sku}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-2">{formData.category}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Price:</span>
                  <span className="ml-2 font-medium">${formData.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Stock:</span>
                  <span className="ml-2">{formData.stock} units</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={formData.status === 'Active' ? 'default' : 'secondary'} className="ml-2">
                    {formData.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getFormTitle = () => {
    switch (mode) {
      case 'create': return 'Add New Product';
      case 'edit': return 'Edit Product';
      case 'duplicate': return 'Duplicate Product';
      default: return 'Product Form';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          {getFormTitle()}
        </CardTitle>
        <CardDescription>
          Follow the steps below to {mode === 'create' ? 'add a new product' : mode === 'edit' ? 'update the product' : 'create a duplicate'} to your inventory.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step Progress */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center space-y-2">
                {getStepIcon(step, index)}
                <div className="text-center">
                  <p className={`text-sm font-medium ${index + 1 === currentStep ? 'text-primary' : index + 1 < currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${index + 1 < currentStep ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            {currentStep < steps.length ? (
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                <Check className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Create Product' : mode === 'edit' ? 'Update Product' : 'Duplicate Product'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductForm;