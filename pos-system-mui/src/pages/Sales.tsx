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
} from '@mui/icons-material';
import { Sale, SaleItem } from '@/types';
import { saleService } from '@/services/sales';

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
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [saleDetails, setSaleDetails] = useState<(Sale & { items: SaleItem[] }) | null>(null);
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

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
      const response = await saleService.getAll(page, pageSize, searchTerm, statusFilter);
      setSales(response.data);
      setTotalCount(response.total);
    } catch (error) {
      console.error('Error fetching sales:', error);
      showNotification('Failed to fetch sales', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch summary data
  const fetchSummary = async () => {
    try {
      const response = await saleService.getSummary('month');
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
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
          onClick={() => showNotification('POS system feature coming soon!', 'info')}
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