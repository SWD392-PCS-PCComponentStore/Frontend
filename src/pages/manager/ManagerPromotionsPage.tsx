import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, Calendar, Tag } from 'lucide-react';
import { toast } from 'sonner';

type Promotion = {
  id: number;
  name: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
};

const MOCK_PROMOTIONS: Promotion[] = [
  { id: 1, name: 'Flash Sale Cuối Tuần', code: 'FLASH15', discountType: 'percent', discountValue: 15, minOrder: 5000000, maxDiscount: 3000000, startDate: '2026-03-10', endDate: '2026-03-20', usageLimit: 100, usedCount: 42, active: true },
  { id: 2, name: 'Combo Gaming PC', code: 'GAMING10', discountType: 'percent', discountValue: 10, minOrder: 10000000, maxDiscount: 5000000, startDate: '2026-03-01', endDate: '2026-03-31', usageLimit: 50, usedCount: 18, active: true },
  { id: 3, name: 'Giảm giá RAM DDR5', code: 'RAM20', discountType: 'percent', discountValue: 20, minOrder: 2000000, maxDiscount: 1000000, startDate: '2026-03-05', endDate: '2026-03-25', usageLimit: 200, usedCount: 87, active: true },
  { id: 4, name: 'Giảm 500K cho GPU', code: 'GPU500K', discountType: 'fixed', discountValue: 500000, minOrder: 15000000, maxDiscount: 500000, startDate: '2026-02-01', endDate: '2026-03-01', usageLimit: 30, usedCount: 30, active: false },
  { id: 5, name: 'Mừng khai trương', code: 'OPEN2026', discountType: 'percent', discountValue: 25, minOrder: 3000000, maxDiscount: 2000000, startDate: '2026-04-01', endDate: '2026-04-15', usageLimit: 500, usedCount: 0, active: true },
];

const formatPrice = (p: number) => p.toLocaleString('vi-VN') + 'đ';
const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString('vi-VN');
};

type ModalMode = 'create' | 'edit' | null;

