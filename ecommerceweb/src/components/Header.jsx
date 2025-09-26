import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar,
  InputBase,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingCart,
  Search,
  AccountCircle,
  Menu as MenuIcon,
  ReceiptLong,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getInitials, getRandomColor } from '../utils/helpers';

const Header = ({ onMobileMenuOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
        {isAuthenticated ? [
        <MenuItem key="profile" onClick={() => { navigate('/profile'); handleMenuClose(); }}>
            Thông tin cá nhân
        </MenuItem>,
        (user?.role === 'admin' || user?.role === 'staff') ? (
          <MenuItem key="admin" onClick={() => { navigate('/admin'); handleMenuClose(); }}>
              Bảng điều khiển Admin
          </MenuItem>
        ) : null,
        <MenuItem key="logout" onClick={handleLogout}>
            Đăng xuất
        </MenuItem>
      ] : [
        <MenuItem key="login" onClick={() => { navigate('/login'); handleMenuClose(); }}>
            Đăng nhập
        </MenuItem>,
        <MenuItem key="register" onClick={() => { navigate('/register'); handleMenuClose(); }}>
            Đăng ký
        </MenuItem>
      ]}
    </Menu>
  );

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ gap: 2, minHeight: 64 }}>
        {isMobile && onMobileMenuOpen && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={onMobileMenuOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 0 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <Box
              component="img"
              src="/logoou.png"
              alt="OU Logo"
              draggable={false}
              sx={{
                height: { xs: 34, sm: 40, md: 44 },
                width: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                ml: 1.5,
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                fontSize: { xs: '0.95rem', sm: '1.1rem' },
              }}
            >
              Cửa hàng máy tính OU
            </Typography>
          </Box>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button color="inherit" onClick={() => navigate('/products')}>Sản phẩm</Button>
                <Button color="inherit" onClick={() => navigate('/pc-builder')}>Xây dựng cấu hình</Button>
            </Box>
          )}
        </Box>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', px: { xs: 0, md: 2 } }}>
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 2,
              px: 2,
              py: 0.75,
              width: '100%',
              maxWidth: { xs: '100%', sm: 520, md: 640, lg: 760 },
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)'
            }}
          >
            <Search sx={{ mr: 1, color: 'inherit' }} />
              <InputBase
                placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                color: 'inherit',
                width: '100%',
                fontSize: '0.95rem',
                '& .MuiInputBase-input': { padding: 0 }
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: 1 }}>
          <IconButton
            color="inherit"
            onClick={() => navigate('/cart')}
            aria-label="shopping cart"
          >
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {isAuthenticated && (
            <IconButton
              color="inherit"
              onClick={() => navigate('/orders')}
              aria-label="orders"
            >
              <ReceiptLong />
            </IconButton>
          )}

          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            {isAuthenticated && user ? (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: getRandomColor(),
                  fontSize: '0.875rem',
                }}
              >
                {getInitials(user.full_name || user.username)}
              </Avatar>
            ) : (
              <AccountCircle />
            )}
          </IconButton>
        </Box>
      </Toolbar>
      {renderMenu}
    </AppBar>
  );
};

export default Header;
