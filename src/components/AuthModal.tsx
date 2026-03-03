import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Eye, EyeOff, Mail, Lock, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export function AuthModal() {
  const { authModal, closeModal, openLogin, openRegister, login, register } = useAuth();
  const { isDark } = useTheme();

  if (!authModal) return null;

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
        onClick={closeModal}
      />
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl overflow-hidden"
        style={{
          position: 'relative',
          zIndex: 1,
          background: isDark
            ? 'linear-gradient(135deg, #0f0a2e 0%, #1a1145 50%, #0d1b3e 100%)'
            : '#ffffff',
          border: isDark ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid #e5e7eb',
          boxShadow: isDark
            ? '0 25px 60px rgba(0,0,0,0.7), 0 0 40px rgba(139,92,246,0.15)'
            : '0 25px 60px rgba(0,0,0,0.25)',
        }}
      >
        <button
          onClick={closeModal}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors z-10 ${
            isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-2 flex gap-1 mt-2 mx-4">
          <button
            onClick={openLogin}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all text-sm ${
              authModal === 'login'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                : isDark
                  ? 'text-gray-400 hover:text-white hover:bg-white/5'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={openRegister}
            className={`flex-1 py-2.5 rounded-lg font-semibold transition-all text-sm ${
              authModal === 'register'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30'
                : isDark
                  ? 'text-gray-400 hover:text-white hover:bg-white/5'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            Đăng ký
          </button>
        </div>

        <div className="p-6 pt-4">
          {authModal === 'login' ? (
            <LoginForm isDark={isDark} onLogin={login} onSwitch={openRegister} />
          ) : (
            <RegisterForm isDark={isDark} onRegister={register} onSwitch={openLogin} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

const iconStyle: React.CSSProperties = {
  position: 'absolute',
  left: '14px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '18px',
  height: '18px',
  pointerEvents: 'none',
};

const eyeStyle: React.CSSProperties = {
  position: 'absolute',
  right: '14px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '18px',
  height: '18px',
  cursor: 'pointer',
};

function LoginForm({
  isDark,
  onLogin,
  onSwitch,
}: {
  isDark: boolean;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSwitch: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    paddingLeft: '44px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '12px',
    border: isDark ? '1px solid rgba(139,92,246,0.25)' : '1px solid #e5e7eb',
    background: isDark ? 'rgba(255,255,255,0.06)' : '#f9fafb',
    color: isDark ? '#fff' : '#111827',
    fontSize: '15px',
    outline: 'none',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);
    const ok = await onLogin(email, password);
    setLoading(false);
    if (ok) toast.success('Đăng nhập thành công!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2
          className={`text-2xl font-bold mb-1 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Chào mừng trở lại
        </h2>
        <p className={isDark ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>
          Đăng nhập để tiếp tục mua sắm
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <Mail style={{ ...iconStyle, color: '#9ca3af' }} />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      <div style={{ position: 'relative' }}>
        <Lock style={{ ...iconStyle, color: '#9ca3af' }} />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ ...inputStyle, paddingRight: '44px' }}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{ ...eyeStyle, color: '#9ca3af', background: 'none', border: 'none', padding: 0 }}
        >
          {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
        </button>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-purple-500/30 accent-purple-500"
          />
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Ghi nhớ đăng nhập</span>
        </label>
        <button
          type="button"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          Quên mật khẩu?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-purple-500/30 disabled:opacity-50"
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </button>

      <div className={`relative flex items-center gap-4 py-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
        <div className="flex-1 h-px bg-current" />
        <span className="text-xs uppercase tracking-wider">hoặc</span>
        <div className="flex-1 h-px bg-current" />
      </div>

      <button
        type="button"
        className={`w-full py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3 ${
          isDark
            ? 'bg-white/5 border border-purple-500/20 hover:bg-white/10 text-white'
            : 'bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700'
        }`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Đăng nhập với Google
      </button>

      <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Chưa có tài khoản?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
        >
          Đăng ký ngay
        </button>
      </p>
    </form>
  );
}

function RegisterForm({
  isDark,
  onRegister,
  onSwitch,
}: {
  isDark: boolean;
  onRegister: (name: string, email: string, password: string) => Promise<boolean>;
  onSwitch: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    paddingLeft: '44px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderRadius: '12px',
    border: isDark ? '1px solid rgba(139,92,246,0.25)' : '1px solid #e5e7eb',
    background: isDark ? 'rgba(255,255,255,0.06)' : '#f9fafb',
    color: isDark ? '#fff' : '#111827',
    fontSize: '15px',
    outline: 'none',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    if (password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    const ok = await onRegister(name, email, password);
    setLoading(false);
    if (ok) toast.success('Đăng ký thành công!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2
          className={`text-2xl font-bold mb-1 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Tạo tài khoản
        </h2>
        <p className={isDark ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>
          Đăng ký để nhận ưu đãi đặc biệt
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <UserIcon style={{ ...iconStyle, color: '#9ca3af' }} />
        <input
          type="text"
          placeholder="Họ và tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      <div style={{ position: 'relative' }}>
        <Mail style={{ ...iconStyle, color: '#9ca3af' }} />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      <div style={{ position: 'relative' }}>
        <Lock style={{ ...iconStyle, color: '#9ca3af' }} />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ ...inputStyle, paddingRight: '44px' }}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{ ...eyeStyle, color: '#9ca3af', background: 'none', border: 'none', padding: 0 }}
        >
          {showPassword ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
        </button>
      </div>

      <div style={{ position: 'relative' }}>
        <Lock style={{ ...iconStyle, color: '#9ca3af' }} />
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 mt-0.5 rounded border-purple-500/30 accent-purple-500"
          required
        />
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Tôi đồng ý với{' '}
          <button type="button" className="text-purple-400 hover:underline">Điều khoản dịch vụ</button>
          {' '}và{' '}
          <button type="button" className="text-purple-400 hover:underline">Chính sách bảo mật</button>
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-purple-500/30 disabled:opacity-50"
      >
        {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
      </button>

      <p className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        Đã có tài khoản?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
        >
          Đăng nhập
        </button>
      </p>
    </form>
  );
}
