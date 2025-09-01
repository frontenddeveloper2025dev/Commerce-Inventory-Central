import { table } from '@devvai/devv-code-backend';

// Table IDs from the database
const TABLE_IDS = {
  products: 'ewq5x2jqyqdc',
  orders: 'ewq5xod91c00',
  inventory_movements: 'ewq5y91ma1hc',
  suppliers: 'ewq5ymtl45xc',
  staff_users: 'ewq5z1qhahhc'
} as const;

// Product interfaces
export interface Product {
  _id?: string;
  _uid?: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  current_stock: number;
  min_stock: number;
  max_stock: number;
  reserved_stock: number;
  weight: number;
  dimensions: string;
  status: 'Active' | 'Inactive' | 'Discontinued';
  supplier: string;
  supplier_cost: number;
  tags: string;
  image_url: string;
  created_at?: string;
  updated_at?: string;
}

// Order interfaces
export interface OrderItem {
  product_id: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  _id?: string;
  _uid?: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string; // JSON string
  billing_address: string; // JSON string
  items: string; // JSON string of OrderItem[]
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  priority: 'High' | 'Normal' | 'Low';
  payment_method: string;
  payment_status: 'paid' | 'pending' | 'failed';
  tracking_number?: string;
  estimated_delivery?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  processed_by?: string;
  shipped_at?: string;
  delivered_at?: string;
}

// Inventory movement interfaces
export interface InventoryMovement {
  _id?: string;
  _uid?: string;
  product_id: string;
  product_sku: string;
  product_name: string;
  movement_type: 'stock_in' | 'stock_out' | 'adjustment' | 'transfer' | 'sale' | 'return' | 'damage';
  quantity_change: number;
  quantity_before: number;
  quantity_after: number;
  unit_cost: number;
  total_value: number;
  reason: string;
  reference_id?: string;
  reference_type?: string;
  user_id: string;
  user_name: string;
  location?: string;
  batch_number?: string;
  expiry_date?: string;
  notes?: string;
  created_at?: string;
}