export function ManagerPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [modal, setModal] = useState<ModalMode>(null);
  const [editPromo, setEditPromo] = useState<Promotion | null>(null);
  const [form, setForm] = useState({
    name: '', code: '', discountType: 'percent' as 'percent' | 'fixed',
    discountValue: '', minOrder: '', maxDiscount: '',
    startDate: '', endDate: '', usageLimit: '',
  });

  const filtered = promotions.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? p.active : !p.active);
    return matchSearch && matchStatus;
  });

  const openCreate = () => {
    setForm({ name: '', code: '', discountType: 'percent', discountValue: '', minOrder: '', maxDiscount: '', startDate: '', endDate: '', usageLimit: '' });
    setEditPromo(null);
    setModal('create');
  };

  const openEdit = (p: Promotion) => {
    setForm({
      name: p.name, code: p.code, discountType: p.discountType,
      discountValue: String(p.discountValue), minOrder: String(p.minOrder),
      maxDiscount: String(p.maxDiscount), startDate: p.startDate,
      endDate: p.endDate, usageLimit: String(p.usageLimit),
    });
    setEditPromo(p);
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setEditPromo(null);
  };

  const handleSave = () => {
    if (!form.name || !form.code || !form.discountValue || !form.startDate || !form.endDate) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (modal === 'create') {
      const newPromo: Promotion = {
        id: Date.now(),
        name: form.name,
        code: form.code.toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrder: Number(form.minOrder) || 0,
        maxDiscount: Number(form.maxDiscount) || 0,
        startDate: form.startDate,
        endDate: form.endDate,
        usageLimit: Number(form.usageLimit) || 0,
        usedCount: 0,
        active: true,
      };
      setPromotions([newPromo, ...promotions]);
      toast.success('Thêm khuyến mãi thành công');
    } else if (modal === 'edit' && editPromo) {
      setPromotions(promotions.map((p) =>
        p.id === editPromo.id
          ? {
              ...p,
              name: form.name, code: form.code.toUpperCase(),
              discountType: form.discountType, discountValue: Number(form.discountValue),
              minOrder: Number(form.minOrder) || 0, maxDiscount: Number(form.maxDiscount) || 0,
              startDate: form.startDate, endDate: form.endDate,
              usageLimit: Number(form.usageLimit) || 0,
            }
          : p
      ));
      toast.success('Cập nhật khuyến mãi thành công');
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    setPromotions(promotions.filter((p) => p.id !== id));
    toast.success('Xóa khuyến mãi thành công');
  };

  const toggleActive = (id: number) => {
    setPromotions(promotions.map((p) =>
      p.id === id ? { ...p, active: !p.active } : p
    ));
    const promo = promotions.find((p) => p.id === id);
    toast.success(promo?.active ? 'Đã tắt khuyến mãi' : 'Đã bật khuyến mãi');
  };

  const getStatusInfo = (p: Promotion) => {
    const now = new Date();
    const start = new Date(p.startDate);
    const end = new Date(p.endDate);
    if (!p.active) return { label: 'Đã tắt', color: '#6b7280' };
    if (now < start) return { label: 'Sắp diễn ra', color: '#3b82f6' };
    if (now > end) return { label: 'Hết hạn', color: '#ef4444' };
    if (p.usedCount >= p.usageLimit && p.usageLimit > 0) return { label: 'Hết lượt', color: '#f59e0b' };
    return { label: 'Đang chạy', color: '#10b981' };
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(245,158,11,0.2)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: 0 }}>Quản lý khuyến mãi</h1>
          <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>
            {promotions.length} khuyến mãi · {promotions.filter(p => p.active).length} đang hoạt động
          </p>
        </div>
        <button onClick={openCreate} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '10px 20px', borderRadius: '12px', border: 'none',
          background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
          color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
        }}>
          <Plus style={{ width: 18, height: 18 }} /> Thêm khuyến mãi
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#9ca3af' }} />
          <input
            placeholder="Tìm theo tên hoặc mã..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '40px' }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
          style={{ ...inputStyle, width: 'auto', minWidth: '160px', cursor: 'pointer' }}
        >
          <option value="all" style={{ background: '#0f0a24', color: '#fff' }}>Tất cả trạng thái</option>
          <option value="active" style={{ background: '#0f0a24', color: '#fff' }}>Đang hoạt động</option>
          <option value="inactive" style={{ background: '#0f0a24', color: '#fff' }}>Đã tắt</option>
        </select>
      </div>

      {/* Promotions Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
        {filtered.map((p) => {
          const status = getStatusInfo(p);
          const usagePercent = p.usageLimit > 0 ? Math.round((p.usedCount / p.usageLimit) * 100) : 0;
          return (
            <div key={p.id} style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid rgba(245,158,11,${p.active ? '0.15' : '0.06'})`,
              borderRadius: '16px',
              padding: '24px',
              opacity: p.active ? 1 : 0.6,
              transition: 'opacity 0.2s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: '0 0 6px' }}>{p.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag style={{ width: 14, height: 14, color: '#f59e0b' }} />
                    <code style={{
                      fontSize: '14px', fontWeight: 700, color: '#f59e0b',
                      background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: '6px',
                    }}>{p.code}</code>
                  </div>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                  color: status.color, background: `${status.color}18`,
                }}>{status.label}</span>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px',
                padding: '12px 16px', borderRadius: '12px',
                background: 'rgba(245,158,11,0.08)',
              }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>
                  {p.discountType === 'percent' ? `-${p.discountValue}%` : `-${formatPrice(p.discountValue)}`}
                </span>
                {p.discountType === 'percent' && p.maxDiscount > 0 && (
                  <span style={{ fontSize: '13px', color: '#9ca3af' }}>tối đa {formatPrice(p.maxDiscount)}</span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#6b7280' }}>Đơn tối thiểu</span>
                  <p style={{ color: '#d1d5db', fontWeight: 500, margin: '2px 0 0' }}>{formatPrice(p.minOrder)}</p>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Lượt sử dụng</span>
                  <p style={{ color: '#d1d5db', fontWeight: 500, margin: '2px 0 0' }}>{p.usedCount}/{p.usageLimit}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar style={{ width: 13, height: 13, color: '#6b7280' }} />
                  <span style={{ color: '#6b7280' }}>{formatDate(p.startDate)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar style={{ width: 13, height: 13, color: '#6b7280' }} />
                  <span style={{ color: '#6b7280' }}>{formatDate(p.endDate)}</span>
                </div>
              </div>

              {/* Usage bar */}
              {p.usageLimit > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '3px',
                      width: `${Math.min(usagePercent, 100)}%`,
                      background: usagePercent >= 90 ? '#ef4444' : usagePercent >= 70 ? '#f59e0b' : '#10b981',
                      transition: 'width 0.3s',
                    }} />
                  </div>
                  <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', display: 'block' }}>{usagePercent}% đã sử dụng</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => toggleActive(p.id)} style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 500,
                  background: p.active ? 'rgba(107,114,128,0.15)' : 'rgba(16,185,129,0.15)',
                  color: p.active ? '#9ca3af' : '#10b981',
                }}>
                  {p.active ? 'Tắt' : 'Bật'}
                </button>
                <button onClick={() => openEdit(p)} style={{
                  padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: 'rgba(59,130,246,0.15)', color: '#60a5fa', display: 'flex',
                }}>
                  <Pencil style={{ width: 16, height: 16 }} />
                </button>
                <button onClick={() => handleDelete(p.id)} style={{
                  padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: 'rgba(239,68,68,0.15)', color: '#f87171', display: 'flex',
                }}>
                  <Trash2 style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
            Không tìm thấy khuyến mãi nào
          </div>
        )}
      </div>

      {/* Modal Create/Edit */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={closeModal} />
          <div style={{
            position: 'relative', zIndex: 1, width: '100%', maxWidth: '540px',
            background: 'linear-gradient(160deg, #1a1a0e, #0f0e17)',
            border: '1px solid rgba(245,158,11,0.2)', borderRadius: '20px', padding: '28px',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', margin: 0 }}>
                {modal === 'create' ? 'Thêm khuyến mãi' : 'Chỉnh sửa khuyến mãi'}
              </h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex' }}>
                <X style={{ width: 20, height: 20 }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Tên chương trình</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} placeholder="Ví dụ: Flash Sale Cuối Tuần" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Mã khuyến mãi</label>
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} style={inputStyle} placeholder="VD: FLASH15" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Loại giảm giá</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as 'percent' | 'fixed' })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="percent" style={{ background: '#0f0a24', color: '#fff' }}>Phần trăm (%)</option>
                    <option value="fixed" style={{ background: '#0f0a24', color: '#fff' }}>Số tiền cố định (VNĐ)</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>
                    {form.discountType === 'percent' ? 'Giảm (%)' : 'Giảm (VNĐ)'}
                  </label>
                  <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} style={inputStyle} placeholder="0" />
                </div>
                {form.discountType === 'percent' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Giảm tối đa (VNĐ)</label>
                    <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} style={inputStyle} placeholder="0" />
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Đơn tối thiểu (VNĐ)</label>
                  <input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: e.target.value })} style={inputStyle} placeholder="0" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Giới hạn lượt dùng</label>
                  <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} style={inputStyle} placeholder="0" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Ngày bắt đầu</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#9ca3af', marginBottom: '6px' }}>Ngày kết thúc</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button onClick={closeModal} style={{
                flex: 1, padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                border: '1px solid rgba(245,158,11,0.2)', background: 'transparent', color: '#9ca3af', cursor: 'pointer',
              }}>Hủy</button>
              <button onClick={handleSave} style={{
                flex: 1, padding: '12px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                border: 'none', background: 'linear-gradient(135deg, #f59e0b, #ea580c)', color: '#fff', cursor: 'pointer',
              }}>{modal === 'create' ? 'Thêm' : 'Lưu thay đổi'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
