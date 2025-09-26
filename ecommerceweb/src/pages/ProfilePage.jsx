import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Avatar,
  InputAdornment,
  IconButton,
  CircularProgress,
  Snackbar,
  Divider,
  Alert,
} from '@mui/material';
import { Person, Email, Phone, Home, PhotoCamera, Save } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { isValidPhone } from '../utils/helpers';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
  let preview = user.avatar || '';
      if (preview && preview.startsWith('/')) {
        preview = `${window.location.origin}${preview}`;
      }
      setAvatarPreview(preview);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Họ tên là bắt buộc';
    if (formData.phone && !isValidPhone(formData.phone)) newErrors.phone = 'Số điện thoại không hợp lệ';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      const payload = {
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      };
      if (avatarFile) payload.avatarFile = avatarFile;
      const result = await updateProfile(payload);
      if (result.success) {
        setSnackbar({ open: true, message: 'Cập nhật hồ sơ thành công', severity: 'success' });
  const newPreview = result.user.avatar || avatarPreview;
        if (newPreview.startsWith('http')) {
          setAvatarPreview(newPreview);
        } else {
          setAvatarPreview(avatarPreview); // keep existing until absolute URL available
        }
      } else {
        setSnackbar({ open: true, message: result.error || 'Cập nhật thất bại', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Lỗi cập nhật', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Hồ Sơ Người Dùng
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Quản lý thông tin cá nhân của bạn.
      </Typography>

      <Paper elevation={4} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={avatarPreview || undefined}
                  sx={{ width: 120, height: 120, fontSize: '2.2rem', bgcolor: 'primary.main' }}
                >
                  {(!avatarPreview && formData.full_name) ? formData.full_name.charAt(0) : ''}
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PhotoCamera />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Chọn ảnh
                </Button>
                <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1 }}>
                  Ảnh sẽ được lưu sau khi bấm "Lưu thay đổi".
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Họ tên"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    error={!!errors.full_name}
                    helperText={errors.full_name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Home fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={saving ? <CircularProgress size={20} /> : <Save />}
                    disabled={saving}
                    sx={{ borderRadius: 2, fontWeight: 'bold', px: 4 }}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
