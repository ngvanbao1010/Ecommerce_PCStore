import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';
import {
  Box,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Button,
  Typography,
  Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CompareBar = () => {
  const { items, remove, clear } = useCompare();
  const navigate = useNavigate();
  if (items.length === 0) return null;

  return (
    <Fade in={items.length > 0}>
      <Paper elevation={6} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1300, p: 2, bgcolor: 'error.main', color: 'white' }}>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Typography variant="subtitle1" fontWeight={700} sx={{ minWidth: 160 }}>SO SÁNH SẢN PHẨM</Typography>
          <Box display="flex" gap={2} flexGrow={1} sx={{ overflowX: 'auto' }}>
            {items.map(p => (
              <Box key={p.id} sx={{ position: 'relative', background: 'white', color: 'black', borderRadius: 1, p: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 180 }}>
                <Avatar variant="square" src={p.image} alt={p.name} sx={{ width: 64, height: 64, mb: 1, bgcolor: 'transparent', objectFit: 'contain' }} />
                <Typography variant="caption" sx={{ textAlign: 'center', maxWidth: 160, height: 32, overflow: 'hidden' }}>{p.name}</Typography>
                <IconButton size="small" onClick={() => remove(p.id)} sx={{ position: 'absolute', top: 2, right: 2 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
          <Box display="flex" gap={1}>
            <Button variant="contained" color="inherit" disabled={items.length < 2} onClick={() => navigate('/compare')} sx={{ fontWeight: 700, bgcolor: 'white', color: 'error.main', '&:hover': { bgcolor: '#ffe5e5' } }}>SO SÁNH</Button>
            <Tooltip title="Xóa tất cả">
              <IconButton onClick={clear} sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
};

export default CompareBar;
