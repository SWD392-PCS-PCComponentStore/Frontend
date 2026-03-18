import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { getMyOrdersApi } from "@/api/orders";
import { Package, Calendar, MapPin, Truck, ChevronRight, ShoppingBag, Clock, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/Breadcrumb";
import type { OrderDetail } from "@/types";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  Pending: { label: "Chờ xử lý", color: "text-amber-500 bg-amber-500/10 border-amber-500/20", icon: Clock },
  Processing: { label: "Đang xử lý", color: "text-blue-500 bg-blue-500/10 border-blue-500/20", icon: Package },
  Shipped: { label: "Đang giao", color: "text-purple-500 bg-purple-500/10 border-purple-500/20", icon: Truck },
  Delivered: { label: "Đã giao", color: "text-green-500 bg-green-500/10 border-green-500/20", icon: CheckCircle },
  Canceled: { label: "Đã hủy", color: "text-red-500 bg-red-500/10 border-red-500/20", icon: XCircle },
};

export function MyOrdersPage() {
  const { isDark } = useTheme();
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrdersApi();
        setOrders(data || []);
      } catch (error) {
        toast.error("Không thể tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Theo dõi đơn hàng" }]} />

        <div className="max-w-5xl mx-auto mt-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Đơn hàng của tôi
              </h1>
              <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Theo dõi và quản lý lịch sử mua sắm của bạn
              </p>
            </div>
            <div className={`p-3 rounded-2xl ${isDark ? "bg-purple-500/10" : "bg-purple-100"}`}>
              <ShoppingBag className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>Đang tải đơn hàng...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className={`text-center py-20 rounded-3xl border-2 border-dashed ${isDark ? "border-gray-800 bg-gray-900/40" : "border-gray-200 bg-gray-50"}`}>
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h3>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>Hãy bắt đầu mua sắm ngay để trải nghiệm!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                const StatusIcon = status.icon;

                return (
                  <div
                    key={order.order_id}
                    className={`rounded-3xl border transition-all hover:scale-[1.01] overflow-hidden ${
                      isDark 
                        ? "bg-gray-900/40 border-gray-800 hover:border-purple-500/50" 
                        : "bg-white border-gray-200 hover:border-purple-300 hover:shadow-xl shadow-sm"
                    }`}
                  >
                    {/* Header đơn hàng */}
                    <div className={`px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b ${isDark ? "bg-white/5 border-gray-800" : "bg-gray-50 border-gray-100"}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-purple-500/20" : "bg-purple-100"}`}>
                          <Package className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mã đơn hàng</p>
                          <p className="font-mono font-bold">#{order.order_id}</p>
                        </div>
                      </div>

                      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-semibold ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </div>
                    </div>

                    {/* Nội dung đơn hàng */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Chi tiết đặt hàng */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-tight text-gray-400">Chi tiết đặt hàng</h4>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            <span className="text-sm">{formatDate(order.order_date)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-blue-400 text-sm" />
                            <span className="text-sm line-clamp-2">{order.shipping_address || "Chưa có địa chỉ"}</span>
                          </div>
                        </div>

                        {/* Thanh toán */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-tight text-gray-400">Thanh toán</h4>
                          <div>
                            <p className="text-sm">Phương thức: <span className="font-semibold">{order.payment_method || order.payment_type}</span></p>
                            <p className="text-sm mt-1">Tổng tiền: <span className="text-lg font-bold text-purple-500">{formatPrice(order.total_amount)}</span></p>
                          </div>
                        </div>

                        {/* Sản phẩm đã mua (hiện tóm tắt) */}
                        <div className="space-y-4 flex flex-col justify-end items-start md:items-end">
                          <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                            isDark ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-600 text-white hover:bg-purple-700"
                          }`}>
                            Xem chi tiết
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Danh sách sản phẩm (ẩn/hiện tùy chọn - ở đây hiện luôn tóm tắt) */}
                      {order.order_items && order.order_items.length > 0 && (
                        <div className={`mt-6 pt-6 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Sản phẩm trong đơn</p>
                           <div className="flex flex-wrap gap-2">
                             {order.order_items.map((item, idx) => (
                               <div key={idx} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDark ? "bg-white/5 border border-white/10" : "bg-gray-100 border border-gray-200"}`}>
                                 SP #{item.product_id} x {item.quantity}
                               </div>
                             ))}
                           </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
