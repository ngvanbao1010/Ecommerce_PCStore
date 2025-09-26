import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  Box,
  Alert,
  CircularProgress,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import { ordersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart, loadCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(1);
  const [createdOrder, setCreatedOrder] = useState(null);

  useEffect(() => {
    if (user?.address) setShippingAddress(user.address);
    if (user?.full_name) setFullName(user.full_name);
    if (user?.phone) setPhone(user.phone);
    if (!cartItems || cartItems.length === 0) {
      loadCart();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!fullName.trim()) {
      setError('Vui lòng nhập họ và tên');
      return;
    }
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại');
      return;
    }
    if (!shippingAddress.trim()) {
      setError('Vui lòng nhập địa chỉ giao hàng');
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      setError('Giỏ hàng trống');
      return;
    }
    try {
      setSubmitting(true);
      try {
        if ((user?.full_name || '') !== fullName || (user?.phone || '') !== phone) {
          await import('../services/api').then(({ authAPI }) => authAPI.updateProfile({ full_name: fullName.trim(), phone: phone.trim() }));
        }
      } catch (e) {
      }
      const payload = {
        payment_method: paymentMethod,
        shipping_address: shippingAddress.trim(),
        notes: notes.trim(),
      };
      const response = await ordersAPI.create(payload);
      clearCart();
      setCreatedOrder(response.data);
      setActiveStep(2);
      setSnackbar({ open: true, message: 'Đặt hàng thành công', severity: 'success' });
      return response.data;
    } catch (err) {
      console.error('Create order failed', err);
      setSnackbar({ open: true, message: 'Đặt hàng thất bại', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const isEmpty = !cartItems || cartItems.length === 0;
  const steps = ['Giỏ hàng', 'Thông tin giao hàng', 'Xác nhận'];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>Thanh toán</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Hoàn tất đơn hàng của bạn trong 2 bước.</Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {activeStep !== 2 && (
        <>
          {isEmpty && (
            <Alert severity="info" sx={{ mb: 2 }}>Giỏ hàng hiện trống. Hãy thêm sản phẩm trước.</Alert>
          )}
          <Grid container spacing={4} component="form" onSubmit={handleSubmit}>
            <Grid item xs={12} md={7}>
              <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 640 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>Thông tin người nhận</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Họ và tên"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      error={!!error && !fullName.trim()}
                      helperText={!fullName.trim() && error ? error : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={!!error && !phone.trim()}
                      helperText={!phone.trim() && error ? error : ''}
                      inputProps={{ inputMode: 'tel' }}
                    />
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" fontWeight={600} gutterBottom>Địa chỉ giao hàng</Typography>
                <TextField
                  multiline
                  minRows={3}
                  fullWidth
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, thành phố"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  error={!!error && !shippingAddress.trim()}
                  helperText={!shippingAddress.trim() && error ? error : ''}
                  sx={{ mb: 2 }}
                />
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" fontWeight={600} gutterBottom>Phương thức thanh toán</Typography>
                <RadioGroup
                  row
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  <FormControlLabel value="cod" control={<Radio />} label="COD" />
                  <FormControlLabel value="paypal" control={<Radio disabled />} label="PayPal (sắp có)" />
                </RadioGroup>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h6" fontWeight={600} gutterBottom>Ghi chú</Typography>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper elevation={4} sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 88 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>Tóm tắt đơn hàng</Typography>
                <List dense sx={{ maxHeight: 300, overflow: 'auto', mb: 1 }}>
                  {cartItems.map(item => (
                    <ListItem key={item.id} disableGutters sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={500} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product_name}</span>
                            <span>x{item.quantity}</span>
                          </Typography>
                        }
                        secondary={formatPrice(item.total_price)}
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2">Tạm tính</Typography>
                  <Typography variant="subtitle2" fontWeight={600}>{formatPrice(cartTotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2">Phí vận chuyển</Typography>
                  <Typography variant="subtitle2" color="success.main" fontWeight={600}>FREE</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight={700}>Tổng</Typography>
                  <Typography variant="h6" fontWeight={700} color="primary.main">{formatPrice(cartTotal)}</Typography>
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={submitting || isEmpty || !shippingAddress.trim()}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                  sx={{ fontWeight: 600, borderRadius: 2 }}
                >
                  {submitting ? 'Đang xử lý...' : 'Đặt hàng'}
                </Button>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {activeStep === 2 && createdOrder && (
        <Box sx={{ mt: 4 }}>
          <Paper elevation={4} sx={{ p: 5, textAlign: 'center', borderRadius: 4, maxWidth: 720, mx: 'auto' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>Đặt hàng thành công!</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Mã đơn hàng của bạn: <strong>#{createdOrder.id}</strong>. Chúng tôi sẽ xử lý và giao hàng sớm nhất.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button variant="contained" color="primary" onClick={() => navigate('/products')} sx={{ px: 4, py: 1.2, borderRadius: 3 }}>
                Tiếp tục mua sắm
              </Button>
              <Button variant="outlined" color="primary" onClick={() => navigate('/orders')} sx={{ px: 4, py: 1.2, borderRadius: 3 }}>
                Xem đơn hàng của tôi
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default CheckoutPage;
