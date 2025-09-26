import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
  Alert,
  Box,
  Button,
  Tooltip,
  Snackbar,
  Alert as MuiAlert,
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

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
  const res = await ordersAPI.getAll({ scope: 'mine' });
        let data = res.data;
        if (!Array.isArray(data)) {
          if (Array.isArray(data?.results)) data = data.results;
          else if (Array.isArray(data?.items)) data = data.items;
          else data = [];
        }
        setOrders(data);
      } catch (e) {
        setError('Không tải được danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>Đơn hàng của tôi</Typography>
      {loading && <Box display="flex" justifyContent="center" py={8}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && !error && (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn</TableCell>
                <TableCell width="120">Trạng thái</TableCell>
                <TableCell width="130">Thanh toán</TableCell>
                <TableCell>Địa chỉ giao hàng</TableCell>
                <TableCell align="right">Tổng</TableCell>
                <TableCell>Ngày tạo</TableCell>
                <TableCell width="130" align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map(o => (
                <TableRow key={o.id} hover sx={{ cursor: 'pointer' }} onClick={(e) => {
                  const tag = e.target.tagName.toLowerCase();
                  if (['button', 'svg', 'path'].includes(tag)) return;
                  navigate(`/orders/${o.id}`);
                }}>
                  <TableCell>{o.order_number}</TableCell>
                  <TableCell><Chip size="small" label={o.status} color={statusColor(o.status)} /></TableCell>
                  <TableCell><Chip size="small" label={o.payment_status} color={o.payment_status === 'completed' ? 'success' : 'default'} /></TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ display: 'block', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.shipping_address}</Typography>
                  </TableCell>
                  <TableCell align="right" style={{ fontWeight: 600 }}>{formatPrice(o.total_amount)}</TableCell>
                  <TableCell>{formatDateTime(o.created_at)}</TableCell>
                  <TableCell align="center">
                    {o.status === 'pending' ? (
                      <Tooltip title="Hủy đơn">
                        <span>
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            disabled={cancellingId === o.id}
                            onClick={() => { setPendingCancelId(o.id); setConfirmOpen(true); }}
                          >
                            {cancellingId === o.id ? 'Đang hủy...' : 'Hủy'}
                          </Button>
                        </span>
                      </Tooltip>
                    ) : (
                      <Typography variant="caption" color="text.secondary">—</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" style={{ padding: '2rem' }}>
                    <Typography variant="body2" color="text.secondary">Chưa có đơn hàng nào.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert severity={snackbar.severity} variant="filled" onClose={() => setSnackbar(s => ({ ...s, open: false }))} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
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
          <Button color="error" variant="contained" onClick={async () => {
            if (!pendingCancelId) return;
            try {
              setCancellingId(pendingCancelId);
              await ordersAPI.cancel(pendingCancelId);
              setOrders(prev => prev.map(x => x.id === pendingCancelId ? { ...x, status: 'cancelled', payment_status: 'cancelled' } : x));
              setSnackbar({ open: true, message: 'Hủy đơn thành công', severity: 'success' });
            } catch (e) {
              setSnackbar({ open: true, message: 'Hủy đơn thất bại', severity: 'error' });
            } finally {
              setCancellingId(null);
              setPendingCancelId(null);
              setConfirmOpen(false);
            }
          }}>Hủy đơn</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrdersPage;
