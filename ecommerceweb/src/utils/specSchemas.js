export function normalizeCategoryName(name = '') {
  const key = String(name || '').trim().toLowerCase();
  if (/cpu|processor/.test(key)) return 'cpu';
  if (/main|mother|bo mạch|bo mach|mainboard|motherboard|mb/.test(key)) return 'mainboard';
  if (/ram|memory|bộ nhớ|bo nho/.test(key)) return 'ram';
  if (/gpu|vga|graphics|video card|card màn hình|card man hinh/.test(key)) return 'gpu';
  if (/psu|power supply|nguồn|nguon|power/.test(key)) return 'psu';
  if (/storage|ssd|hdd|hard drive|ổ cứng|o cung/.test(key)) return 'storage';
  if (/case|chassis|vỏ máy|vo may/.test(key)) return 'case';
  if (/cool|tản|tan|radiator/.test(key)) return 'cooling';
  return key;
}

export const SPEC_SCHEMAS = {
  cpu: [
    { key: 'socket', label: 'Socket', type: 'text', required: true },
    { key: 'cores', label: 'Cores', type: 'number', required: true },
    { key: 'threads', label: 'Threads', type: 'number' },
    { key: 'base_clock', label: 'Base Clock (GHz)', type: 'number' },
    { key: 'boost_clock', label: 'Boost Clock (GHz)', type: 'number' },
    { key: 'tdp', label: 'TDP (W)', type: 'number', helperText: 'Wattage, e.g., 65' },
    { key: 'cache', label: 'Cache (MB)', type: 'number' },
  ],
  mainboard: [
    { key: 'socket', label: 'CPU Socket', type: 'text', required: true },
    { key: 'chipset', label: 'Chipset', type: 'text' },
    { key: 'supported_ram', label: 'Supported RAM Type', type: 'select', options: ['DDR4', 'DDR5'] },
    { key: 'form_factor', label: 'Form Factor', type: 'select', options: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX'] },
    { key: 'memory_slots', label: 'Memory Slots', type: 'number' },
    { key: 'max_memory', label: 'Max Memory (GB)', type: 'number' },
  ],
  ram: [
    { key: 'type', label: 'Type', type: 'select', options: ['DDR4', 'DDR5'], required: true },
    { key: 'capacity', label: 'Capacity (GB)', type: 'number', required: true },
    { key: 'speed', label: 'Speed (MHz)', type: 'number' },
    { key: 'modules', label: 'Modules (e.g., 2x8GB)', type: 'text' },
  ],
  gpu: [
    { key: 'chipset', label: 'Chipset', type: 'text' },
    { key: 'vram', label: 'VRAM (GB)', type: 'number' },
    { key: 'tdp', label: 'TDP (W)', type: 'number' },
    { key: 'cuda_cores', label: 'CUDA Cores/Stream Processors', type: 'number' },
  ],
  psu: [
    { key: 'wattage', label: 'Wattage (W)', type: 'number', required: true },
    { key: 'certification', label: '80+ Certification', type: 'select', options: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Titanium'] },
    { key: 'modular', label: 'Modular', type: 'select', options: ['No', 'Semi', 'Full'] },
  ],
  storage: [
    { key: 'type', label: 'Type', type: 'select', options: ['SSD', 'HDD'], required: true },
    { key: 'capacity', label: 'Capacity (GB)', type: 'number', required: true },
    { key: 'interface', label: 'Interface', type: 'select', options: ['SATA', 'NVMe', 'PCIe'] },
    { key: 'form_factor', label: 'Form Factor', type: 'select', options: ['2.5"', '3.5"', 'M.2 2280'] },
  ],
  case: [
    { key: 'form_factor', label: 'Supported Form Factors', type: 'select', options: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX'] },
    { key: 'max_gpu_length', label: 'Max GPU Length (mm)', type: 'number' },
    { key: 'max_cooler_height', label: 'Max CPU Cooler Height (mm)', type: 'number' },
  ],
  cooling: [
    { key: 'type', label: 'Loại tản nhiệt', type: 'select', options: ['Air', 'AIO Liquid', 'Custom Loop'] },
    { key: 'socket_support', label: 'Socket hỗ trợ (ví dụ: LGA1700, AM5)', type: 'text', helperText: 'Có thể là danh sách, phân tách bằng dấu phẩy' },
    { key: 'radiator_size', label: 'Kích thước radiator (mm)', type: 'select', options: ['120', '140', '240', '280', '360', '420'] },
    { key: 'fan_size', label: 'Kích thước quạt (mm)', type: 'select', options: ['92', '120', '140'] },
    { key: 'fan_count', label: 'Số lượng quạt', type: 'number' },
    { key: 'max_tdp', label: 'Công suất tản tối đa (TDP, W)', type: 'number', helperText: 'Dùng để so với TDP CPU' },
    { key: 'height', label: 'Chiều cao (mm) - cho tản khí', type: 'number' },
  ],
};
