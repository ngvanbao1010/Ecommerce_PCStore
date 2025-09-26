import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Avatar,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { formatPrice } from '../../utils/helpers';
import { Link as RouterLink } from 'react-router-dom';

const PCPartRow = ({ index, label, product, qty = 1, onEdit, onDelete, onSelect, onQtyChange, warning }) => {
  const hasProduct = !!product;
  return (
    <Paper variant="outlined" sx={{ p: 1.5, mb: 1.25 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '40px 1fr 110px 140px 180px', gap: 1.5, alignItems: 'center' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{index}.</Typography>
        {hasProduct ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 56 }}>
            <Avatar
              variant="rounded"
              src={product.image}
              alt={product.name}
              sx={{ width: 56, height: 56 }}
              component={RouterLink}
              to={`/products/${product.id}`}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600 }}
                component={RouterLink}
                to={`/products/${product.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {product.name}
              </Typography>
              {warning && (
                <Typography variant="caption" color="warning.main" sx={{ display: 'block' }}>{warning}</Typography>
              )}
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">Chưa chọn {label}</Typography>
        )}

        <TextField
          size="small"
          type="number"
          value={qty}
          onChange={(e) => onQtyChange?.(Math.max(1, parseInt(e.target.value || '1', 10)))}
          inputProps={{ min: 1, style: { textAlign: 'center' } }}
        />

        <Typography variant="subtitle1" sx={{ textAlign: 'right', pr: 1 }}>
          {hasProduct ? formatPrice(product.price) : '-'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>
            {hasProduct ? formatPrice((Number(product.price) || 0) * qty) : formatPrice(0)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {hasProduct ? (
              <>
                <Tooltip title="Đổi linh kiện">
                  <IconButton size="small" onClick={onEdit}>
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xoá">
                  <IconButton size="small" color="error" onClick={onDelete}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Button variant="outlined" size="small" onClick={onSelect}>Chọn {label}</Button>
            )}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default PCPartRow;
