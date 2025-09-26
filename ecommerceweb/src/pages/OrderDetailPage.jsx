import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Breadcrumbs,
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { ordersAPI } from '../services/api';
import { formatPrice, formatDateTime } from '../utils/helpers';

const statusColor = (status) => {
  switch (status) {
    case 'completed': return 'success';
    case 'cancelled': return 'error';
    default: return 'warning';
  }
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await ordersAPI.getById(id);
        setOrder(res.data);
      } catch (e) {
        setError('Không tải được đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCancel = async () => {
    if (!order || order.status !== 'pending') return;
    try {
      setCancelling(true);
      await ordersAPI.cancel(order.id);
      setOrder(prev => ({ ...prev, status: 'cancelled', payment_status: 'cancelled' }));
      setSnackbar({ open: true, message: 'Đã hủy đơn hàng', severity: 'success' });
    } catch (e) {
      setSnackbar({ open: true, message: 'Hủy đơn thất bại', severity: 'error' });
    } finally {
      setCancelling(false);
      setConfirmOpen(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Breadcrumbs sx={{ mb: 2 }} aria-label="breadcrumb">
        <MuiLink underline="hover" color="inherit" onClick={() => navigate('/orders')} sx={{ cursor: 'pointer' }}>
          Đơn hàng của tôi
        </MuiLink>
        <Typography color="text.primary">Chi tiết</Typography>
      </Breadcrumbs>
      {loading && <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && !error && order && (
        <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2} mb={2}>
            <Typography variant="h5" fontWeight={700}>Đơn hàng #{order.order_number}</Typography>
            <Box display="flex" gap={1}>
              <Chip label={`Trạng thái: ${order.status}`} color={statusColor(order.status)} />
              {order.payment_status !== order.status && (
                <Chip label={`Thanh toán: ${order.payment_status}`} color={order.payment_status === 'completed' ? 'success' : 'default'} />
              )}
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Tạo lúc: {formatDateTime(order.created_at)}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Địa chỉ giao hàng</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>{order.shipping_address}</Typography>
          {order.notes && (
            <>
              <Typography variant="h6" gutterBottom>Ghi chú</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>{order.notes}</Typography>
            </>
          )}
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Sản phẩm</Typography>
          <List dense>
            {order.details?.map(d => (
              <ListItem key={d.id} disableGutters sx={{ py: 0.5 }}>
                <ListItemText
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  primary={`${d.product_name} x${d.quantity}`}
                  secondary={formatPrice(d.total_price)}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="subtitle1" fontWeight={600}>Tổng tiền</Typography>
            <Typography variant="h6" fontWeight={700}>{formatPrice(order.total_amount)}</Typography>
          </Box>
          <Box mt={4} display="flex" gap={2} flexWrap="wrap">
            <Button variant="contained" onClick={() => navigate('/products')}>Tiếp tục mua sắm</Button>
            <Button variant="outlined" onClick={() => navigate('/orders')}>Quay lại danh sách</Button>
            {order.status === 'pending' && (
              <Button
                variant="outlined"
                color="error"
                disabled={cancelling}
                onClick={() => setConfirmOpen(true)}
              >
                {cancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
              </Button>
            )}
          </Box>
        </Paper>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar(s => ({ ...s, open: false }))} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Xác nhận hủy đơn</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Không</Button>
          <Button color="error" variant="contained" disabled={cancelling} onClick={handleCancel}>
            {cancelling ? 'Đang hủy...' : 'Hủy đơn'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderDetailPage;
