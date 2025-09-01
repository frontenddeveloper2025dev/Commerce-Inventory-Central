import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Package,
  User,
  MapPin,
  Calendar,
  DollarSign,
  Truck,
  Clock,
  Check,
  X,
  AlertCircle,
  Phone,
  Mail
} from 'lucide-react';

// Order status types
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Order item interface
interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  image?: string;
}

// Complete order interface
interface OrderDetails {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  priority: 'low' | 'normal' | 'high';
  date: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  notes?: string;
  trackingNumber?: string;
}

// Status configurations
const statusConfig = {
  pending: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock 
  },
  processing: { 
    label: 'Processing', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Package 
  },
  shipped: { 
    label: 'Shipped', 
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Truck 
  },
  delivered: { 
    label: 'Delivered', 
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Check 
  },
  cancelled: { 
    label: 'Cancelled', 
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: X 
  }
};

const priorityConfig = {
  low: { label: 'Low', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  normal: { label: 'Normal', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  high: { label: 'High', color: 'bg-red-100 text-red-800 border-red-200' }
};

// Mock order details
const mockOrderDetails: OrderDetails = {
  id: '1',
  orderNumber: 'ORD-2024-001',
  customer: {
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567'
  },
  items: [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      sku: 'WBH-001',
      quantity: 1,
      price: 199.99
    },
    {
      id: '2',
      name: 'Phone Case - Clear',
      sku: 'PC-CLR-001',
      quantity: 2,
      price: 49.99
    }
  ],
  subtotal: 299.97,
  tax: 24.00,
  shipping: 9.99,
  total: 333.96,
  status: 'pending',
  priority: 'high',
  date: '2024-01-15T10:30:00Z',
  shippingAddress: {
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States'
  },
  billingAddress: {
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States'
  },
  notes: 'Please handle with care - contains fragile items.',
  trackingNumber: undefined
};

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber?: string;
}

export default function OrderDetailsModal({ isOpen, onClose, orderNumber }: OrderDetailsModalProps) {
  const { toast } = useToast();
  const [order] = useState<OrderDetails>(mockOrderDetails);

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    toast({
      title: "Status Updated",
      description: `Order ${order.orderNumber} status changed to ${statusConfig[newStatus].label}`,
    });
  };

  const handlePrintOrder = () => {
    toast({
      title: "Print Order",
      description: "Order details sent to printer",
    });
  };

  const StatusIcon = statusConfig[order.status].icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="h-5 w-5" />
            Order Details - {order.orderNumber}
          </DialogTitle>
          <DialogDescription>
            Complete order information and processing options
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-6">
            {/* Order Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusConfig[order.status].color}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[order.status].label}
                    </Badge>
                    <Badge variant="outline" className={priorityConfig[order.priority].color}>
                      {priorityConfig[order.priority].label} Priority
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Order Date:</span>
                    <span className="font-medium">
                      {new Date(order.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Total:</span>
                    <span className="font-bold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items ({order.items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${order.shipping.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Order Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm bg-muted/30 p-3 rounded-lg">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Customer & Shipping Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>{order.customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{order.customer.phone}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate('processing')}
                    disabled={order.status !== 'pending'}
                  >
                    Process
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate('shipped')}
                    disabled={order.status !== 'processing'}
                  >
                    Ship
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={handlePrintOrder}
                >
                  Print Order
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleStatusUpdate('cancelled')}
                  disabled={order.status === 'delivered' || order.status === 'cancelled'}
                >
                  Cancel Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}