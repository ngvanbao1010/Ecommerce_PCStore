import React, { useEffect, useState } from 'react';
import {
  Box, Paper, Typography, ToggleButton, ToggleButtonGroup,
  CircularProgress, Button
} from '@mui/material';
import { statisticsAPI } from '../../services/api';
import { formatDate, formatPrice } from '../../utils/helpers';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

const KpiCard = ({ label, value, color = 'primary.main' }) => (
  <Paper elevation={1} sx={{ p: 2 }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="h5" sx={{ mt: 0.5, color }}>{value}</Typography>
  </Paper>
);

const AdminStatsPage = () => {
  const [period, setPeriod] = useState('daily');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async (p = period) => {
    try {
      setLoading(true);
      setError('');
      const res = await statisticsAPI.getSales(p);
      setData(res.data);
    } catch (e) {
      setError('Không lấy được dữ liệu thống kê (cần quyền staff/admin)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(period); }, [period]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5" fontWeight={700}>Thống kê bán hàng</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <ToggleButtonGroup
            size="small"
            color="primary"
            exclusive
            value={period}
            onChange={(_e, v) => v && setPeriod(v)}
          >
            <ToggleButton value="daily">Hôm nay</ToggleButton>
            <ToggleButton value="monthly">Tháng này</ToggleButton>
            <ToggleButton value="yearly">Năm nay</ToggleButton>
          </ToggleButtonGroup>
          <Button onClick={() => load()} disabled={loading}>Làm mới</Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Box textAlign="center" py={6}><CircularProgress /></Box>
        ) : error ? (
          <Box sx={{ color: 'error.main' }}>{error}</Box>
        ) : (
          <Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2,
              }}
            >
              <KpiCard label="Tổng doanh thu" value={formatPrice(Number(data?.total_revenue || 0))} color="success.main" />
              <KpiCard label="Số đơn hoàn tất" value={data?.total_orders ?? 0} color="primary.main" />
              <KpiCard label="Kỳ thống kê bắt đầu" value={data?.start_date ? formatDate(data.start_date) : '-'} color="text.primary" />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Doanh thu theo thời gian</Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  {period === 'yearly' ? (
                    <BarChart data={data?.series || []} margin={{ left: 8, right: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals tickFormatter={(v)=>`${(v/1_000_000).toFixed(1)}tr`} domain={[0, 'dataMax']} />
                      <Tooltip formatter={(val)=>formatPrice(Number(val||0))} />
                      <Bar dataKey="revenue" fill="#1976d2" name="Doanh thu" />
                    </BarChart>
                  ) : (
                    <LineChart data={data?.series || []} margin={{ left: 8, right: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals tickFormatter={(v)=>`${(v/1_000_000).toFixed(1)}tr`} domain={[0, 'dataMax']} />
                      <Tooltip formatter={(val)=>formatPrice(Number(val||0))} />
                      <Line type="monotone" dataKey="revenue" stroke="#2e7d32" strokeWidth={2} dot={false} name="Doanh thu" />
                      <Line type="monotone" dataKey="orders" stroke="#1976d2" strokeWidth={2} dot={false} name="Số đơn" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AdminStatsPage;
