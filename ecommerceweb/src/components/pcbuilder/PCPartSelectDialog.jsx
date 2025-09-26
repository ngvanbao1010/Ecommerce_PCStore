import React, { useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Typography,
  Rating,
  InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { formatPrice } from '../../utils/helpers';

const PCPartSelectDialog = ({ open, onClose, products = [], onSelect, title = 'Chọn linh kiện' }) => {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return products;
    return products.filter(p =>
      (p.name || '').toLowerCase().includes(query) ||
      (p.brand || '').toLowerCase().includes(query)
    );
  }, [q, products]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          placeholder="Tìm theo tên hoặc hãng..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <List dense>
          {filtered.map((p) => (
            <ListItem
              key={p.id}
              secondaryAction={
                <Button variant="outlined" size="small" onClick={() => onSelect?.(p)}>
                  Chọn
                </Button>
              }
            >
              <ListItemAvatar>
                <Avatar variant="rounded" src={p.image} alt={p.name} sx={{ width: 56, height: 56 }} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                    {p.brand && (
                      <Typography variant="caption" color="text.secondary">• {p.brand}</Typography>
                    )}
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Rating size="small" value={Number(p.average_rating) || 0} precision={0.1} readOnly />
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                      {formatPrice(p.price)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
          {filtered.length === 0 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">Không có sản phẩm phù hợp.</Typography>
            </Box>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PCPartSelectDialog;
