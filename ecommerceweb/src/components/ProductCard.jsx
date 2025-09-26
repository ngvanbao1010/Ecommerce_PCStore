import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Checkbox,
  FormControlLabel,
  IconButton,
  Rating,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { formatPrice } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { useCompare } from '../context/CompareContext';
import { Snackbar, Alert } from '@mui/material';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { items: compareItems, add: toggleCompare } = useCompare();
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'info' });
  const checked = !!compareItems.find(p => p.id === product?.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
  addToCart(product.id, 1);
  };

  if (!product) {
    return null;
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
        position: 'relative',
      }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <Box sx={{ position: 'relative', pt: '100%', backgroundColor: '#f5f5f5' }}>
        <CardMedia
          component="img"
          image={product.image || '/placeholder-image.jpg'}
          alt={product.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            p: 1,
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="body2"
            component="h3"
            title={product.name}
            sx={{
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontWeight: 500,
              lineHeight: '20px',
              height: '40px',
            }}
          >
            {product.name}
          </Typography>
          {typeof product.average_rating !== 'undefined' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <Rating size="small" value={Number(product.average_rating) || 0} precision={0.1} readOnly />
              {product.reviews_count ? (
                <Typography variant="caption" color="text.secondary">({product.reviews_count})</Typography>
              ) : null}
            </Box>
          )}
        </Box>
        
        <Box>
          <Typography
            variant="h6"
            component="div"
            color="error.main"
            fontWeight="bold"
          >
            {formatPrice(product.price)}
          </Typography>
          
          <Box sx={{ minHeight: '20px', mb: 1 }}>
            {product.original_price && product.original_price > product.price && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                >
                  {formatPrice(product.original_price)}
                </Typography>
                <Chip 
                  label={`-${Math.round(((product.original_price - product.price) / product.original_price) * 100)}%`}
                  color="error"
                  size="small"
                  sx={{ height: '18px', fontSize: '0.7rem' }}
                />
              </Box>
            )}
          </Box>

          <Typography variant="caption" sx={{ color: product.stock_quantity > 0 ? 'success.main' : 'text.secondary' }}>
            {product.stock_quantity > 0 ? '✓ Còn hàng' : 'Hết hàng'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, justifyContent: 'space-between' }}>
            <FormControlLabel
              control={<Checkbox size="small" checked={checked} />}
              label={<Typography variant="caption">So sánh</Typography>}
              onClick={(e) => {
                e.stopPropagation();
                const result = toggleCompare({ id: product.id, name: product.name, image: product.image, category: product.category });
                if (!result.ok) {
                  let msg = 'Không thể thêm';
                  if (result.reason === 'limit') msg = 'Chỉ so sánh tối đa 4 sản phẩm';
                  if (result.reason === 'category') msg = 'Chỉ so sánh các sản phẩm cùng danh mục';
                  setSnackbar({ open: true, message: msg, severity: 'warning' });
                } else {
                  setSnackbar({ open: true, message: result.removed ? 'Đã bỏ khỏi danh sách so sánh' : 'Đã thêm vào so sánh', severity: 'success' });
                }
              }}
            />
            <IconButton 
              size="small" 
              onClick={handleAddToCart}
              sx={{ 
                border: '1px solid',
                borderColor: 'grey.300',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  borderColor: 'primary.main',
                }
              }}
            >
              <ShoppingCart fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ProductCard;
