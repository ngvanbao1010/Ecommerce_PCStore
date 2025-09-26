import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Search,
  FilterList,
  GridView,
  ViewList,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('ordering') || '-created_at');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [minInput, setMinInput] = useState(minPrice);
  const [maxInput, setMaxInput] = useState(maxPrice);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchQuery, selectedCategory, sortBy, minPrice, maxPrice]);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      const categoriesData = response.data;
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData?.results || []);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
  page_size: 15,
        ordering: sortBy,
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (minPrice !== '') params.min_price = minPrice;
      if (maxPrice !== '') params.max_price = maxPrice;

      const response = await productsAPI.getAll(params);
      const data = response.data;

      const results = Array.isArray(data) ? data : data?.results || [];
      const count = typeof data?.count === 'number' ? data.count : results.length;
      setProducts(results);
      setTotalPages(Math.max(1, Math.ceil(count / 15)));

      const newParams = new URLSearchParams();
      if (searchQuery) newParams.set('search', searchQuery);
      if (selectedCategory) newParams.set('category', selectedCategory);
      if (sortBy) newParams.set('ordering', sortBy);
      if (minPrice !== '') newParams.set('min_price', String(minPrice));
      if (maxPrice !== '') newParams.set('max_price', String(maxPrice));
      setSearchParams(newParams);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearchQuery(searchInput.trim());
  };

  const commitPriceFilters = () => {
    setCurrentPage(1);
    setMinPrice(minInput !== '' ? String(minInput).trim() : '');
    setMaxPrice(maxInput !== '' ? String(maxInput).trim() : '');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('-created_at');
    setMinPrice('');
    setMaxPrice('');
    setSearchInput('');
    setMinInput('');
    setMaxInput('');
    setCurrentPage(1);
    setSearchParams({});
  };

  if (loading && products.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">Sản phẩm</Typography>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSearch}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm sản phẩm..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Danh mục"
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  sx={{ minWidth: 220 }}
                >
                  <MenuItem value="">Tất cả danh mục</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Sắp xếp</InputLabel>
                <Select
                  value={sortBy}
                  label="Sắp xếp"
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <MenuItem value="-created_at">Mới nhất</MenuItem>
                  <MenuItem value="created_at">Cũ nhất</MenuItem>
                  <MenuItem value="name">Tên A-Z</MenuItem>
                  <MenuItem value="-name">Tên Z-A</MenuItem>
                  <MenuItem value="price">Giá tăng dần</MenuItem>
                  <MenuItem value="-price">Giá giảm dần</MenuItem>
                  <MenuItem value="-avg_rating">Đánh giá</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                label="Giá tối thiểu"
                type="number"
                value={minInput}
                onChange={(e) => setMinInput(e.target.value)}
                onBlur={commitPriceFilters}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                fullWidth
                label="Giá tối đa"
                type="number"
                value={maxInput}
                onChange={(e) => setMaxInput(e.target.value)}
                onBlur={commitPriceFilters}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<Search />}
                  sx={{ flex: 1, maxWidth: 220 }}
                >
                  Tìm kiếm
                </Button>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<FilterList />}
                >
                  Xoá lọc
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {(selectedCategory || searchQuery || minPrice || maxPrice) && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {searchQuery && (
              <Chip
                label={`Search: ${searchQuery}`}
                onDelete={() => {
                  setSearchInput('');
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
              />
            )}
            {selectedCategory && (
              <Chip
                label={`Category: ${categories.find(c => c.id == selectedCategory)?.name}`}
                onDelete={() => {
                  setSelectedCategory('');
                  setCurrentPage(1);
                }}
              />
            )}
            {minPrice !== '' && (
              <Chip
                label={`Min: ${formatPrice(minPrice)}`}
                onDelete={() => {
                  setMinInput('');
                  setMinPrice('');
                  setCurrentPage(1);
                }}
              />
            )}
            {maxPrice !== '' && (
              <Chip
                label={`Max: ${formatPrice(maxPrice)}`}
                onDelete={() => {
                  setMaxInput('');
                  setMaxPrice('');
                  setCurrentPage(1);
                }}
              />
            )}
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {products.length > 0 ? `Hiển thị ${products.length} sản phẩm` : 'Không tìm thấy sản phẩm'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('grid')}
            startIcon={<GridView />}
            size="small"
          >
            Lưới
          </Button>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('list')}
            startIcon={<ViewList />}
            size="small"
          >
            Danh sách
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : products.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>Không tìm thấy sản phẩm</Typography>
          <Button variant="outlined" onClick={clearFilters}>Xoá tất cả bộ lọc</Button>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(4, 1fr)',
                    lg: 'repeat(5, 1fr)',
                  },
                  gap: 2,
                }}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Box>
            </Grid>
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ProductsPage;
