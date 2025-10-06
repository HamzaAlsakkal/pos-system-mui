import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardService } from '@/services/dashboard';
import { DashboardSummary } from '@/types';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {trend.isPositive ? (
                  <TrendingUpIcon color="success" fontSize="small" />
                ) : (
                  <TrendingDownIcon color="error" fontSize="small" />
                )}
                <Typography
                  variant="body2"
                  color={trend.isPositive ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {Math.abs(trend.value)}%
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}.main`,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Only fetch data if user is authenticated and token is available
      if (!user || !token) {
        console.log('⏳ Dashboard: Waiting for authentication...');
        return;
      }

      try {
        console.log('📊 Dashboard: Fetching dashboard data...');
        setLoading(true);
        
        // TODO: Temporarily commented out API call due to 401 authentication issues
        // const response = await dashboardService.getSummary();
        // setDashboardData(response.data);
        
        // Using mock data for now
        console.log('ℹ️ Dashboard: Using mock data (API call commented out)');
        setDashboardData({
          totalSales: 25000,
          totalPurchases: 18000,
          totalProducts: 150,
          lowStockProducts: 5,
          totalCustomers: 85,
          totalSuppliers: 12,
          recentSales: [
            { 
              id: 1, 
              customer: { fullName: 'John Doe' } as any, 
              total: 125.50, 
              status: 'completed'
            },
            { 
              id: 2, 
              customer: { fullName: 'Jane Smith' } as any, 
              total: 89.99, 
              status: 'pending'
            },
            { 
              id: 3, 
              customer: undefined, 
              total: 45.00, 
              status: 'completed'
            },
          ] as any,
          topProducts: [
            { id: 1, name: 'Product A', stock: 25, price: 29.99 },
            { id: 2, name: 'Product B', stock: 8, price: 19.99 },
            { id: 3, name: 'Product C', stock: 50, price: 39.99 },
          ] as any,
          salesTrend: { current: 25000, previous: 21739, percentage: 15.5 },
          purchasesTrend: { current: 18000, previous: 18590, percentage: -3.2 }
        });
        
        console.log('✅ Dashboard: Mock data loaded successfully');
      } catch (error) {
        console.error('❌ Dashboard: Error fetching dashboard data:', error);
        // Fallback to mock data if API fails
        setDashboardData({
          totalSales: 0,
          totalPurchases: 0,
          totalProducts: 0,
          lowStockProducts: 0,
          totalCustomers: 0,
          totalSuppliers: 0,
          recentSales: [],
          topProducts: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, token]); // Re-run when user or token changes

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Sales"
            value={`$${dashboardData?.totalSales?.toLocaleString() || 0}`}
            icon={<AttachMoneyIcon />}
            color="primary"
            trend={dashboardData?.salesTrend ? {
              value: Math.abs(dashboardData.salesTrend.percentage),
              isPositive: dashboardData.salesTrend.percentage >= 0
            } : undefined}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Purchases"
            value={`$${dashboardData?.totalPurchases?.toLocaleString() || 0}`}
            icon={<TrendingUpIcon />}
            color="secondary"
            trend={dashboardData?.purchasesTrend ? {
              value: Math.abs(dashboardData.purchasesTrend.percentage),
              isPositive: dashboardData.purchasesTrend.percentage >= 0
            } : undefined}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Products"
            value={dashboardData?.totalProducts || 0}
            icon={<InventoryIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Low Stock Alert"
            value={dashboardData?.lowStockProducts || 0}
            icon={<WarningIcon />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Additional Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Customers"
            value={dashboardData?.totalCustomers || 0}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Suppliers"
            value={dashboardData?.totalSuppliers || 0}
            icon={<PeopleIcon />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Recent Sales and Top Products */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Sales
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData?.recentSales?.slice(0, 5).map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>#{sale.id}</TableCell>
                        <TableCell>{sale.customer?.fullName || 'N/A'}</TableCell>
                        <TableCell>${sale.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={sale.status}
                            color={
                              sale.status === 'completed'
                                ? 'success'
                                : sale.status === 'pending'
                                ? 'warning'
                                : 'error'
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No recent sales
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Top Products
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboardData?.topProducts?.slice(0, 5).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={product.stock}
                            color={product.stock < 10 ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                      </TableRow>
                    )) || (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No products available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;