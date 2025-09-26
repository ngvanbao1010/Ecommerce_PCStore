import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, Snackbar, Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { categoriesAPI } from '../../services/api';

const AdminCategoriesPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const load = async () => {
    try {
      setLoading(true);
      const res = await categoriesAPI.getAll();
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setRows(data);
    } catch (e) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onNew = () => { setEditing(null); setForm({ name: '', description: '' }); setOpen(true); };
  const onEdit = (row) => { setEditing(row); setForm({ name: row.name || '', description: row.description || '' }); setOpen(true); };
  const onDelete = async (row) => {
    if (!window.confirm(`Delete category "${row.name}"?`)) return;
    try {
      await categoriesAPI.delete(row.id);
      setSnackbar({ open: true, message: 'Deleted', severity: 'success' });
      load();
    } catch (e) {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  const submit = async () => {
    try {
      setSaving(true);
      if (editing) {
        await categoriesAPI.update(editing.id, form);
        setSnackbar({ open: true, message: 'Updated', severity: 'success' });
      } else {
        await categoriesAPI.create(form);
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>Danh mục sản phẩm</Typography>
        <Button startIcon={<Add />} variant="contained" onClick={onNew}>New Category</Button>
      </Box>
      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box textAlign="center" py={6}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Loại linh kiện</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell width={120} align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r.id} hover>
                  <TableCell>{r.name}</TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => onEdit(r)}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(r)}><Delete fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Edit Category' : 'New Category'}</DialogTitle>
        <DialogContent dividers>
          <TextField label="Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} fullWidth sx={{ mb: 2 }} />
          <TextField label="Description" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} fullWidth multiline minRows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submit} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminCategoriesPage;
