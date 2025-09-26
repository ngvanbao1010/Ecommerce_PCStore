import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableBody, TableCell, TableHead, TableRow,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Stack, Chip, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { productsAPI, categoriesAPI } from '../../services/api';
import { formatPrice } from '../../utils/helpers';
import { SPEC_SCHEMAS, normalizeCategoryName } from '../../utils/specSchemas';

const emptyForm = {
  name: '', description: '', price: '', stock_quantity: 0, category: '', brand: '', specifications: '{}', is_active: true, image: null,
};

const AdminProductsPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [specDraft, setSpecDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [ordering, setOrdering] = useState('-created_at');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        productsAPI.getAll({
          page_size: 100,
          ordering,
          search: search || undefined,
          category: categoryFilter || undefined,
          brand: brandFilter || undefined,
        }),
        categoriesAPI.getAll(),
      ]);
      let list = pRes.data?.results || [];
      if (stockFilter === 'in') list = list.filter(i => (i.stock_quantity ?? 0) > 0);
      if (stockFilter === 'out') list = list.filter(i => (i.stock_quantity ?? 0) <= 0);
      setRows(list);
      const cats = Array.isArray(cRes.data) ? cRes.data : (cRes.data?.results || []);
      setCategories(cats);
    } catch (e) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [ordering, categoryFilter, stockFilter, brandFilter, search]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const onNew = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setSpecDraft({});
    setOpen(true);
  };
  const safeParseSpec = (val) => {
    try {
      if (val == null) return {};
      if (typeof val === 'string') {
        let parsed = JSON.parse(val);
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed); } catch { }
        }
        return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
      }
      if (typeof val === 'object' && !Array.isArray(val)) return val;
      return {};
    } catch {
      return {};
    }
  };
  const looksLikeCharMap = (obj) => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
    const keys = Object.keys(obj);
    if (!keys.length) return false;
    return keys.every(k => /^\d+$/.test(k)) && keys.every(k => typeof obj[k] === 'string' && obj[k].length <= 2);
  };
  const getSchemaKeysForCategory = (categoryId) => {
    const catObj = categories.find(c => String(c.id) === String(categoryId));
    const key = normalizeCategoryName(catObj?.name || '');
    const schema = SPEC_SCHEMAS[key] || [];
    return new Set(schema.map(f => f.key));
  };
  const pick = (obj, allow) => {
    const out = {}; if (!obj) return out; for (const k of Object.keys(obj)) if (allow.has(k)) out[k] = obj[k]; return out;
  };
  const omit = (obj, deny) => {
    const out = {}; if (!obj) return out; for (const k of Object.keys(obj)) if (!deny.has(k)) out[k] = obj[k]; return out;
  };
  const onEdit = (row) => {
    setEditing(row);
    const parsedSpec = safeParseSpec(row.specifications);
    const specObj = looksLikeCharMap(parsedSpec) ? {} : parsedSpec;
    const allow = getSchemaKeysForCategory(row.category);
    const structuredSpec = pick(specObj, allow);
    const extrasSpec = omit(specObj, allow);
    setForm({
      name: row.name || '',
      description: row.description || '',
      price: row.price || '',
      stock_quantity: row.stock_quantity || 0,
      category: row.category || '',
      brand: row.brand || '',
      specifications: JSON.stringify(extrasSpec || {}, null, 2),
      is_active: !!row.is_active,
      image: null,
    });
    setSpecDraft({ ...(structuredSpec || {}) });
    setOpen(true);
  };
  const onDelete = async (row) => {
    if (!window.confirm(`Delete product "${row.name}"?`)) return;
    try {
      await productsAPI.delete(row.id);
      setSnackbar({ open: true, message: 'Deleted', severity: 'success' });
      load();
    } catch (e) {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  const submit = async () => {
    try {
      setSaving(true);
      let advanced = {};
      try {
        const txt = String(form.specifications || '').trim();
        advanced = txt ? JSON.parse(txt) : {};
      } catch (err) {
        setSaving(false);
        setSnackbar({ open: true, message: 'JSON thông số bổ sung không hợp lệ', severity: 'error' });
        return;
      }
      if (looksLikeCharMap(advanced)) advanced = {};
      const specs = { ...advanced, ...specDraft, ...localSpecRef.current };
      const hasFile = !!form.image;
      const payload = hasFile ? new FormData() : {};
      const put = (k, v) => {
        if (hasFile) payload.append(k, v);
        else payload[k] = v;
      };
      put('name', form.name);
      put('description', form.description);
      const priceNum = Number(form.price || 0);
      const stockNum = Number(form.stock_quantity || 0);
      put('price', priceNum);
      put('stock_quantity', stockNum);
      put('category', form.category);
      put('brand', form.brand);
      if (hasFile) {
        put('specifications', JSON.stringify(specs));
      } else {
        put('specifications', specs);
      }
      put('is_active', form.is_active);
      if (form.image) put('image', form.image);

      if (editing) {
        await productsAPI.update(editing.id, payload);
        setSnackbar({ open: true, message: 'Updated', severity: 'success' });
      } else {
        await productsAPI.create(payload);
        setSnackbar({ open: true, message: 'Created', severity: 'success' });
      }
      setOpen(false);
      load();
    } catch (e) {
      const msg = e?.response?.data ? JSON.stringify(e.response.data) : 'Save failed';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const currentSchema = useMemo(() => {
    const catObj = categories.find(c => String(c.id) === String(form.category));
    const key = normalizeCategoryName(catObj?.name || '');
    return SPEC_SCHEMAS[key] || [];
  }, [categories, form.category]);

  const localSpecRef = React.useRef({});

  const SpecFields = () => {
    if (!currentSchema.length) return null;
    const [localSpec, setLocalSpec] = useState({});
    useEffect(() => {
      const initial = { ...specDraft };
      setLocalSpec(initial);
      localSpecRef.current = initial;
    }, [open, form.category]);

    const handleChange = (k, v) => {
      setLocalSpec(prev => {
        const next = { ...prev, [k]: v };
        localSpecRef.current = next;
        return next;
      });
    };
    const handleBlur = (k) => {
      const v = localSpecRef.current[k];
      setSpecDraft(prev => ({ ...prev, [k]: v }));
    };
    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>Thông số kỹ thuật</Typography>
        <Stack spacing={2}>
          {currentSchema.map(field => {
            const isSelect = field.type === 'select';
            const isNumber = field.type === 'number';
            return (
              <TextField
                key={field.key}
                label={field.label}
                required={!!field.required}
                select={isSelect}
                inputMode={isNumber ? 'numeric' : undefined}
                autoComplete="off"
                name={`spec_${field.key}`}
                value={localSpec?.[field.key] ?? ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                onBlur={() => handleBlur(field.key)}
                helperText={field.helperText}
              >
                {isSelect && (field.options || []).map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
              </TextField>
            );
          })}
        </Stack>
      </Paper>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5" fontWeight={700}>Quản trị sản phẩm</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField size="small" placeholder="Tìm kiếm (tên/mô tả/hãng)" value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} />
          <TextField size="small" select label="Danh mục" value={categoryFilter} onChange={(e)=>setCategoryFilter(e.target.value)} sx={{ minWidth: 160 }}>
            <MenuItem value="">Tất cả</MenuItem>
            {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>
          <TextField size="small" label="Hãng" value={brandFilter} onChange={(e)=>setBrandFilter(e.target.value)} sx={{ minWidth: 140 }} />
          <TextField size="small" select label="Tồn kho" value={stockFilter} onChange={(e)=>setStockFilter(e.target.value)} sx={{ minWidth: 140 }}>
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="in">Còn hàng</MenuItem>
            <MenuItem value="out">Hết hàng</MenuItem>
          </TextField>
          <TextField size="small" select label="Sắp xếp" value={ordering} onChange={(e)=>setOrdering(e.target.value)} sx={{ minWidth: 170 }}>
            <MenuItem value="-created_at">Mới nhất</MenuItem>
            <MenuItem value="created_at">Cũ nhất</MenuItem>
            <MenuItem value="name">Tên A → Z</MenuItem>
            <MenuItem value="-name">Tên Z → A</MenuItem>
            <MenuItem value="price">Giá tăng dần</MenuItem>
            <MenuItem value="-price">Giá giảm dần</MenuItem>
          </TextField>
        </Box>
        <Button startIcon={<Add />} variant="contained" onClick={onNew}>Thêm sản phẩm</Button>
      </Box>
      <Paper sx={{ p: 2 }}>
  {loading ? (
    <Box textAlign="center" py={6}><CircularProgress /></Box>
  ) : error ? (
    <Box sx={{ color: 'error.main' }}>{error}</Box>
  ) : (
    <Table
      size="small"
      sx={{
        tableLayout: 'fixed',
        width: '100%',
        '& th, & td': { 
          px: 1.5, 
          py: 1.25,
          borderRight: '1px solid rgba(224, 224, 224, 1)',
          '&:last-child': {
            borderRight: 'none'
          }
        },
        '& th': {
          fontWeight: 600,
          backgroundColor: 'rgba(0, 0, 0, 0.02)'
        }
      }}
    >
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: '22%' }}>Tên</TableCell>
          <TableCell sx={{ width: '15%' }}>Danh mục</TableCell>
          <TableCell sx={{ width: '12%' }}>Hãng</TableCell>
          <TableCell sx={{ width: '14%' }}>Giá</TableCell>
          <TableCell sx={{ width: '12%' }}>Tồn kho</TableCell>
          <TableCell sx={{ width: '13%' }}>Trạng thái</TableCell>
          <TableCell sx={{ width: '12%' }} align="center">Thao tác</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(r => (
          <TableRow 
            key={r.id} 
            hover
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <TableCell sx={{ 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              fontWeight: 500
            }}>
              {r.name}
            </TableCell>
            <TableCell sx={{ 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}>
              {r.category_name}
            </TableCell>
            <TableCell sx={{ 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}>
              {r.brand}
            </TableCell>
            <TableCell sx={{ fontWeight: 500 }}>
              {formatPrice(r.price)}
            </TableCell>
            <TableCell sx={{ fontWeight: 500 }}>
              {r.stock_quantity}
            </TableCell>
            <TableCell>
              {r.is_active ? 
                <Chip 
                  size="small" 
                  color="success" 
                  label="Đang bán"
                  sx={{ fontSize: '0.75rem' }}
                /> : 
                <Chip 
                  size="small" 
                  label="Ẩn"
                  sx={{ fontSize: '0.75rem' }}
                />
              }
            </TableCell>
            <TableCell align="center">
              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                <IconButton 
                  size="small" 
                  onClick={() => onEdit(r)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText'
                    }
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error" 
                  onClick={() => onDelete(r)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'error.contrastText'
                    }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )}
</Paper>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="Tên" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} fullWidth />
            <TextField label="Mô tả" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} autoComplete="off" fullWidth multiline minRows={3} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Giá" value={form.price} inputMode="numeric" autoComplete="off" onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))} fullWidth />
              <TextField label="Tồn kho" value={form.stock_quantity} inputMode="numeric" autoComplete="off" onChange={(e) => setForm(f => ({ ...f, stock_quantity: e.target.value }))} fullWidth />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField select label="Danh mục" value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} autoComplete="off" fullWidth>
                {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </TextField>
              <TextField label="Hãng" value={form.brand} onChange={(e) => setForm(f => ({ ...f, brand: e.target.value }))} autoComplete="off" fullWidth />
            </Box>
            <SpecFields />
            <TextField label="Thông số bổ sung (tuỳ chọn, JSON)" placeholder='Ví dụ: { "led": "ARGB" }' value={form.specifications} onChange={(e) => setForm(f => ({ ...f, specifications: e.target.value }))} autoComplete="off" fullWidth multiline minRows={4} />
            <Button variant="outlined" component="label"> 
              {form.image ? 'Đổi ảnh' : 'Tải ảnh lên'}
              <input type="file" hidden onChange={(e) => setForm(f => ({ ...f, image: e.target.files?.[0] || null }))} />
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={submit} disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProductsPage;
