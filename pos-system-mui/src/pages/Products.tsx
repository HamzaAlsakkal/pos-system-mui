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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { productService } from '@/services/products';
import { categoryService } from '@/services/categories';
import { Product, CreateProduct, Category } from '@/types';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Form state
  const [formData, setFormData] = useState<CreateProduct>({
    name: '',
    barcode: '',
    categoryId: 0,
    price: 0,
    stock: 0,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll(page + 1, pageSize, searchTerm);
      setProducts(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching products:', error);
      setSnackbar({ open: true, message: 'Error fetching products', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllForDropdown();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, pageSize, searchTerm]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleOpenDialog = (mode: 'create' | 'edit' | 'view', product?: Product) => {
    setDialogMode(mode);
    setSelectedProduct(product || null);
    
    if (mode === 'create') {
      setFormData({
        name: '',
        barcode: '',
        categoryId: 0,
        price: 0,
        stock: 0,
      });
    } else if (product) {
      setFormData({
        name: product.name,
        barcode: product.barcode,
        categoryId: product.categoryId,
        price: product.price,
        stock: product.stock,
      });
    }
    
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleFormChange = (field: keyof CreateProduct) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'price' || field === 'stock' || field === 'categoryId' 
        ? Number(event.target.value) 
        : event.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (dialogMode === 'create') {
        await productService.create(formData);
        setSnackbar({ open: true, message: 'Product created successfully', severity: 'success' });
      } else if (dialogMode === 'edit' && selectedProduct) {
        await productService.update(selectedProduct.id, formData);
        setSnackbar({ open: true, message: 'Product updated successfully', severity: 'success' });
      }
      
      handleCloseDialog();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      setSnackbar({ open: true, message: 'Error saving product', severity: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.delete(id);
        setSnackbar({ open: true, message: 'Product deleted successfully', severity: 'success' });
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        setSnackbar({ open: true, message: 'Error deleting product', severity: 'error' });
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'barcode', headerName: 'Barcode', width: 150 },
    { 
      field: 'category', 
      headerName: 'Category', 
      width: 150,
      valueGetter: (params) => params.row.category?.name || 'N/A',
    },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 100,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value < 10 ? 'error' : params.value < 25 ? 'warning' : 'success'}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleOpenDialog('view', params.row)}
            color="info"
          >
            <ViewIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleOpenDialog('edit', params.row)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Products Management
      </Typography>

      <Card>
        <CardContent>
          {/* Toolbar */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TextField
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              size="small"
              sx={{ width: 300 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('create')}
            >
              Add Product
            </Button>
          </Box>

          {/* Data Grid */}
          <DataGrid
            rows={products}
            columns={columns}
            paginationMode="server"
            rowCount={total}
            paginationModel={{ page, pageSize }}
            onPaginationModelChange={(model) => {
              setPage(model.page);
              setPageSize(model.pageSize);
            }}
            loading={loading}
            pageSizeOptions={[5, 10, 25, 50]}
            sx={{ height: 400, width: '100%' }}
          />
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Add New Product' :
           dialogMode === 'edit' ? 'Edit Product' : 'Product Details'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={handleFormChange('name')}
              margin="normal"
              disabled={dialogMode === 'view'}
              required
            />
            <TextField
              fullWidth
              label="Barcode"
              value={formData.barcode}
              onChange={handleFormChange('barcode')}
              margin="normal"
              disabled={dialogMode === 'view'}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.categoryId}
                label="Category"
                onChange={handleFormChange('categoryId')}
                disabled={dialogMode === 'view'}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleFormChange('price')}
              margin="normal"
              disabled={dialogMode === 'view'}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={handleFormChange('stock')}
              margin="normal"
              disabled={dialogMode === 'view'}
              required
              inputProps={{ min: 0 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            {dialogMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogMode !== 'view' && (
            <Button onClick={handleSubmit} variant="contained">
              {dialogMode === 'create' ? 'Create' : 'Update'}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;