// Product Service
export class ProductService {
  static async getAllProducts(): Promise<Product[]> {
    try {
      const response = await table.getItems(TABLE_IDS.products, {
        limit: 100,
        sort: '_id',
        order: 'desc'
      });
      return response.items as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  static async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await table.getItems(TABLE_IDS.products, {
        query: { category },
        limit: 100
      });
      return response.items as Product[];
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  static async getProductsBySKU(sku: string): Promise<Product[]> {
    try {
      const response = await table.getItems(TABLE_IDS.products, {
        query: { sku },
        limit: 10
      });
      return response.items as Product[];
    } catch (error) {
      console.error('Error fetching products by SKU:', error);
      return [];
    }
  }

  static async createProduct(productData: Omit<Product, '_id' | '_uid' | 'created_at' | 'updated_at'>): Promise<void> {
    try {
      const now = new Date().toISOString();
      await table.addItem(TABLE_IDS.products, {
        ...productData,
        created_at: now,
        updated_at: now
      });
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  static async updateProduct(product: Product): Promise<void> {
    try {
      if (!product._uid || !product._id) {
        throw new Error('Product _uid and _id are required for update');
      }
      
      await table.updateItem(TABLE_IDS.products, {
        ...product,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(uid: string, id: string): Promise<void> {
    try {
      await table.deleteItem(TABLE_IDS.products, {
        _uid: uid,
        _id: id
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  static async getLowStockProducts(): Promise<Product[]> {
    try {
      const allProducts = await this.getAllProducts();
      return allProducts.filter(product => 
        product.current_stock <= product.min_stock && 
        product.status === 'Active'
      );
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      return [];
    }
  }
}

// Order Service
export class OrderService {
  static async getAllOrders(): Promise<Order[]> {
    try {
      const response = await table.getItems(TABLE_IDS.orders, {
        limit: 100,
        sort: '_id',
        order: 'desc'
      });
      return response.items as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  static async getOrdersByStatus(status: Order['status']): Promise<Order[]> {
    try {
      const response = await table.getItems(TABLE_IDS.orders, {
        query: { status },
        limit: 100
      });
      return response.items as Order[];
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return [];
    }
  }

  static async getOrdersByPriority(priority: Order['priority']): Promise<Order[]> {
    try {
      const response = await table.getItems(TABLE_IDS.orders, {
        query: { priority },
        limit: 100
      });
      return response.items as Order[];
    } catch (error) {
      console.error('Error fetching orders by priority:', error);
      return [];
    }
  }

  static async createOrder(orderData: Omit<Order, '_id' | '_uid' | 'created_at' | 'updated_at'>): Promise<void> {
    try {
      const now = new Date().toISOString();
      await table.addItem(TABLE_IDS.orders, {
        ...orderData,
        created_at: now,
        updated_at: now
      });
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  static async updateOrder(order: Order): Promise<void> {
    try {
      if (!order._uid || !order._id) {
        throw new Error('Order _uid and _id are required for update');
      }
      
      await table.updateItem(TABLE_IDS.orders, {
        ...order,
        updated_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  static async updateOrderStatus(uid: string, id: string, status: Order['status'], processedBy?: string): Promise<void> {
    try {
      const updates: any = {
        _uid: uid,
        _id: id,
        status,
        updated_at: new Date().toISOString()
      };

      if (processedBy) {
        updates.processed_by = processedBy;
      }

      if (status === 'shipped') {
        updates.shipped_at = new Date().toISOString();
      } else if (status === 'delivered') {
        updates.delivered_at = new Date().toISOString();
      }

      await table.updateItem(TABLE_IDS.orders, updates);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  static generateOrderNumber(): string {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}${random}`;
  }
}

// Inventory Service
export class InventoryService {
  static async getAllMovements(): Promise<InventoryMovement[]> {
    try {
      const response = await table.getItems(TABLE_IDS.inventory_movements, {
        limit: 100,
        sort: '_id',
        order: 'desc'
      });
      return response.items as InventoryMovement[];
    } catch (error) {
      console.error('Error fetching inventory movements:', error);
      return [];
    }
  }

  static async getMovementsByProduct(productId: string): Promise<InventoryMovement[]> {
    try {
      const response = await table.getItems(TABLE_IDS.inventory_movements, {
        query: { product_id: productId },
        limit: 100,
        sort: '_id',
        order: 'desc'
      });
      return response.items as InventoryMovement[];
    } catch (error) {
      console.error('Error fetching movements by product:', error);
      return [];
    }
  }

  static async createMovement(movementData: Omit<InventoryMovement, '_id' | '_uid' | 'created_at'>): Promise<void> {
    try {
      await table.addItem(TABLE_IDS.inventory_movements, {
        ...movementData,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating inventory movement:', error);
      throw error;
    }
  }

  static async recordStockAdjustment(
    productId: string,
    productSku: string,
    productName: string,
    quantityChange: number,
    currentStock: number,
    reason: string,
    userId: string,
    userName: string,
    unitCost: number = 0
  ): Promise<void> {
    try {
      await this.createMovement({
        product_id: productId,
        product_sku: productSku,
        product_name: productName,
        movement_type: quantityChange > 0 ? 'stock_in' : 'stock_out',
        quantity_change: quantityChange,
        quantity_before: currentStock,
        quantity_after: currentStock + quantityChange,
        unit_cost: unitCost,
        total_value: Math.abs(quantityChange) * unitCost,
        reason,
        reference_type: 'manual',
        user_id: userId,
        user_name: userName
      });
    } catch (error) {
      console.error('Error recording stock adjustment:', error);
      throw error;
    }
  }
}

// Analytics Service
export class AnalyticsService {
  static async getDashboardStats(): Promise<{
    totalProducts: number;
    lowStockCount: number;
    pendingOrders: number;
    totalRevenue: number;
  }> {
    try {
      const [products, orders] = await Promise.all([
        ProductService.getAllProducts(),
        OrderService.getAllOrders()
      ]);

      const lowStockCount = products.filter(p => 
        p.current_stock <= p.min_stock && p.status === 'Active'
      ).length;

      const pendingOrders = orders.filter(o => 
        o.status === 'pending' || o.status === 'processing'
      ).length;

      const totalRevenue = orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + order.total_amount, 0);

      return {
        totalProducts: products.length,
        lowStockCount,
        pendingOrders,
        totalRevenue
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalProducts: 0,
        lowStockCount: 0,
        pendingOrders: 0,
        totalRevenue: 0
      };
    }
  }

  static async getBestsellingProducts(limit: number = 10): Promise<Array<{
    product: Product;
    totalSold: number;
    revenue: number;
  }>> {
    try {
      const [products, orders] = await Promise.all([
        ProductService.getAllProducts(),
        OrderService.getAllOrders()
      ]);

      // Calculate sales by product
      const productSales: Record<string, { totalSold: number; revenue: number }> = {};

      orders
        .filter(order => order.status === 'delivered')
        .forEach(order => {
          try {
            const items: OrderItem[] = JSON.parse(order.items);
            items.forEach(item => {
              if (!productSales[item.sku]) {
                productSales[item.sku] = { totalSold: 0, revenue: 0 };
              }
              productSales[item.sku].totalSold += item.quantity;
              productSales[item.sku].revenue += item.total;
            });
          } catch (error) {
            console.error('Error parsing order items:', error);
          }
        });

      // Combine with product data and sort
      const bestsellers = products
        .map(product => ({
          product,
          totalSold: productSales[product.sku]?.totalSold || 0,
          revenue: productSales[product.sku]?.revenue || 0
        }))
        .filter(item => item.totalSold > 0)
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, limit);

      return bestsellers;
    } catch (error) {
      console.error('Error fetching bestselling products:', error);
      return [];
    }
  }
}

// Data Service - Main API
export const dataService = {
  products: ProductService,
  orders: OrderService,
  inventory: InventoryService,
  analytics: AnalyticsService
};

export default dataService;