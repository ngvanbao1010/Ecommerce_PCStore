import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Stack,
  Snackbar,
} from '@mui/material';
import { RestartAlt } from '@mui/icons-material';
import { productsAPI, pcConfigAPI, categoriesAPI } from '../services/api';
import { formatPrice } from '../utils/helpers';
import PCPartRow from '../components/pcbuilder/PCPartRow';
import PCPartSelectDialog from '../components/pcbuilder/PCPartSelectDialog';
import { useCart } from '../context/CartContext';

const ROWS = [
  { key: 'cpu', label: 'CPU - Bộ vi xử lý', categoryKeywords: ['cpu', 'processor'] },
  { key: 'mainboard', label: 'MAIN - Bo mạch chủ', categoryKeywords: ['mainboard', 'motherboard'] },
  { key: 'ram', label: 'RAM - Bộ nhớ trong', categoryKeywords: ['ram', 'memory'] },
  { key: 'gpu', label: 'VGA - Card màn hình', categoryKeywords: ['gpu', 'graphics', 'vga', 'video card'] },
  { key: 'psu', label: 'PSU - Nguồn máy tính', categoryKeywords: ['psu', 'power supply'] },
  { key: 'cooling', label: 'Tản nhiệt - CPU Cooler', categoryKeywords: ['cooling', 'cooler'] },
  { key: 'case', label: 'Case - Vỏ máy', categoryKeywords: ['case', 'chassis'] },
  { key: 'ssd1', label: 'Ổ cứng SSD 1', categoryKeywords: ['storage', 'ssd'] },
  { key: 'ssd2', label: 'Ổ cứng SSD 2', categoryKeywords: ['storage', 'ssd'] },
];

function normalizeName(s) {
  return String(s || '').trim().toLowerCase();
}

const PCBuilderPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsByGroup, setProductsByGroup] = useState({});
  const [selection, setSelection] = useState({});
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });
  const [compatInfo, setCompatInfo] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const builderRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const { addToCart } = useCart();

  // Fetch categories and map to groups by keyword
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await categoriesAPI.getAll();
        const cats = Array.isArray(res.data) ? res.data : (res.data?.results || []);

        const rowToCategoryIds = {};
        for (const row of ROWS) {
          const ids = cats
            .filter(c => row.categoryKeywords.some(k => normalizeName(c.name).includes(k)))
            .map(c => c.id);
          rowToCategoryIds[row.key] = ids;
        }

        const productsMap = {};
        for (const row of ROWS) {
          const ids = rowToCategoryIds[row.key];
          let collected = [];
          if (!ids || ids.length === 0) {
            productsMap[row.key] = [];
            continue;
          }
          for (const cid of ids) {
            try {
              const pres = await productsAPI.getAll({ category: cid, page_size: 100, ordering: 'name' });
              const items = pres.data?.results || [];
              collected = collected.concat(items);
            } catch (e) { }
          }
          const byId = new Map();
          for (const p of collected) byId.set(p.id, p);
          productsMap[row.key] = Array.from(byId.values());
        }
        setProductsByGroup(productsMap);
      } catch (err) {
        console.error(err);
        setError('Failed to load PC Builder data');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const visibleRows = ROWS;

  const totalPrice = useMemo(() => {
    let total = 0;
    for (const r of visibleRows) {
      const item = selection[r.key];
      if (item?.product) total += (Number(item.product.price) || 0) * (item.qty || 1);
    }
    return total;
  }, [selection, visibleRows]);

  const openDialogFor = (key) => {
    setActiveKey(key);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setActiveKey(null);
  };

  const applySelection = (product) => {
    if (!activeKey) return;
    setSelection(prev => ({ ...prev, [activeKey]: { product, qty: prev[activeKey]?.qty || 1 } }));
    closeDialog();
  };

  const handleQtyChange = (key, qty) => {
    setSelection(prev => ({ ...prev, [key]: { product: prev[key]?.product || null, qty } }));
  };

  const handleDelete = (key) => {
    setSelection(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const resetAll = () => {
    setSelection({});
    setSnack({ open: false, message: '', severity: 'info' });
    setCompatInfo(null);
  };

  const handleAddAllToCart = async () => {
    try {
      const items = Object.values(selection).filter(x => x?.product);
      if (!items.length) {
        setSnack({ open: true, message: 'Chưa có linh kiện để thêm vào giỏ.', severity: 'info' });
        return;
      }
      let success = 0;
      for (const it of items) {
        try {
          const res = await addToCart(it.product.id, it.qty || 1);
          if (res?.success) success += 1;
        } catch (_e) { }
      }
      if (success > 0) setSnack({ open: true, message: `Đã thêm ${success}/${items.length} sản phẩm vào giỏ.`, severity: 'success' });
      else setSnack({ open: true, message: 'Không thể thêm vào giỏ hàng. Vui lòng đăng nhập hoặc thử lại.', severity: 'error' });
    } catch (_e) {
      setSnack({ open: true, message: 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.', severity: 'error' });
    }
  };

  const toDataURL = async (url) => {
    try {
      const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return url;
    }
  };

  const cloneWithInlinedImages = async (node) => {
    const clone = node.cloneNode(true);
    const origImgs = node.querySelectorAll('img');
    const cloneImgs = clone.querySelectorAll('img');
    const tasks = [];
    for (let i = 0; i < origImgs.length; i++) {
      const src = origImgs[i].getAttribute('src');
      if (!src) continue;
      tasks.push((async (idx, s) => {
        const data = await toDataURL(s);
        cloneImgs[idx].setAttribute('src', data);
      })(i, src));
    }
    await Promise.all(tasks);
    return clone;
  };

  const handleExportAsImage = async () => {
    try {
      setExporting(true);
      const html2canvas = (await import('html2canvas')).default;
      const node = builderRef.current;
      if (!node) return;
      const cloned = await cloneWithInlinedImages(node);
      const holder = document.createElement('div');
      holder.style.position = 'fixed';
      holder.style.left = '-9999px';
      holder.style.top = '0';
      holder.style.background = '#ffffff';
      holder.appendChild(cloned);
      document.body.appendChild(holder);

      const canvas = await html2canvas(cloned, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false });
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `pc-config-${Date.now()}.png`;
      a.click();
      document.body.removeChild(holder);
      setSnack({ open: true, message: 'Đã tải ảnh cấu hình.', severity: 'success' });
    } catch (e) {
      setSnack({ open: true, message: 'Xuất hình ảnh thất bại.', severity: 'error' });
    } finally {
      setExporting(false);
    }
  };

  const handleViewPrintPDF = async () => {
    try {
      setExporting(true);
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const node = builderRef.current;
      if (!node) return;
      const cloned = await cloneWithInlinedImages(node);
      const holder = document.createElement('div');
      holder.style.position = 'fixed';
      holder.style.left = '-9999px';
      holder.style.top = '0';
      holder.style.background = '#ffffff';
      holder.appendChild(cloned);
      document.body.appendChild(holder);

      const canvas = await html2canvas(cloned, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false });
      document.body.removeChild(holder);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pageHeight) {
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        const pageHeightPx = Math.floor((canvas.width * pageHeight) / pageWidth);
        let position = 0;
        const totalPages = Math.ceil(canvas.height / pageHeightPx);
        while (position < canvas.height) {
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(pageHeightPx, canvas.height - position);
          const ctx = pageCanvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(
            canvas,
            0,
            position,
            canvas.width,
            pageCanvas.height,
            0,
            0,
            canvas.width,
            pageCanvas.height
          );
          const imgData = pageCanvas.toDataURL('image/png');
          const h = (pageCanvas.height * imgWidth) / pageCanvas.width; // mm
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, h);
          position += pageHeightPx;
          if (position < canvas.height) pdf.addPage();
        }
      }

      const blobUrl = pdf.output('bloburl');
      window.open(blobUrl, '_blank');
      setSnack({ open: true, message: 'Đã tạo PDF. Bạn có thể in từ trình duyệt.', severity: 'success' });
    } catch (e) {
      setSnack({ open: true, message: 'Xuất PDF thất bại.', severity: 'error' });
    } finally {
      setExporting(false);
    }
  };

  const normalize = (v) => String(v || '').trim().toLowerCase();
  const num = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  };
  const getSpecs = (p) => {
    if (!p || !p.specifications) return {};
    const raw = p.specifications;
    if (typeof raw === 'object' && !Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
      try {
        let parsed = JSON.parse(raw);
        if (typeof parsed === 'string') {
          try { parsed = JSON.parse(parsed); } catch { }
        }
        return (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) ? parsed : {};
      } catch {
        return {};
      }
    }
    return {};
  };

  const computeCompatibility = (sel) => {
    const reasons = [];
    const rowWarnings = {};
    const cpu = sel.cpu?.product; const mb = sel.mainboard?.product; const ram = sel.ram?.product;
    const gpu = sel.gpu?.product; const psu = sel.psu?.product; const cooling = sel.cooling?.product; const kase = sel.case?.product;
    const spec = (p) => getSpecs(p);

    const cpuSocketRaw = spec(cpu).socket;
    const mbSocketRaw = spec(mb).socket;
    const cpuSocket = normalize(cpuSocketRaw);
    const mbSocket = normalize(mbSocketRaw);
    if (cpu && mb && cpuSocket && mbSocket && cpuSocket !== mbSocket) {
      const msg = `Socket CPU (${cpuSocketRaw}) khác Mainboard (${mbSocketRaw})`;
      reasons.push(msg);
      rowWarnings.cpu = msg;
      rowWarnings.mainboard = msg;
    }

    const ramTypeRaw = spec(ram).type;
    const mbRamRaw = spec(mb).supported_ram;
    const ramType = normalize(ramTypeRaw);
    const mbRam = normalize(mbRamRaw);
    if (ram && mb && ramType && mbRam && ramType !== mbRam) {
      const msg = `RAM (${ramTypeRaw}) khác Mainboard hỗ trợ (${mbRamRaw})`;
      reasons.push(msg);
      rowWarnings.ram = msg;
      rowWarnings.mainboard = rowWarnings.mainboard || msg;
    }

    const cpuTdp = num(spec(cpu).tdp);
    const gpuTdp = num(spec(gpu).tdp);
    const psuWatt = num(spec(psu).wattage);
    const estLoad = (cpuTdp || 0) + (gpuTdp || 0);
    if (psu && estLoad > 0 && psuWatt && psuWatt < estLoad * 1.3) {
      const req = Math.round(estLoad * 1.3);
      const msg = `Công suất PSU ${psuWatt}W thấp hơn mức khuyến nghị ${req}W`;
      reasons.push(msg);
      rowWarnings.psu = msg;
    }

    const coolSockets = normalize(spec(cooling).socket_support || '')
      .split(/[\,\s]+/).filter(Boolean);
    if (cooling && cpuSocket && coolSockets.length && !coolSockets.includes(cpuSocket)) {
      const msg = `Tản nhiệt không hỗ trợ socket CPU (${cpuSocketRaw})`;
      reasons.push(msg);
      rowWarnings.cooling = msg;
    }
    const coolMaxTdp = num(spec(cooling).max_tdp);
    if (cooling && cpuTdp && coolMaxTdp && coolMaxTdp < cpuTdp) {
      const msg = `Tản nhiệt TDP tối đa (${coolMaxTdp}W) < CPU TDP (${cpuTdp}W)`;
      reasons.push(msg);
      rowWarnings.cooling = rowWarnings.cooling || msg;
      rowWarnings.cpu = rowWarnings.cpu || msg;
    }

    const mbForm = normalize(spec(mb).form_factor);
    const caseFormRaw = String(spec(kase).form_factor || '').toLowerCase();
    const caseForms = caseFormRaw.replace(/\//g, ',').replace(/;/g, ',').split(/[\,\s]+/).filter(Boolean);
    const caseForm = caseForms[0] || '';
    if (kase && mb && mbForm && caseForm && mbForm !== caseForm && !caseForms.includes(mbForm)) {
      const msg = `Case (${spec(kase).form_factor}) có thể không lắp được Mainboard (${spec(mb).form_factor})`;
      reasons.push(msg);
      rowWarnings.case = msg;
      rowWarnings.mainboard = rowWarnings.mainboard || msg;
    }

    const coolH = num(spec(cooling).height);
    const caseMaxCoolH = num(spec(kase).max_cooler_height);
    if (cooling && kase && coolH && caseMaxCoolH && coolH > caseMaxCoolH) {
      const msg = `Chiều cao tản ${coolH}mm vượt giới hạn case ${caseMaxCoolH}mm`;
      reasons.push(msg);
      rowWarnings.cooling = rowWarnings.cooling || msg;
      rowWarnings.case = rowWarnings.case || msg;
    }

    return { compatible: reasons.length === 0, reasons, rowWarnings };
  };

  useEffect(() => {
    setCompatInfo(computeCompatibility(selection));
  }, [selection]);

  const handleCheck = async () => {
    setSaving(true);
    try {
      const info = computeCompatibility(selection);
      setCompatInfo(info);
      setSnack({ open: true, message: 'Đã kiểm tra cấu hình.', severity: info.compatible ? 'success' : 'warning' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
  <Container maxWidth="lg" sx={{ py: 4 }} ref={builderRef}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Xây dựng cấu hình máy tính</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Chi phí dự tính: <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{formatPrice(totalPrice)}</Box></Typography>
            <Button variant="outlined" color="inherit" startIcon={<RestartAlt />} onClick={resetAll}>Làm mới</Button>
          </Stack>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{String(error)}</Alert>
      )}

      <Box>
        {visibleRows.map((row, idx) => (
          <PCPartRow
            key={row.key}
            index={idx + 1}
            label={row.label}
            product={selection[row.key]?.product || null}
            qty={selection[row.key]?.qty || 1}
            onQtyChange={(q) => handleQtyChange(row.key, q)}
            onEdit={() => openDialogFor(row.key)}
            onSelect={() => openDialogFor(row.key)}
            onDelete={() => handleDelete(row.key)}
            warning={compatInfo?.rowWarnings?.[row.key]}
          />
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      {compatInfo && (
        <Alert severity={compatInfo.compatible ? 'success' : 'warning'} sx={{ mb: 2 }}>
          {compatInfo.compatible ? 'Cấu hình tương thích.' : `Cấu hình chưa tương thích: ${(compatInfo.reasons || []).join('; ')}`}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Tổng: {formatPrice(totalPrice)}</Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={handleExportAsImage} disabled={exporting}>
            {exporting ? 'Đang xuất…' : 'Tải ảnh cấu hình'}
          </Button>
          <Button variant="contained" color="primary" onClick={handleAddAllToCart}>
            Thêm vào giỏ hàng
          </Button>
          <Button variant="contained" color="primary" onClick={handleCheck} disabled={saving}>
            Kiểm tra cấu hình
          </Button>
          <Button variant="contained" color="primary" onClick={handleViewPrintPDF} disabled={exporting}>
            {exporting ? 'Đang tạo PDF…' : 'Xem & in PDF'}
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnack({ ...snack, open: false })} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>

      <PCPartSelectDialog
        open={dialogOpen}
        onClose={closeDialog}
        title={ROWS.find(r => r.key === activeKey)?.label || 'Chọn linh kiện'}
        products={productsByGroup[activeKey] || []}
        onSelect={applySelection}
      />
    </Container>
  );
};

export default PCBuilderPage;
