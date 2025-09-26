import React from 'react';
import { Box, Container, Stack, Typography, IconButton } from '@mui/material';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#f7f8fc',
        color: 'text.primary',
        py: 2.5,
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto',
      }}
    >
      <Container maxWidth="xl">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
          <Box>
            <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
              Copyright ©{year} Trường đại học Mở TP. Hồ Chí Minh<br />
              Địa chỉ: Khu dân cư Nhơn Đức, Nhà Bè, TP. Hồ Chí Minh<br />
              Số điện thoại: 0833201161<br />
              Email: vanbao524892@gmail.com
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton aria-label="Facebook" component="a" href="https://www.facebook.com/nguyen.van.bao.14019" target="_blank" rel="noopener" sx={{ p: 0 }}>
              <Box component="img" src="/facebookicon.png" alt="Facebook" sx={{ width: 36, height: 36, display: 'block', objectFit: 'contain' }} />
            </IconButton>
            <IconButton aria-label="YouTube" component="a" href="https://www.youtube.com/@TheSoulofWindLabel" target="_blank" rel="noopener" sx={{ p: 0 }}>
              <Box component="img" src="/youtubeicon.png" alt="YouTube" sx={{ width: 44, height: 44, display: 'block', objectFit: 'contain', transform: 'scale(1.18)' }} />
            </IconButton>
            <IconButton aria-label="TikTok" component="a" href="https://www.tiktok.com/@cs50" target="_blank" rel="noopener" sx={{ p: 0 }}>
              <Box component="img" src="/tiktokicon.png" alt="TikTok" sx={{ width: 36, height: 36, display: 'block', objectFit: 'contain' }} />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
