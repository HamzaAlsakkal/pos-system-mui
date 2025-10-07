import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  Snackbar,
  Tooltip,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  TextField,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  GridToolbar,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  CheckCircle as CompleteIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as CartIcon,
  Remove as RemoveIcon,
  AddCircle as AddCircleIcon,
  CreditCard as CreditCardIcon,
  PhoneAndroid as PhoneIcon,
  LocalAtm as CashIcon,
} from '@mui/icons-material';
import { Sale, SaleItem, Customer, Product, CreateSale, CreateSaleItem } from '@/types';
import { saleService } from '@/services/sales';
import { customerService } from '@/services/customers';
import { productService } from '@/services/products';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Sales: React.FC = () => {
  // State for sales data
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // State for modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPOSModalOpen, setIsPOSModalOpen] = useState(false);
  const [isReceiptChoiceModalOpen, setIsReceiptChoiceModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [saleDetails, setSaleDetails] = useState<(Sale & { items: SaleItem[] }) | null>(null);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [pendingSaleData, setPendingSaleData] = useState<any>(null);

  // State for POS sale creation
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile'>('cash');
  const [cartItems, setCartItems] = useState<Array<{
    productId: number;
    product?: Product;
    quantity: number;
    unitPrice: number;
    total: number;
  }>>([]);
  const [productSearch, setProductSearch] = useState('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // State for summary data
  const [summary, setSummary] = useState({
    totalSales: 0,
    totalAmount: 0,
    averageAmount: 0,
    topProducts: [] as Array<{ product: string; quantity: number; revenue: number }>,
  });

  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Fetch sales data
  const fetchSales = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching sales data...', { page, pageSize, searchTerm, statusFilter });
      const response = await saleService.getAll(page, pageSize, searchTerm, statusFilter);
      console.log('✅ Sales data received:', response);
      setSales(response.data);
      setTotalCount(response.total);
    } catch (error) {
      console.error('❌ Error fetching sales:', error);
      // Provide more detailed error information
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      showNotification(`Failed to fetch sales: ${errorMessage}`, 'error');
      
      // Fallback to empty data to prevent complete failure
      setSales([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary data
  const fetchSummary = async () => {
    try {
      console.log('📊 Fetching sales summary...');
      const response = await saleService.getSummary('month');
      console.log('✅ Summary data received:', response);
      setSummary(response.data);
    } catch (error) {
      console.error('❌ Error fetching summary:', error);
      // Provide fallback summary data
      setSummary({
        totalSales: 0,
        totalAmount: 0,
        averageAmount: 0,
        topProducts: [],
      });
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchSales();
  }, [page, pageSize, searchTerm, statusFilter]);

  useEffect(() => {
    fetchSummary();
  }, []);

  // Show notification
  const showNotification = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ open: true, message, severity });
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  // Handle status filter change
  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(1); // Reset to first page when filtering
  };

  // Get status chip color
  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Get payment method color
  const getPaymentMethodColor = (method: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (method) {
      case 'cash': return 'success';
      case 'card': return 'primary';
      case 'mobile': return 'info';
      default: return 'default';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Handle view sale details
  const handleViewSale = async (sale: Sale) => {
    try {
      setLoading(true);
      const response = await saleService.getById(sale.id);
      setSaleDetails(response.data);
      setSelectedSale(sale);
      setIsViewModalOpen(true);
    } catch (error: any) {
      console.error('Error fetching sale details:', error);
      showNotification(error.message || 'Failed to fetch sale details', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle complete sale
  const handleCompleteSale = async (sale: Sale) => {
    try {
      setLoading(true);
      await saleService.complete(sale.id);
      await fetchSales();
      await fetchSummary();
      showNotification('Sale completed successfully', 'success');
    } catch (error: any) {
      console.error('Error completing sale:', error);
      showNotification(error.message || 'Failed to complete sale', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel sale
  const handleCancelSale = async (sale: Sale) => {
    try {
      setLoading(true);
      await saleService.cancel(sale.id);
      await fetchSales();
      await fetchSummary();
      showNotification('Sale cancelled successfully', 'success');
    } catch (error: any) {
      console.error('Error cancelling sale:', error);
      showNotification(error.message || 'Failed to cancel sale', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete sale
  const handleDeleteSale = async () => {
    if (!selectedSale) return;

    try {
      setLoading(true);
      await saleService.delete(selectedSale.id);
      setIsDeleteModalOpen(false);
      setSelectedSale(null);
      await fetchSales();
      await fetchSummary();
      showNotification('Sale deleted successfully', 'success');
    } catch (error: any) {
      console.error('Error deleting sale:', error);
      showNotification(error.message || 'Failed to delete sale', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open delete modal
  const openDeleteModal = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDeleteModalOpen(true);
  };

  // Fetch customers for POS
  const fetchCustomers = async () => {
    try {
      const response = await customerService.getAllForDropdown();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showNotification('Failed to fetch customers', 'error');
    }
  };

  // Fetch products for POS
  const fetchProducts = async () => {
    try {
      const response = await productService.getAllForDropdown();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      showNotification('Failed to fetch products', 'error');
    }
  };

  // Open POS modal
  const openPOSModal = async () => {
    await fetchCustomers();
    await fetchProducts();
    setSelectedCustomerId(0);
    setPaymentMethod('cash');
    setCartItems([]);
    setProductSearch('');
    setFormErrors({});
    setIsPOSModalOpen(true);
  };

  // Add product to cart
  const addToCart = (product: Product) => {
    const existingItemIndex = cartItems.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex !== -1) {
      // Increase quantity if product already in cart
      const newItems = [...cartItems];
      newItems[existingItemIndex].quantity += 1;
      newItems[existingItemIndex].total = newItems[existingItemIndex].quantity * newItems[existingItemIndex].unitPrice;
      setCartItems(newItems);
    } else {
      // Add new item to cart
      setCartItems([...cartItems, {
        productId: product.id,
        product: product,
        quantity: 1,
        unitPrice: product.price,
        total: product.price,
      }]);
    }
    setProductSearch(''); // Clear search after adding
  };

  // Remove item from cart
  const removeFromCart = (index: number) => {
    const newItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newItems);
  };

  // Update cart item quantity
  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    
    const newItems = [...cartItems];
    newItems[index].quantity = quantity;
    newItems[index].total = quantity * newItems[index].unitPrice;
    setCartItems(newItems);
  };

  // Update cart item price
  const updateCartPrice = (index: number, price: number) => {
    const newItems = [...cartItems];
    newItems[index].unitPrice = price;
    newItems[index].total = newItems[index].quantity * price;
    setCartItems(newItems);
  };

  // Calculate total sale amount
  const calculateSaleTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.total, 0);
  };

  // Validate POS sale
  const validatePOSSale = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    // Customer is optional - 0 means walk-in customer
    // No validation needed for selectedCustomerId
    
    if (cartItems.length === 0) {
      errors.cart = 'Please add at least one item to cart';
    }
    
    cartItems.forEach((item, index) => {
      if (item.quantity <= 0) {
        errors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
      }
      if (item.unitPrice <= 0) {
        errors[`item_${index}_price`] = 'Price must be greater than 0';
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate PDF receipt
  const generateReceipt = async (saleData: any, shouldPrint: boolean = false) => {
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.width;
      
      // Header
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Sales Receipt', pageWidth / 2, 20, { align: 'center' });
      
      // Store info
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('POS System', pageWidth / 2, 35, { align: 'center' });
      pdf.text('Date: ' + new Date().toLocaleDateString(), pageWidth / 2, 45, { align: 'center' });
      
      // Sale info
      pdf.setFontSize(10);
      pdf.text(`Sale ID: #${Date.now()}`, 20, 65);
      
      // Customer info
      if (selectedCustomerId > 0) {
        const customer = customers.find(c => c.id === selectedCustomerId);
        if (customer) {
          pdf.text(`Customer: ${customer.fullName}`, 20, 75);
          pdf.text(`Phone: ${customer.phone || 'N/A'}`, 20, 85);
        }
      } else {
        pdf.text('Customer: Walk-in Customer', 20, 75);
      }
      
      // Items header
      pdf.setFont('helvetica', 'bold');
      pdf.text('Item', 20, 105);
      pdf.text('Qty', 120, 105);
      pdf.text('Price', 145, 105);
      pdf.text('Total', 170, 105);
      
      // Items
      pdf.setFont('helvetica', 'normal');
      let yPosition = 115;
      
      cartItems.forEach((item) => {
        const productName = item.product?.name || `Product ${item.productId}`;
        pdf.text(productName.substring(0, 25), 20, yPosition);
        pdf.text(item.quantity.toString(), 120, yPosition);
        pdf.text(`$${item.unitPrice.toFixed(2)}`, 145, yPosition);
        pdf.text(`$${item.total.toFixed(2)}`, 170, yPosition);
        yPosition += 10;
      });
      
      // Totals
      yPosition += 10;
      pdf.line(20, yPosition, 190, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Total: $${calculateSaleTotal().toFixed(2)}`, 145, yPosition);
      
      // Payment method
      yPosition += 20;
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Payment Method: ${paymentMethod.toUpperCase()}`, 20, yPosition);
      
      // Footer
      yPosition += 30;
      pdf.setFontSize(8);
      pdf.text('Thank you for your business!', pageWidth / 2, yPosition, { align: 'center' });
      
      // Either print or save based on user choice
      if (shouldPrint) {
        pdf.autoPrint();
        window.open(pdf.output('bloburl'), '_blank');
      } else {
        pdf.save(`receipt-${Date.now()}.pdf`);
      }
      
    } catch (error) {
      console.error('Error generating receipt:', error);
      showNotification('Failed to generate receipt', 'error');
    }
  };

  // Process sale
  const processSale = async () => {
    if (!validatePOSSale()) return;
    
    try {
      setLoading(true);
      const saleData: CreateSale & { items: Omit<CreateSaleItem, 'saleId'>[] } = {
        total: calculateSaleTotal(),
        userId: 1, // Current user ID (in real app, get from auth context)
        customerId: selectedCustomerId === 0 ? null : selectedCustomerId, // null for walk-in customers
        paymentMethod: paymentMethod,
        status: 'completed', // POS sales are immediately completed
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
        }))
      };
      
      await saleService.create(saleData as any);
      
      // Store sale data and show choice dialog
      setPendingSaleData(saleData);
      setLoading(false); // Reset loading before showing dialog
      setIsReceiptChoiceModalOpen(true);
      
    } catch (error: any) {
      console.error('Error processing sale:', error);
      showNotification(error.message || 'Failed to process sale', 'error');
      setLoading(false);
    }
  };

  // Handle PDF export choice
  const handleExportToPDF = async () => {
    if (pendingSaleData) {
      setLoading(true);
      await generateReceipt(pendingSaleData, false);
      await finalizeSale('Receipt exported to PDF');
    }
  };

  // Handle print choice
  const handlePrintReceipt = async () => {
    if (pendingSaleData) {
      setLoading(true);
      await generateReceipt(pendingSaleData, true);
      await finalizeSale('Receipt sent to printer');
    }
  };

  // Finalize sale after receipt action
  const finalizeSale = async (message: string) => {
    try {
      // Reset cart and form
      setCartItems([]);
      setSelectedCustomerId(0);
      setPaymentMethod('cash');
      setProductSearch('');
      setFormErrors({});
      
      setIsReceiptChoiceModalOpen(false);
      setIsPOSModalOpen(false);
      setPendingSaleData(null);
      
      await fetchSales();
      await fetchSummary();
      showNotification(`Sale completed! Total: $${pendingSaleData?.total?.toFixed(2) || '0.00'} - ${message}`, 'success');
    } catch (error) {
      console.error('Error finalizing sale:', error);
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Update button click handler
  useEffect(() => {
    fetchCustomers();
    fetchProducts();
  }, []);

  // Update button click to use openPOSModal
  const handleNewSaleClick = () => {
    openPOSModal();
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Sale ID',
      width: 100,
      sortable: true,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          #{params.value}
        </Typography>
      ),
    },
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1,
      minWidth: 180,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon color="primary" />
          <Typography variant="body2">
            {params.row.customer?.fullName || 'Unknown Customer'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'total',
      headerName: 'Total Amount',
      width: 130,
      sortable: true,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <MoneyIcon color="success" />
          <Typography variant="body2" fontWeight="medium">
            {formatCurrency(params.value)}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'paymentMethod',
      headerName: 'Payment',
      width: 120,
      sortable: true,
      renderCell: (params) => (
        <Chip
          label={params.value.toUpperCase()}
          color={getPaymentMethodColor(params.value)}
          size="small"
          icon={<PaymentIcon />}
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: true,
      renderCell: (params) => (
        <Chip
          label={params.value.toUpperCase()}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'user',
      headerName: 'Cashier',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.user?.fullName || 'Unknown User'}
        </Typography>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Date',
      width: 120,
      sortable: true,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <CalendarIcon color="action" />
          <Typography variant="body2">
            {new Date(params.value).toLocaleDateString()}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 180,
      getActions: (params) => {
        const actions = [
          <GridActionsCellItem
            icon={<ViewIcon />}
            label="View Details"
            onClick={() => handleViewSale(params.row)}
            color="primary"
          />,
        ];

        if (params.row.status === 'pending') {
          actions.push(
            <GridActionsCellItem
              icon={<CompleteIcon />}
              label="Complete"
              onClick={() => handleCompleteSale(params.row)}
              color="success"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={() => handleCancelSale(params.row)}
              color="warning"
            />
          );
        }

        actions.push(
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => openDeleteModal(params.row)}
            color="error"
          />
        );

        return actions;
      },
    },
  ];

  return (
    <Box p={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Sales Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewSaleClick}
          size="large"
        >
          New Sale
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ReceiptIcon color="primary" fontSize="large" />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Sales
                  </Typography>
                  <Typography variant="h4" component="div">
                    {summary.totalSales}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <MoneyIcon color="success" fontSize="large" />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatCurrency(summary.totalAmount)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUpIcon color="info" fontSize="large" />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Average Sale
                  </Typography>
                  <Typography variant="h4" component="div">
                    {formatCurrency(summary.averageAmount)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <CartIcon color="warning" fontSize="large" />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Selected
                  </Typography>
                  <Typography variant="h4" component="div">
                    {selectedRows.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Products Card */}
      {summary.topProducts.length > 0 && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Selling Products
                </Typography>
                <List dense>
                  {summary.topProducts.slice(0, 5).map((product, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={product.product}
                        secondary={`Qty: ${product.quantity} | Revenue: ${formatCurrency(product.revenue)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              placeholder="Search sales..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
            
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Data Grid */}
      <Card>
        <Box height={600}>
          <DataGrid
            rows={sales}
            columns={columns}
            loading={loading}
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={selectedRows}
            onRowSelectionModelChange={setSelectedRows}
            paginationMode="server"
            rowCount={totalCount}
            paginationModel={{ page: page - 1, pageSize }}
            onPaginationModelChange={(model) => {
              setPage(model.page + 1);
              setPageSize(model.pageSize);
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                quickFilterProps: { debounceMs: 500 },
              },
            }}
            sx={{
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          />
        </Box>
      </Card>

      {/* POS Sale Creation Modal */}
      <Dialog 
        open={isPOSModalOpen} 
        onClose={() => {
          setIsPOSModalOpen(false);
          setSelectedCustomerId(0);
          setCartItems([]);
          setProductSearch('');
          setFormErrors({});
        }}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <CartIcon />
              Point of Sale System
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                label={`Items: ${cartItems.length}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Total: $${calculateSaleTotal().toFixed(2)}`}
                color="success"
                variant="filled"
              />
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Grid container sx={{ height: '100%' }}>
            {/* Left Panel - Product Selection */}
            <Grid item xs={12} md={7} sx={{ p: 3, borderRight: 1, borderColor: 'divider' }}>
              <Box display="flex" flexDirection="column" gap={3} height="100%">
                {/* Customer Selection */}
                <FormControl fullWidth error={!!formErrors.customer}>
                  <InputLabel>Select Customer</InputLabel>
                  <Select
                    value={selectedCustomerId}
                    label="Select Customer"
                    onChange={(e) => setSelectedCustomerId(e.target.value as number)}
                  >
                    <MenuItem value={0}>Walk-in Customer</MenuItem>
                    {customers.map((customer) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {customer.fullName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {customer.email} | {customer.phone}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.customer && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {formErrors.customer}
                    </Typography>
                  )}
                </FormControl>

                {/* Product Search */}
                <TextField
                  fullWidth
                  label="Search Products (Name or Barcode)"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Type to search products..."
                />

                {/* Products Grid */}
                <Box flex={1} overflow="auto">
                  <Typography variant="h6" gutterBottom>
                    Products
                  </Typography>
                  <Grid container spacing={2}>
                    {products
                      .filter(product => 
                        productSearch === '' ||
                        product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                        product.barcode.toLowerCase().includes(productSearch.toLowerCase())
                      )
                      .slice(0, 20) // Limit to first 20 results
                      .map((product) => (
                        <Grid item xs={12} sm={6} lg={4} key={product.id}>
                          <Card 
                            sx={{ 
                              cursor: 'pointer',
                              '&:hover': { 
                                boxShadow: 4,
                                transform: 'translateY(-2px)',
                                transition: 'all 0.2s ease-in-out'
                              }
                            }}
                            onClick={() => addToCart(product)}
                          >
                            <CardContent sx={{ p: 2 }}>
                              <Typography variant="body2" fontWeight="medium" noWrap>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="textSecondary" display="block">
                                {product.barcode}
                              </Typography>
                              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                <Typography variant="h6" color="primary">
                                  ${product.price.toFixed(2)}
                                </Typography>
                                <Chip
                                  label={`Stock: ${product.stock}`}
                                  size="small"
                                  color={product.stock > 10 ? 'success' : product.stock > 0 ? 'warning' : 'error'}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              </Box>
            </Grid>

            {/* Right Panel - Shopping Cart */}
            <Grid item xs={12} md={5} sx={{ p: 3, bgcolor: 'grey.50' }}>
              <Box display="flex" flexDirection="column" gap={3} height="100%">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Shopping Cart</Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={clearCart}
                    disabled={cartItems.length === 0}
                  >
                    Clear Cart
                  </Button>
                </Box>

                {formErrors.cart && (
                  <Alert severity="error">
                    {formErrors.cart}
                  </Alert>
                )}

                {/* Cart Items */}
                <Box flex={1} overflow="auto">
                  {cartItems.length === 0 ? (
                    <Box textAlign="center" py={4}>
                      <CartIcon color="disabled" sx={{ fontSize: 64, mb: 2 }} />
                      <Typography color="textSecondary">
                        Cart is empty. Add products to get started.
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ p: 0 }}>
                      {cartItems.map((item, index) => (
                        <Paper key={index} variant="outlined" sx={{ mb: 2 }}>
                          <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch', p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body2" fontWeight="medium" flex={1}>
                                {item.product?.name}
                              </Typography>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeFromCart(index)}
                              >
                                <RemoveIcon />
                              </IconButton>
                            </Box>
                            
                            <Grid container spacing={1} alignItems="center">
                              <Grid item xs={4}>
                                <TextField
                                  label="Qty"
                                  type="number"
                                  size="small"
                                  value={item.quantity}
                                  onChange={(e) => updateCartQuantity(index, parseInt(e.target.value) || 0)}
                                  inputProps={{ min: 1 }}
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  label="Price"
                                  type="number"
                                  size="small"
                                  value={item.unitPrice}
                                  onChange={(e) => updateCartPrice(index, parseFloat(e.target.value) || 0)}
                                  inputProps={{ min: 0, step: 0.01 }}
                                  InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                  }}
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField
                                  label="Total"
                                  value={`$${item.total.toFixed(2)}`}
                                  size="small"
                                  disabled
                                  fullWidth
                                />
                              </Grid>
                            </Grid>
                          </ListItem>
                        </Paper>
                      ))}
                    </List>
                  )}
                </Box>

                {/* Payment Method */}
                {cartItems.length > 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Payment Method
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Button
                          fullWidth
                          variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
                          onClick={() => setPaymentMethod('cash')}
                          startIcon={<CashIcon />}
                          color="success"
                        >
                          Cash
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          fullWidth
                          variant={paymentMethod === 'card' ? 'contained' : 'outlined'}
                          onClick={() => setPaymentMethod('card')}
                          startIcon={<CreditCardIcon />}
                          color="primary"
                        >
                          Card
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button
                          fullWidth
                          variant={paymentMethod === 'mobile' ? 'contained' : 'outlined'}
                          onClick={() => setPaymentMethod('mobile')}
                          startIcon={<PhoneIcon />}
                          color="info"
                        >
                          Mobile
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Total and Checkout */}
                {cartItems.length > 0 && (
                  <Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h5">Total:</Typography>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        ${calculateSaleTotal().toFixed(2)}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      fullWidth
                      onClick={processSale}
                      disabled={loading || cartItems.length === 0}
                      startIcon={<ReceiptIcon />}
                    >
                      Complete Sale
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={() => {
              setIsPOSModalOpen(false);
              setSelectedCustomerId(0);
              setCartItems([]);
              setProductSearch('');
              setFormErrors({});
            }}
            size="large"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sale Details Modal */}
      <Dialog 
        open={isViewModalOpen} 
        onClose={() => {
          setIsViewModalOpen(false);
          setSaleDetails(null);
          setSelectedSale(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <ReceiptIcon />
            Sale Details - #{selectedSale?.id}
          </Box>
        </DialogTitle>
        <DialogContent>
          {saleDetails && (
            <Box>
              {/* Sale Information */}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Customer
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {saleDetails.customer?.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Cashier
                  </Typography>
                  <Typography variant="body1">
                    {saleDetails.user?.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Payment Method
                  </Typography>
                  <Chip
                    label={saleDetails.paymentMethod.toUpperCase()}
                    color={getPaymentMethodColor(saleDetails.paymentMethod)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={saleDetails.status.toUpperCase()}
                    color={getStatusColor(saleDetails.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(saleDetails.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatCurrency(saleDetails.total)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Sale Items */}
              <Typography variant="h6" gutterBottom>
                Items Purchased
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                {saleDetails.items.map((item, index) => (
                  <Box key={index} mb={2}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" fontWeight="medium">
                          {item.product?.name || `Product ${item.productId}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <Typography variant="body2" textAlign="center">
                          Qty: {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2" textAlign="center">
                          {formatCurrency(item.unitPrice)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2" textAlign="right" fontWeight="medium">
                          {formatCurrency(item.total)}
                        </Typography>
                      </Grid>
                    </Grid>
                    {index < saleDetails.items.length - 1 && <Divider sx={{ mt: 1 }} />}
                  </Box>
                ))}
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsViewModalOpen(false);
              setSaleDetails(null);
              setSelectedSale(null);
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog 
        open={isDeleteModalOpen} 
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSale(null);
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete sale #{selectedSale?.id}? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedSale(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSale}
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Choice Modal */}
      <Dialog 
        open={isReceiptChoiceModalOpen} 
        onClose={() => {
          setIsReceiptChoiceModalOpen(false);
          setPendingSaleData(null);
          setLoading(false);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <ReceiptIcon />
            Sale Completed - Choose Receipt Option
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" mb={3}>
            Your sale has been processed successfully! How would you like to handle the receipt?
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <Button
              variant="contained"
              startIcon={<ReceiptIcon />}
              onClick={handleExportToPDF}
              disabled={loading}
              size="large"
              fullWidth
            >
              Export to PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<ReceiptIcon />}
              onClick={handlePrintReceipt}
              disabled={loading}
              size="large"
              fullWidth
            >
              Print Directly
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsReceiptChoiceModalOpen(false);
              setPendingSaleData(null);
              setLoading(false);
            }}
            disabled={loading}
          >
            Skip Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Sales;