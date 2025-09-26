import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, IconButton, CircularProgress, TextField, MenuItem, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import { Edit, Search } from '@mui/icons-material';
import { ordersAPI } from '../../services/api';
import { formatPrice } from '../../utils/helpers';

const AdminOrdersPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const load = async () => {
    try {
      setLoading(true);
  const res = await ordersAPI.getAll({ scope: 'all', page_size: 1000 });
      let list = res.data?.results || res.data || [];
      if (statusFilter) list = list.filter(o => o.status === statusFilter);
      if (search) {
        const s = search.toLowerCase();
        const sDigits = s.replace(/[^0-9]/g, '');
        list = list.filter(o => {
          const orderNo = (o.order_number || '').toLowerCase();
          const phone = (o.user_phone || '').toString();
          const phoneDigits = phone.replace(/[^0-9]/g, '');
          const byOrder = orderNo.includes(s);
          const byPhone = sDigits ? phoneDigits.includes(sDigits) : phone.toLowerCase().includes(s);
          return byOrder || byPhone;
        });
      }
      setRows(list);
    } catch (e) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter, search]);
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const statusColor = (st) => st === 'completed' ? 'success' : st === 'cancelled' ? 'default' : 'warning';
  const statusLabel = (st) => st === 'completed' ? 'Hoàn tất' : st === 'cancelled' ? 'Đã huỷ' : 'Chờ xử lý';
  const paymentMethodColor = (m) => {
    const mm = (m || '').toString().toUpperCase();
    if (mm === 'MOMO' || mm === 'VNPAY') return 'info';
    if (mm === 'BANK') return 'secondary';
    return 'default'; // COD or others
  };

  const openDetail = async (row) => {
    try {
      const res = await ordersAPI.getById(row.id);
      setDetail(res.data);
    } catch (e) {
      setDetail(row); // fallback
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdating(true);
      await ordersAPI.updateStatus(id, status);
      await load();
      setSnackbar({ open: true, message: 'Cập nhật trạng thái thành công', severity: 'success' });
      if (detail?.id === id) {
        const res = await ordersAPI.getById(id);
        setDetail(res.data);
      }
    } catch (e) {
      const msg = e?.response?.data ? JSON.stringify(e.response.data) : 'Cập nhật trạng thái thất bại';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const updatePayment = async (id, payment_status) => {
    try {
      setUpdating(true);
      await ordersAPI.updatePaymentStatus(id, payment_status);
      await load();
      setSnackbar({ open: true, message: 'Cập nhật thanh toán thành công', severity: 'success' });
      if (detail?.id === id) {
        const res = await ordersAPI.getById(id);
        setDetail(res.data);
      }
    } catch (e) {
      const msg = e?.response?.data ? JSON.stringify(e.response.data) : 'Cập nhật thanh toán thất bại';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5" fontWeight={700}>Quản trị đơn hàng</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Tìm theo mã hoặc số điện thoại"
            value={searchInput}
            onChange={(e)=>setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              )
            }}
            sx={{ minWidth: 260 }}
          />
          <TextField size="small" select label="Trạng thái" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ xử lý</MenuItem>
            <MenuItem value="completed">Hoàn tất</MenuItem>
            <MenuItem value="cancelled">Đã huỷ</MenuItem>
          </TextField>
        </Box>
      </Box>
     <Paper sx={{ p: 2 }}>
  {loading ? (
    <Box textAlign="center" py={6}><CircularProgress /></Box>
  ) : error ? (
    <Box sx={{ color: 'error.main' }}>{error}</Box>
  ) : (
    <Table
      size="small"
      sx={{
        tableLayout: 'fixed',
        width: '100%',
        '& th, & td': { 
          px: 1.5, 
          py: 1.25,
          borderRight: '1px solid rgba(224, 224, 224, 1)',
          '&:last-child': {
            borderRight: 'none'
          }
        },
        '& th': {
          fontWeight: 600,
          backgroundColor: 'rgba(0, 0, 0, 0.02)'
        }
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: '14%' }}>Mã đơn</TableCell>
          <TableCell sx={{ width: '16%' }}>Họ tên</TableCell>
          <TableCell sx={{ width: '14%' }}>SĐT</TableCell>
          <TableCell sx={{ width: '16%' }}>Tổng tiền</TableCell>
          <TableCell sx={{ width: '20%' }}>Thanh toán</TableCell>
          <TableCell sx={{ width: '12%' }}>Trạng thái</TableCell>
          <TableCell sx={{ width: '8%' }} align="center">Thao tác</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(r => (
          <TableRow 
            key={r.id} 
            hover
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <TableCell 
              sx={{ 
                cursor: 'pointer', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }} 
              onClick={() => openDetail(r)}
            >
              {r.order_number}
            </TableCell>
            <TableCell sx={{ 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}>
              {r.user_full_name || r.user_name}
            </TableCell>
            <TableCell sx={{ 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}>
              {r.user_phone || '-'}
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 500 }}>
              {formatPrice(r.total_amount)}
            </TableCell>
            <TableCell>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5, 
                flexWrap: 'wrap' 
              }}>
                <Chip 
                  size="small" 
                  variant="outlined" 
                  color={paymentMethodColor(r.payment_method)} 
                  label={(r.payment_method || '').toUpperCase()}
                  sx={{ fontSize: '0.75rem' }}
                />
                <Chip 
                  size="small" 
                  color={statusColor(r.payment_status)} 
                  label={statusLabel(r.payment_status)}
                  sx={{ fontSize: '0.75rem' }}
                />
              </Box>
            </TableCell>
            <TableCell>
              <Chip 
                size="small" 
                color={statusColor(r.status)} 
                label={statusLabel(r.status)}
                sx={{ fontSize: '0.75rem' }}
              />
            </TableCell>
            <TableCell align="center">
              <IconButton 
                size="small" 
                onClick={() => openDetail(r)}
                sx={{
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText'
                  }
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )}
</Paper>

      <Dialog open={!!detail} onClose={() => setDetail(null)} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        <DialogContent dividers>
          {detail && (
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Mã: {detail.order_number}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>Người đặt: {detail.user_full_name || detail.user_name}</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>SĐT: {detail.user_phone || '-'}</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Địa chỉ: {detail.shipping_address}</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Sản phẩm</TableCell>
                    <TableCell align="right">SL</TableCell>
                    <TableCell align="right">Đơn giá</TableCell>
                    <TableCell align="right">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(detail.details || []).map(d => (
                    <TableRow key={d.id}>
                      <TableCell>{d.product_name}</TableCell>
                      <TableCell align="right">{d.quantity}</TableCell>
                      <TableCell align="right">{formatPrice(d.unit_price)}</TableCell>
                      <TableCell align="right">{formatPrice(d.total_price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Tổng cộng: {formatPrice(detail.total_amount)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {detail && (
            <Box sx={{ display: 'flex', gap: 3, p: 1.5, alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body2" fontWeight={600}>Trạng thái đơn:</Typography>
                <Button variant="outlined" size="small" disabled={updating} onClick={() => updateStatus(detail.id, 'pending')}>Chờ xử lý</Button>
                <Button variant="outlined" size="small" disabled={updating} onClick={() => updateStatus(detail.id, 'completed')}>Hoàn tất</Button>
                <Button variant="outlined" size="small" disabled={updating} onClick={() => updateStatus(detail.id, 'cancelled')}>Huỷ</Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="body2" fontWeight={600}>Trạng thái thanh toán:</Typography>
                <Button variant="outlined" size="small" disabled={updating} onClick={() => updatePayment(detail.id, 'pending')}>Chờ thanh toán</Button>
                <Button variant="outlined" size="small" disabled={updating} onClick={() => updatePayment(detail.id, 'completed')}>Đã thanh toán</Button>
                <Button variant="outlined" size="small" disabled={updating} onClick={() => updatePayment(detail.id, 'cancelled')}>Huỷ thanh toán</Button>
              </Box>
              <Box sx={{ flex: 1 }} />
              <Button onClick={() => setDetail(null)}>Đóng</Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminOrdersPage;
