import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Container,
  Divider,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Snackbar,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  PersonAdd,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isValidEmail, isValidPhone } from '../utils/helpers';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();


  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const passwordScore = useMemo(() => {
    const pwd = formData.password || '';
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score; // 0-5
  }, [formData.password]);

  const passwordStrength = useMemo(() => {
    const map = ['Rất yếu', 'Yếu', 'Trung bình', 'Tốt', 'Mạnh', 'Xuất sắc'];
    return map[passwordScore] || 'Rất yếu';
  }, [passwordScore]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const full = (formData.full_name || '').trim();
    if (!full) newErrors.full_name = 'Vui lòng nhập Họ và tên';
    else if (full.split(/\s+/).length < 2) newErrors.full_name = 'Vui lòng nhập đầy đủ Họ và tên (ít nhất 2 từ)';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.password) newErrors.password = 'Vui lòng nhập mật khẩu';
    else if (formData.password.length < 8) newErrors.password = 'Tối thiểu 8 ký tự';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp';
    if (formData.phone_number && !isValidPhone(formData.phone_number)) newErrors.phone_number = 'Số điện thoại không hợp lệ';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      setErrors({});
      const full = (formData.full_name || '').trim();
      const parts = full.split(/\s+/);
      const firstName = parts[parts.length - 1] || '';
      const lastName = parts.slice(0, -1).join(' ');
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
        password_confirm: formData.confirmPassword,
        first_name: firstName,
        last_name: lastName,
        phone: formData.phone_number.trim(),
        address: formData.address.trim(),
      };
      const result = await register(payload);
      if (result.success) {
        navigate('/');
      }
      else {
        const backendErrors = result.error || {};
        if (typeof backendErrors === 'string') setErrors({ form: backendErrors });
        else {
          const normalized = {};
          Object.keys(backendErrors).forEach(k => {
            const v = backendErrors[k];
            normalized[k] = Array.isArray(v) ? v[0] : v;
          });
          if (!normalized.full_name && (normalized.first_name || normalized.last_name)) {
            normalized.full_name = normalized.first_name || normalized.last_name;
          }
            setErrors(normalized);
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrors({ form: err.response?.data?.detail || err.message || 'Đăng ký thất bại' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        position: 'relative',
        '&:before': {
          content: '""',
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 30%, #42a5f5 60%, #90caf9 100%)',
          zIndex: -2,
        },
        '&:after': {
          content: '""',
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15), transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2), transparent 55%)',
          zIndex: -1,
          pointerEvents: 'none'
        }
      }}
    >
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            px: { xs: 4, sm: 6 },
            py: { xs: 5, sm: 6 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            borderRadius: 5,
            maxWidth: 640,
            mx: 'auto',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.86) 100%)',
            backdropFilter: 'blur(18px)',
            boxShadow: '0 12px 40px -4px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.5)'
          }}
        >
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 3, py: 1.2, borderRadius: 3, bgcolor: 'primary.main', color: 'primary.contrastText', boxShadow: '0 4px 14px rgba(25,118,210,0.45)' }}>
              <PersonAdd sx={{ fontSize: 30, mr: 1 }} />
              <Typography component="h1" variant="h5" sx={{ fontWeight: 700, letterSpacing: .5 }}>
                Tạo tài khoản
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Tham gia hôm nay và bắt đầu trải nghiệm PC hoàn hảo của bạn.
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            {errors.form && (
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                {errors.form}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                required
                fullWidth
                id="full_name"
                label="Họ và tên"
                name="full_name"
                autoComplete="name"
                value={formData.full_name}
                onChange={handleChange}
                error={!!errors.full_name}
                helperText={errors.full_name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Box>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password || 'Ít nhất 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="hiện/ẩn mật khẩu"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ mt: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {[0,1,2,3,4].map(i => (
                      <Box
                        key={i}
                        sx={{
                          flex: 1,
                          height: 6,
                          borderRadius: 3,
                          transition: 'background-color .3s',
                          backgroundColor: i < passwordScore ? ['#d32f2f','#ed6c02','#fbc02d','#2e7d32','#2e7d32'][Math.min(passwordScore-1,4)] : 'rgba(0,0,0,0.1)'
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                    Độ mạnh: {passwordStrength}
                  </Typography>
                </Box>
              </Box>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Xác nhận mật khẩu"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword || 'Nhập lại mật khẩu chính xác'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="hiện/ẩn xác nhận mật khẩu"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                name="phone_number"
                label="Số điện thoại (Không bắt buộc)"
                id="phone_number"
                autoComplete="tel"
                value={formData.phone_number}
                onChange={handleChange}
                error={!!errors.phone_number}
                helperText={errors.phone_number}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                name="address"
                label="Địa chỉ (Không bắt buộc)"
                id="address"
                autoComplete="street-address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                multiline
                rows={3}
              />
            </Box>
            
            <Box sx={{ mt: 1.5 }}>
              <FormControlLabel
                control={<Checkbox checked={agreeTerms} onChange={(e)=>{ setAgreeTerms(e.target.checked); if (errors.terms) setErrors(prev=>({...prev, terms: ''})); }} />}
                label={<Typography variant="body2">Tôi đồng ý với <Link component={RouterLink} to="#">Điều khoản sử dụng</Link> và <Link component={RouterLink} to="#">Chính sách bảo mật</Link></Typography>}
              />
              {errors.terms && (
                <Typography variant="caption" color="error">{errors.terms}</Typography>
              )}
            </Box>
            
            <Box sx={{ mt: 4 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.6,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: 3,
                  textTransform: 'none',
                  letterSpacing: .4,
                  background: 'linear-gradient(90deg,#1565c0,#1e88e5)',
                  boxShadow: '0 4px 18px rgba(21,101,192,0.45)',
                  '&:hover': {
                    background: 'linear-gradient(90deg,#0d47a1,#1565c0)',
                    boxShadow: '0 6px 22px rgba(13,71,161,0.55)'
                  }
                }}
              >
                {loading ? <CircularProgress size={26} color="inherit" /> : 'Tạo tài khoản'}
              </Button>
            </Box>
            
            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Đã có tài khoản?{' '}
                <Link component={RouterLink} to="/login" variant="body2" sx={{ fontWeight: 'bold' }}>
                  Đăng nhập
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
