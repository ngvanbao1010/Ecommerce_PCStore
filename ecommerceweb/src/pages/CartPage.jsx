import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  Tooltip,
  Stack,
} from '@mui/material';
import { Add, Remove, Delete, ArrowForward } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, cartTotal, loading, updateCartItem, removeFromCart, loadCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      loadCart();
    }
  }, []);

  const handleDecrease = (item) => {
    const newQty = item.quantity - 1;
    updateCartItem(item.id, newQty);
  };

  const handleIncrease = (item) => {
    updateCartItem(item.id, item.quantity + 1);
  };

  const handleRemove = (item) => {
    removeFromCart(item.id);
  };

  const isEmpty = !loading && (!cartItems || cartItems.length === 0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Giỏ hàng
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Kiểm tra lại sản phẩm trước khi thanh toán.
      </Typography>

      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, position: 'relative' }}>
        {loading && (
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.6)', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress size={40} />
          </Box>
        )}

        {isEmpty ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" gutterBottom>Giỏ hàng trống</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Hãy thêm vài sản phẩm yêu thích.</Typography>
            <Button variant="contained" onClick={() => navigate('/products')} size="large">Tiếp tục mua sắm</Button>
          </Box>
        ) : (
          <>
            <Table size="small" sx={{ mb: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Sản phẩm</TableCell>
                  <TableCell align="right">Đơn giá</TableCell>
                  <TableCell align="center" sx={{ width: 180 }}>Số lượng</TableCell>
                  <TableCell align="right">Thành tiền</TableCell>
                  <TableCell align="center">Xóa</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map(item => (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          variant="rounded"
                          src={item.product_image || '/placeholder-image.jpg'}
                          alt={item.product_name}
                          sx={{ width: 56, height: 56, bgcolor: 'grey.100' }}
                        />
                        <Box sx={{ cursor: 'pointer' }} onClick={() => navigate(`/products/${item.product}`)}>
                          <Typography variant="subtitle2" fontWeight={600} sx={{ maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.product_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">ID: {item.product}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 500 }}>{formatPrice(item.product_price)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleDecrease(item)} disabled={loading || item.quantity <= 0}>
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" sx={{ minWidth: 24 }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => handleIncrease(item)} disabled={loading}>
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{formatPrice(item.total_price)}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Xóa khỏi giỏ">
                        <span>
                          <IconButton color="error" size="small" onClick={() => handleRemove(item)} disabled={loading}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: 'space-between', gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/products')}>Tiếp tục mua sắm</Button>
              <Box textAlign={{ xs: 'left', md: 'right' }}>
                <Typography variant="subtitle2" color="text.secondary">Tạm tính:</Typography>
                <Typography variant="h5" fontWeight={700} color="primary.main">{formatPrice(cartTotal)}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>Chưa bao gồm phí vận chuyển.</Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ mt: 2, borderRadius: 2, fontWeight: 600 }}
                  onClick={() => navigate('/checkout')}
                  endIcon={<ArrowForward />}
                  disabled={cartItems.length === 0}
                >
                  Tiến hành thanh toán
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default CartPage;
