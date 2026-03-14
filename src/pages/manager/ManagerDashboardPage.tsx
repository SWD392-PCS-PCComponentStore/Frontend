import { Package, Percent, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';

const STATS = [
  { label: 'Tổng sản phẩm', value: '156', icon: Package, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  { label: 'Đang khuyến mãi', value: '12', icon: Percent, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  { label: 'Sắp hết hàng', value: '8', icon: TrendingUp, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  { label: 'Doanh thu tháng', value: '1.2 tỷ', icon: DollarSign, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
];

const TOP_PRODUCTS = [
  { name: 'RTX 4090 Founders Edition', category: 'GPU', sold: 48, revenue: '2,207,520,000đ' },
  { name: 'Intel Core i9-14900K', category: 'CPU', sold: 35, revenue: '524,650,000đ' },
  { name: 'Samsung 990 Pro 2TB', category: 'Storage', sold: 62, revenue: '340,380,000đ' },
  { name: 'ASUS ROG Maximus Z790', category: 'Motherboard', sold: 15, revenue: '254,850,000đ' },
  { name: 'Corsair Vengeance 32GB DDR5', category: 'RAM', sold: 80, revenue: '263,200,000đ' },
];

const ACTIVE_PROMOTIONS = [
  { name: 'Flash Sale Cuối Tuần', discount: '15%', products: 8, endDate: '20/03/2026' },
  { name: 'Combo Gaming PC', discount: '10%', products: 5, endDate: '31/03/2026' },
  { name: 'Giảm giá RAM DDR5', discount: '20%', products: 3, endDate: '25/03/2026' },
];

export function ManagerDashboardPage() {
  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: 0 }}>Dashboard Quản lý</h1>
        <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>Tổng quan sản phẩm & khuyến mãi</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {STATS.map((stat) => (
          <div key={stat.label} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(245,158,11,0.12)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '12px',
                background: stat.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <stat.icon style={{ width: 22, height: 22, color: stat.color }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '13px', fontWeight: 500 }}>
                <TrendingUp style={{ width: 14, height: 14 }} />
                +8%
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 700, color: '#fff', margin: 0 }}>{stat.value}</p>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="!grid-cols-1 lg:!grid-cols-2">
        {/* Top Products */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(245,158,11,0.12)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(245,158,11,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>Sản phẩm bán chạy</h2>
            <button style={{
              background: 'none', border: 'none', color: '#f59e0b', fontSize: '13px',
              fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              Xem tất cả <ArrowUpRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(245,158,11,0.08)' }}>
                  {['Sản phẩm', 'Danh mục', 'Đã bán', 'Doanh thu'].map((h) => (
                    <th key={h} style={{
                      padding: '12px 24px', textAlign: 'left',
                      fontSize: '12px', fontWeight: 600, color: '#6b7280',
                      textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOP_PRODUCTS.map((p) => (
                  <tr key={p.name} style={{ borderBottom: '1px solid rgba(245,158,11,0.05)' }}>
                    <td style={{ padding: '14px 24px', fontSize: '14px', color: '#fff', fontWeight: 500 }}>{p.name}</td>
                    <td style={{ padding: '14px 24px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                        color: '#f59e0b', background: 'rgba(245,158,11,0.12)',
                      }}>{p.category}</span>
                    </td>
                    <td style={{ padding: '14px 24px', fontSize: '14px', color: '#d1d5db' }}>{p.sold}</td>
                    <td style={{ padding: '14px 24px', fontSize: '14px', color: '#10b981', fontWeight: 600 }}>{p.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Promotions */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(245,158,11,0.12)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(245,158,11,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#fff', margin: 0 }}>Khuyến mãi đang chạy</h2>
            <button style={{
              background: 'none', border: 'none', color: '#f59e0b', fontSize: '13px',
              fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              Xem tất cả <ArrowUpRight style={{ width: 14, height: 14 }} />
            </button>
          </div>
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ACTIVE_PROMOTIONS.map((promo) => (
              <div key={promo.name} style={{
                padding: '16px',
                borderRadius: '12px',
                background: 'rgba(245,158,11,0.05)',
                border: '1px solid rgba(245,158,11,0.1)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{promo.name}</span>
                  <span style={{
                    padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
                    color: '#10b981', background: 'rgba(16,185,129,0.15)',
                  }}>-{promo.discount}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#9ca3af' }}>
                  <span>{promo.products} sản phẩm</span>
                  <span>Hết hạn: {promo.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
