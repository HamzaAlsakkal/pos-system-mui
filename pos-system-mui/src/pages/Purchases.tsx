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
  LocalShipping as ShippingIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  ShoppingBasket as BasketIcon,
} from '@mui/icons-material';
import { Purchase, PurchaseItem } from '@/types';
import { purchaseService } from '@/services/purchases';

const Purchases: React.FC = () => {
  // State for purchases data
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // State for modals
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [purchaseDetails, setPurchaseDetails] = useState<(Purchase & { items: PurchaseItem[] }) | null>(null);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  // State for summary data
  const [summary, setSummary] = useState({
    totalPurchases: 0,
    totalAmount: 0,
    averageAmount: 0,
    topSuppliers: [] as Array<{ supplier: string; orders: number; amount: number }>,
  });

  // State for notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Fetch purchases data
  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await purchaseService.getAll(page, pageSize, searchTerm, statusFilter);
      setPurchases(response.data);
      setTotalCount(response.total);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      showNotification('Failed to fetch purchases', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary data
  const fetchSummary = async () => {
    try {
      const response = await purchaseService.getSummary('month');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchPurchases();
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Handle view purchase details
  const handleViewPurchase = async (purchase: Purchase) => {
    try {
      setLoading(true);
      const response = await purchaseService.getById(purchase.id);
      setPurchaseDetails(response.data);
      setSelectedPurchase(purchase);
      setIsViewModalOpen(true);
    } catch (error: any) {
      console.error('Error fetching purchase details:', error);
      showNotification(error.message || 'Failed to fetch purchase details', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle complete purchase
  const handleCompletePurchase = async (purchase: Purchase) => {
    try {
      setLoading(true);
      await purchaseService.complete(purchase.id);
      await fetchPurchases();
      await fetchSummary();
      showNotification('Purchase completed successfully', 'success');
    } catch (error: any) {
      console.error('Error completing purchase:', error);
      showNotification(error.message || 'Failed to complete purchase', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel purchase
  const handleCancelPurchase = async (purchase: Purchase) => {
    try {
      setLoading(true);
      await purchaseService.cancel(purchase.id);
      await fetchPurchases();
      await fetchSummary();
      showNotification('Purchase cancelled successfully', 'success');
    } catch (error: any) {
      console.error('Error cancelling purchase:', error);
      showNotification(error.message || 'Failed to cancel purchase', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete purchase
  const handleDeletePurchase = async () => {
    if (!selectedPurchase) return;

    try {
      setLoading(true);
      await purchaseService.delete(selectedPurchase.id);
      setIsDeleteModalOpen(false);
      setSelectedPurchase(null);
      await fetchPurchases();
      await fetchSummary();
      showNotification('Purchase deleted successfully', 'success');
    } catch (error: any) {
      console.error('Error deleting purchase:', error);
      showNotification(error.message || 'Failed to delete purchase', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open delete modal
  const openDeleteModal = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsDeleteModalOpen(true);
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'Purchase ID',
      width: 120,
      sortable: true,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          #PO-{params.value}
        </Typography>
      ),
    },
    {
      field: 'supplier',
      headerName: 'Supplier',
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <BusinessIcon color="primary" />
          <Typography variant="body2">
            {params.row.supplier?.name || 'Unknown Supplier'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'total',
      headerName: 'Total Amount',
      width: 140,
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
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: true,
      renderCell: (params) => (
        <Chip
          label={params.value.toUpperCase()}
          color={getStatusColor(params.value)}
          size="small"
          icon={<ShippingIcon />}
        />
      ),
    },
    {
      field: 'user',
      headerName: 'Ordered By',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <PersonIcon color="action" />
          <Typography variant="body2">
            {params.row.user?.fullName || 'Unknown User'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Order Date',
      width: 130,
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
            onClick={() => handleViewPurchase(params.row)}
            color="primary"
          />,
        ];

        if (params.row.status === 'pending') {
          actions.push(
            <GridActionsCellItem
              icon={<CompleteIcon />}
              label="Receive"
              onClick={() => handleCompletePurchase(params.row)}
              color="success"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              onClick={() => handleCancelPurchase(params.row)}
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
          Purchase Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => showNotification('Purchase order creation feature coming soon!', 'info')}
          size="large"
        >
          New Purchase Order
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ShippingIcon color="primary" fontSize="large" />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Orders
                  </Typography>
                  <Typography variant="h4" component="div">
                    {summary.totalPurchases}
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
                <MoneyIcon color="error" fontSize="large" />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Spent
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
                    Average Order
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
                <InventoryIcon color="warning" fontSize="large" />
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

      {/* Top Suppliers Card */}
      {summary.topSuppliers.length > 0 && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Suppliers by Volume
                </Typography>
                <List dense>
                  {summary.topSuppliers.slice(0, 5).map((supplier, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={supplier.supplier}
                        secondary={`Orders: ${supplier.orders} | Total: ${formatCurrency(supplier.amount)}`}
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
              placeholder="Search purchases..."
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
                <MenuItem value="completed">Received</MenuItem>
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
            rows={purchases}
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

      {/* Purchase Details Modal */}
      <Dialog 
        open={isViewModalOpen} 
        onClose={() => {
          setIsViewModalOpen(false);
          setPurchaseDetails(null);
          setSelectedPurchase(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <ShippingIcon />
            Purchase Order Details - #PO-{selectedPurchase?.id}
          </Box>
        </DialogTitle>
        <DialogContent>
          {purchaseDetails && (
            <Box>
              {/* Purchase Information */}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Supplier
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {purchaseDetails.supplier?.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {purchaseDetails.supplier?.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {purchaseDetails.supplier?.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Ordered By
                  </Typography>
                  <Typography variant="body1">
                    {purchaseDetails.user?.fullName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {purchaseDetails.user?.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Status
                  </Typography>
                  <Chip
                    label={purchaseDetails.status.toUpperCase()}
                    color={getStatusColor(purchaseDetails.status)}
                    size="small"
                    icon={<ShippingIcon />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Order Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(purchaseDetails.createdAt).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Supplier Address
                  </Typography>
                  <Typography variant="body1">
                    {purchaseDetails.supplier?.address}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatCurrency(purchaseDetails.total)}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Purchase Items */}
              <Typography variant="h6" gutterBottom>
                Order Items
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                {purchaseDetails.items.map((item, index) => (
                  <Box key={index} mb={2}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2" fontWeight="medium">
                          {item.product?.name || `Product ${item.productId}`}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          SKU: {item.product?.barcode}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={2}>
                        <Typography variant="body2" textAlign="center">
                          Qty: {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2" textAlign="center">
                          {formatCurrency(item.unitCost)}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={3}>
                        <Typography variant="body2" textAlign="right" fontWeight="medium">
                          {formatCurrency(item.total)}
                        </Typography>
                      </Grid>
                    </Grid>
                    {index < purchaseDetails.items.length - 1 && <Divider sx={{ mt: 1 }} />}
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
              setPurchaseDetails(null);
              setSelectedPurchase(null);
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
          setSelectedPurchase(null);
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete purchase order #PO-{selectedPurchase?.id}? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedPurchase(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeletePurchase}
            disabled={loading}
          >
            Delete
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

export default Purchases;