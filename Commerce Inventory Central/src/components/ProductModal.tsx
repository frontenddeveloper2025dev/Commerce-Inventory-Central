import React from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import ProductForm from './ProductForm';

interface Product {
  id: string;
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

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  mode: 'create' | 'edit' | 'duplicate';
  onSubmit: (product: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  mode,
  onSubmit
}) => {
  const handleSubmit = (productData: Product) => {
    onSubmit(productData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <span>Product Form</span>
        </DialogHeader>
        <ProductForm
          product={product}
          onSubmit={handleSubmit}
          onCancel={onClose}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;