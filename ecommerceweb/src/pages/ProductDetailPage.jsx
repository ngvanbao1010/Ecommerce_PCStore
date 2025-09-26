import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  Chip,
  Divider,
  Rating,
  TextField,
  Avatar,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  Compare,
  NavigateNext,
  Add,
  Remove,
  Send,
  Reply,
  VerifiedUser,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { productsAPI, reviewsAPI, commentsAPI } from '../services/api';
import { formatPrice, formatDateTime, getInitials, getRandomColor } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';

const TabPanel = React.memo(({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`product-tabpanel-${index}`}
    aria-labelledby={`product-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
));

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isItemInCart, getItemQuantity } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { add: toggleCompare, items: compareItems } = useCompare();
  const [product, setProduct] = useState(null);
  const compareChecked = useMemo(() => {
    if (!product) return false;
    return !!compareItems.find(p => p.id === product.id);
  }, [compareItems, product]);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [userReview, setUserReview] = useState(null);

  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyToComment, setReplyToComment] = useState(null);
  const [replyText, setReplyText] = useState('');
  const commentInputRef = useRef(null);

  useEffect(() => {
    if (id) {
      loadProductData();
    }
  }, [id]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      setError(null);

      const productResponse = await productsAPI.getById(id);
      setProduct(productResponse.data);

      const reviewsResponse = await reviewsAPI.getByProduct(id);
      const reviewsData = reviewsResponse.data;
      setReviews(Array.isArray(reviewsData) ? reviewsData : reviewsData?.results || []);

      if (isAuthenticated && Array.isArray(reviewsData)) {
        const userReviewFound = reviewsData.find(review => review.user === user?.id);
        setUserReview(userReviewFound);
      }

      const commentsResponse = await commentsAPI.getByProduct(id);
      const commentsData = commentsResponse.data;
      setComments(Array.isArray(commentsData) ? commentsData : commentsData?.results || []);

    } catch (err) {
      setError('Không tải được chi tiết sản phẩm');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const result = await addToCart(product.id, quantity);
      if (result.success) {
        setSnackbarMessage(`Đã thêm ${quantity} sản phẩm vào giỏ`);
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(result.error || 'Thêm vào giỏ thất bại');
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage('Thêm vào giỏ thất bại');
      setSnackbarOpen(true);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (userReview) {
      setSnackbarMessage('Bạn đã đánh giá rồi');
      setSnackbarOpen(true);
      return;
    }

    try {
      setReviewSubmitting(true);
      await reviewsAPI.create({
        product: product.id,
        rating: reviewRating,
      });
      
      setSnackbarMessage('Gửi đánh giá thành công');
      setSnackbarOpen(true);
  loadProductData();
    } catch (err) {
      // Try to detect duplicate review error shape
      const dup = err?.response?.data;
      if (dup && (dup.detail || JSON.stringify(dup).toLowerCase().includes('already'))) {
        setSnackbarMessage('Bạn đã đánh giá rồi');
      } else {
        setSnackbarMessage('Gửi đánh giá thất bại');
      }
      setSnackbarOpen(true);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!commentText.trim()) return;

    try {
      setCommentSubmitting(true);
      await commentsAPI.create({
        product: product.id,
        comment_text: commentText.trim(),
      });
      
      setCommentText('');
      setSnackbarMessage('Đăng bình luận thành công');
      setSnackbarOpen(true);
  loadProductData();
    } catch (err) {
      setSnackbarMessage('Đăng bình luận thất bại');
      setSnackbarOpen(true);
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;

    try {
      await commentsAPI.create({
        product: product.id,
        parent_comment: replyToComment.id,
        comment_text: replyText.trim(),
      });
      
      setReplyText('');
      setReplyDialogOpen(false);
      setReplyToComment(null);
      setSnackbarMessage('Đăng trả lời thành công');
      setSnackbarOpen(true);
  loadProductData();
    } catch (err) {
      setSnackbarMessage('Đăng trả lời thất bại');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (tabValue === 3 && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [tabValue]);

  const handleCommentChange = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Không tìm thấy sản phẩm'}</Alert>
      </Container>
    );
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Link component={RouterLink} to="/" underline="hover">
          Trang chủ
        </Link>
        <Link component={RouterLink} to="/products" underline="hover">
          Sản phẩm
        </Link>
        <Link 
          component={RouterLink} 
          to={`/products?category=${product.category}`} 
          underline="hover"
        >
          {product.category_name}
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start',
          gap: { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: '100%', md: '48%' },
            maxWidth: 620,
            position: 'relative'
          }}
        >
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              p: 2,
              bgcolor: 'background.paper',
              boxShadow: '0 8px 28px rgba(0,0,0,0.07)'
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 3',
                bgcolor: 'grey.100',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box
                component="img"
                src={product.image || '/placeholder-image.jpg'}
                alt={product.name}
                sx={{
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transition: 'transform .35s ease',
                  '&:hover': { transform: 'scale(1.03)' }
                }}
              />
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box sx={{ mb: 3 }}>
              <Chip 
                label={product.brand} 
                variant="outlined" 
                sx={{ mr: 1, fontWeight: 'medium' }} 
              />
              <Chip 
                label={product.category_name} 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 'medium' }}
              />
            </Box>

            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Rating value={product.average_rating || averageRating} precision={0.1} readOnly />
              <Typography variant="body1" sx={{ ml: 1, color: 'text.secondary' }}>
                ({product.reviews_count ?? reviews.length} đánh giá)
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                {formatPrice(product.price)}
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              {product.stock_quantity > 0 ? (
                <Chip 
                  label={`Còn ${product.stock_quantity} sản phẩm`} 
                  color="success" 
                  variant="outlined"
                  sx={{ fontWeight: 'medium' }}
                />
              ) : (
                <Chip 
                  label="Hết hàng" 
                  color="error" 
                  variant="outlined"
                  sx={{ fontWeight: 'medium' }}
                />
              )}
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
                Số lượng:
              </Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center',
                  borderRadius: 2
                }}
              >
                <IconButton 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  sx={{ borderRadius: 0 }}
                >
                  <Remove />
                </IconButton>
                <Typography sx={{ px: 3, py: 1, minWidth: 50, textAlign: 'center', fontWeight: 'medium' }}>
                  {quantity}
                </Typography>
                <IconButton 
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock_quantity}
                  sx={{ borderRadius: 0 }}
                >
                  <Add />
                </IconButton>
              </Paper>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                sx={{ 
                  flex: 1,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                Thêm vào giỏ
              </Button>
              <IconButton 
                size="large" 
                color="primary"
                sx={{ 
                  border: 1, 
                  borderColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                }}
              >
                <FavoriteBorder />
              </IconButton>
              <IconButton 
                size="large" 
                color="primary"
                sx={{ 
                  border: 1, 
                  borderColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                }}
              >
                <Share />
              </IconButton>
              <IconButton 
                size="large" 
                color={compareChecked ? 'success' : 'primary'}
                onClick={() => {
                  const result = toggleCompare({ id: product.id, name: product.name, image: product.image, category: product.category });
                  setSnackbarMessage(result.ok ? (result.removed ? 'Đã bỏ khỏi so sánh' : 'Đã thêm vào so sánh') : result.reason === 'category' ? 'Chỉ so sánh cùng danh mục' : 'Tối đa 4 sản phẩm');
                  setSnackbarOpen(true);
                }}
                sx={{ 
                  border: 1, 
                  borderColor: compareChecked ? 'success.main' : 'primary.main',
                  '&:hover': { backgroundColor: compareChecked ? 'success.light' : 'primary.light', color: 'white' }
                }}
              >
                <Compare />
              </IconButton>
            </Box>

            <Paper sx={{ p: 3, backgroundColor: 'grey.50', borderRadius: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Mô tả
              </Typography>
              <Typography variant="body1" color="text.secondary" lineHeight={1.6}>
                {product.description || 'Chưa có mô tả.'}
              </Typography>
            </Paper>
        </Box>
      </Box>

      <Box sx={{ mt: 8 }}>
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, newValue) => setTabValue(newValue)}
            aria-label="product details tabs"
            sx={{ 
              bgcolor: 'background.paper',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'medium',
                fontSize: '1rem'
              }
            }}
          >
            <Tab label="Mô tả" />
            <Tab label="Thông số" />
            <Tab label={`Đánh giá (${reviews.length})`} />
            <Tab label={`Bình luận (${comments.length})`} />
          </Tabs>
        </Paper>

        <TabPanel value={tabValue} index={0}>
          <Paper sx={{ p: 4, bgcolor: 'grey.50' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
              Mô tả sản phẩm
            </Typography>
            <Typography variant="body1" lineHeight={1.8} sx={{ fontSize: '1.1rem' }}>
              {product.description || 'Chưa có mô tả cho sản phẩm này.'}
            </Typography>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {(() => {
            let specsObj = {};
            try {
              const raw = product.specifications;
              if (typeof raw === 'string') {
                let parsed = JSON.parse(raw);
                if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch {}
                }
                specsObj = (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
              } else if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
                specsObj = raw;
              }
            } catch {}
            const hasSpecs = specsObj && Object.keys(specsObj).length > 0;
            return hasSpecs ? (
            <Paper sx={{ overflow: 'hidden' }}>
              <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ p: 3, pb: 2 }}>
                Thông số kỹ thuật
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', p: 3, pt: 0 }}>
                {Object.entries(specsObj).map(([key, value], index) => (
                  <Box 
                    key={key}
                    sx={{ 
                      width: { xs: '100%', sm: '50%', md: '33.333%' },
                      p: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                      '&:nth-of-type(even)': { 
                        bgcolor: 'grey.50' 
                      }
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      color="primary" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
                        letterSpacing: 1
                      }}
                    >
                      {key.replace(/_/g, ' ')}
                    </Typography>
                    <Typography 
                      variant="body1"
                      sx={{ 
                        fontWeight: 500,
                        wordBreak: 'break-word'
                      }}
                    >
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
            ) : (
            <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Chưa có thông số
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Chưa có thông số kỹ thuật cho sản phẩm này.
              </Typography>
            </Paper>
            );
          })()}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {isAuthenticated && !userReview && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Viết đánh giá
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography component="legend">Đánh giá</Typography>
                <Rating
                  value={reviewRating}
                  onChange={(event, newValue) => setReviewRating(newValue)}
                />
              </Box>
              <Button
                variant="contained"
                onClick={handleSubmitReview}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? <CircularProgress size={24} /> : 'Gửi đánh giá'}
              </Button>
            </Paper>
          )}
          {isAuthenticated && userReview && (
            <Alert severity="info" sx={{ mb: 3 }}>
              Bạn đã đánh giá sản phẩm này rồi (⭐ {userReview.rating}).
            </Alert>
          )}

          {reviews.length > 0 ? (
            <Grid container spacing={2}>
              {reviews.map((review) => (
                <Grid item xs={12} key={review.id}>
                  <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: getRandomColor(), mr: 2 }}>
                        {getInitials(review.user_name)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {review.user_name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={review.rating} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            {formatDateTime(review.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Chưa có đánh giá. Hãy là người đầu tiên!
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          {isAuthenticated && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Thêm bình luận
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Nhập bình luận..."
                value={commentText}
                onChange={handleCommentChange}
                inputRef={commentInputRef}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<Send />}
                onClick={handleSubmitComment}
                disabled={commentSubmitting || !commentText.trim()}
              >
                {commentSubmitting ? <CircularProgress size={24} /> : 'Đăng bình luận'}
              </Button>
            </Paper>
          )}

          {comments.length > 0 ? (
            comments.map((comment) => (
              <Paper key={comment.id} sx={{ p: 3, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Avatar sx={{ bgcolor: getRandomColor(), mr: 2 }}>
                    {getInitials(comment.user_name)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {comment.user_name}
                      </Typography>
                      {comment.is_staff_comment && (
                        <Chip 
                          label="Nhân viên" 
                          size="small" 
                          color="primary" 
                          sx={{ ml: 1 }}
                          icon={<VerifiedUser />}
                        />
                      )}
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                        {formatDateTime(comment.created_at)}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {comment.comment_text}
                    </Typography>
                    {isAuthenticated && (
                      <Button
                        size="small"
                        startIcon={<Reply />}
                        onClick={() => {
                          setReplyToComment(comment);
                          setReplyDialogOpen(true);
                        }}
                      >
                        Trả lời
                      </Button>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                      <Box sx={{ mt: 2, ml: 4, borderLeft: 2, borderColor: 'grey.200', pl: 2 }}>
                        {comment.replies.map((reply) => (
                          <Box key={reply.id} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Avatar sx={{ bgcolor: getRandomColor(), mr: 1, width: 32, height: 32 }}>
                                {getInitials(reply.user_name)}
                              </Avatar>
                              <Typography variant="subtitle2" fontWeight="medium">
                                {reply.user_name}
                              </Typography>
                              {reply.is_staff_comment && (
                                <Chip 
                                  label="Nhân viên" 
                                  size="small" 
                                  color="primary" 
                                  sx={{ ml: 1 }}
                                />
                              )}
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                                {formatDateTime(reply.created_at)}
                              </Typography>
                            </Box>
                            <Typography variant="body2">
                              {reply.comment_text}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Paper>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              Chưa có bình luận. Hãy là người đầu tiên!
            </Typography>
          )}
        </TabPanel>
      </Box>

      <Dialog open={replyDialogOpen} onClose={() => setReplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Trả lời {replyToComment?.user_name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Nhập nội dung trả lời..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>Hủy</Button>
          <Button 
            onClick={handleSubmitReply} 
            variant="contained"
            disabled={!replyText.trim()}
          >
            Đăng trả lời
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default ProductDetailPage;
