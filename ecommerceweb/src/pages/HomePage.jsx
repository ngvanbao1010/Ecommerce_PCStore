import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Computer,
  Memory,
  Videocam,
  Speed,
  ArrowForward,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerError, setBannerError] = useState(false);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      const productsResponse = await productsAPI.getAll({
        page_size: 8,
        ordering: '-created_at'
      });
      setFeaturedProducts(productsResponse.data.results || []);

      const categoriesResponse = await categoriesAPI.getAll();
      const categoriesData = categoriesResponse.data;
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData?.results || []);
      
    } catch (err) {
  setError('Tải dữ liệu thất bại');
      console.error('Error loading home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const categoryIcons = {
    'CPU': <Speed />,
    'GPU': <Videocam />,
    'RAM': <Memory />,
    'Motherboard': <Computer />,
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Paper elevation={0} sx={{ mb: 6, borderRadius: 2, overflow: 'hidden' }}>
        {!bannerError ? (
          <Box
            component="img"
            src="/anhnentrangchu.png"
            alt="Khuyến mãi linh kiện PC"
            onError={() => setBannerError(true)}
            sx={{ display: 'block', width: '100%', height: 'auto' }}
          />
        ) : (
          <Box
            sx={{
              background: 'linear-gradient(135deg, #e53935 0%, #e35d5b 50%, #ffb74d 100%)',
              color: 'white',
              py: 8,
              px: 2,
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
              Ưu đãi linh kiện PC hấp dẫn
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
              Giảm giá sốc - Hàng chính hãng - Bảo hành đầy đủ
            </Typography>
          </Box>
        )}
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              onClick={() => navigate('/products')}
              endIcon={<ArrowForward />}
            >
              Mua ngay
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/pc-builder')}
            >
              Xây dựng PC
            </Button>
          </Box>
        </Container>
      </Paper>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" fontWeight="bold">
          Mua theo danh mục
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          overflowX: 'auto',
          gap: 2,
          py: 2,
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 4,
          },
        }}>
          {Array.isArray(categories) && categories.map((category) => (
            <Card
              key={category.id}
              sx={{
                flex: '0 0 150px',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate(`/products?category=${category.id}`)}
            >
              <CardContent sx={{ 
                textAlign: 'center', 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                height: '100%',
              }}>
                <Box
                  sx={{
                    fontSize: '2.5rem',
                    color: 'primary.main',
                    mb: 1,
                  }}
                >
                  {categoryIcons[category.name] || <Computer />}
                </Box>
                <Typography variant="subtitle1" component="h3" fontWeight="medium" sx={{ fontSize: '1rem' }}>
                  {category.name}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom textAlign="center" fontWeight="bold">
          Sản phẩm cửa hàng
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Box>
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/products')}
            endIcon={<ArrowForward />}
          >
            Xem tất cả sản phẩm
          </Button>
        </Box>
      </Box>

      <Paper sx={{ py: 6, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom fontWeight="bold">
            Vì sao chọn chúng tôi?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Box sx={{ fontSize: '3rem', mb: 2 }}>🚚</Box>
                <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                  Giao hàng nhanh
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Giao hàng nhanh chóng, đáng tin cậy tới tận nơi
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Box sx={{ fontSize: '3rem', mb: 2 }}>🛡️</Box>
                <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                  Bảo hành chính hãng
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sản phẩm chính hãng, bảo hành đầy đủ theo nhà sản xuất
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Box sx={{ fontSize: '3rem', mb: 2 }}>💰</Box>
                <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                  Giá tốt nhất
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Giá cạnh tranh cho mọi linh kiện máy tính
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>
    </Box>
  );
};

export default HomePage;
