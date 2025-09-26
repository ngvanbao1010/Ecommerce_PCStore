import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import { productsAPI } from '../services/api';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import { formatPrice } from '../utils/helpers';

const ComparePage = () => {
  const { items, clear } = useCompare();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);

  const ids = items.map(p => p.id);

  useEffect(() => {
    const load = async () => {
      if (ids.length < 2) return;
      try {
        setLoading(true);
        const res = await productsAPI.compare(ids);
        setData(res.data);
      } catch (e) {
        setError('Không thể so sánh lúc này');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ids.join(',')]);

  const specKeys = useMemo(() => {
    const set = new Set();
    data.forEach(p => {
      if (p.specifications) {
        Object.keys(p.specifications).forEach(k => set.add(k));
      }
    });
    const priority = ['socket','chipset','cores','threads','base_clock','boost_clock','tdp','cache'];
    const arr = Array.from(set);
    arr.sort((a,b) => {
      const ia = priority.indexOf(a);
      const ib = priority.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return arr;
  }, [data]);

  if (ids.length < 2) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h5" gutterBottom>So sánh sản phẩm</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>Chọn ít nhất 2 sản phẩm để so sánh.</Alert>
        <Button variant="contained" onClick={() => navigate('/products')}>Quay lại danh sách sản phẩm</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" fontWeight={700}>So sánh sản phẩm</Typography>
        <Box display="flex" gap={1}>
          <Button variant="outlined" onClick={() => navigate('/products')}>Thêm sản phẩm</Button>
          <Button variant="text" color="error" onClick={clear}>Xóa tất cả</Button>
        </Box>
      </Box>
      {loading && <Box py={6} textAlign="center"><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && !error && data.length > 0 && (
        <Paper elevation={4} sx={{ overflowX: 'auto', borderRadius: 3 }}>
          <Table size="small" sx={{ minWidth: 900, '& th, & td': { borderColor: 'divider' } }}>
            <TableHead>
              <TableRow>
                <TableCell width={180} sx={{ position: 'sticky', left: 0, zIndex: 2, bgcolor: 'background.paper', fontWeight: 700, boxShadow: 1 }} />
                {data.map(p => (
                  <TableCell key={p.id} align="center" sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>{p.name}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow hover>
                <TableCell sx={{ fontWeight: 600, position: 'sticky', left: 0, bgcolor: 'background.paper' }}>Ảnh</TableCell>
                {data.map(p => (
                  <TableCell key={p.id} align="center" sx={{ py: 2 }}>
                    <Box sx={{ width: 120, height: 120, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box component="img" src={p.image} alt={p.name} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
              <TableRow hover>
                <TableCell sx={{ fontWeight: 600, position: 'sticky', left: 0, bgcolor: 'background.paper' }}>Giá bán</TableCell>
                {data.map(p => (
                  <TableCell key={p.id} align="center">
                    <Typography color="error.main" fontWeight={700}>{formatPrice(p.price)}</Typography>
                    <Button size="small" variant="outlined" sx={{ mt: 1 }} onClick={() => navigate(`/products/${p.id}`)}>Đặt mua</Button>
                  </TableCell>
                ))}
              </TableRow>
              {specKeys.map((key, idx) => (
                <TableRow key={key} hover sx={{ bgcolor: idx % 2 === 0 ? 'grey.50' : 'background.paper' }}>
                  <TableCell sx={{ fontWeight: 600, textTransform: 'lowercase', position: 'sticky', left: 0, bgcolor: idx % 2 === 0 ? 'grey.50' : 'background.paper' }}>{key}</TableCell>
                  {data.map(p => (
                    <TableCell key={p.id} sx={{ whiteSpace: 'pre-wrap' }}>
                      {p.specifications?.[key] || <Typography variant="caption" color="text.secondary">-</Typography>}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default ComparePage;
