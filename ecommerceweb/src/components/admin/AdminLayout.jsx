import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, AppBar, Typography, IconButton
} from '@mui/material';
import {
  Inventory2, Category, ReceiptLong, QueryStats, ArrowBack
} from '@mui/icons-material';

const drawerWidth = 220;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { label: 'Sản phẩm', icon: <Inventory2 />, path: '/admin/products' },
    { label: 'Danh mục', icon: <Category />, path: '/admin/categories' },
    { label: 'Đơn hàng', icon: <ReceiptLong />, path: '/admin/orders' },
    { label: 'Thống kê', icon: <QueryStats />, path: '/admin/stats' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => navigate('/')}> 
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ ml: 1 }}>
            Bảng điều khiển Admin
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {items.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname.startsWith(item.path)}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
