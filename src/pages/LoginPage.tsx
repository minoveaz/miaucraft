import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  UserRound,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Search,
  Package,
  Truck,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useTranslation } from '../hooks/useTranslation';

export default function LoginPage() {
  const { isAuthenticated, login, loginAsDemo, register, resetPassword, lookupGuestOrder } = useAuth();
  const { t, isEn, formatPrice } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'track'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [newsletter, setNewsletter] = useState(true);

  // Track order states
  const [trackEmail, setTrackEmail] = useState('');
  const [trackOrderNumber, setTrackOrderNumber] = useState('');
  const [guestOrderResult, setGuestOrderResult] = useState<ReturnType<typeof lookupGuestOrder>>(null);
  const [trackError, setTrackError] = useState(false);

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Redirect target
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/cuenta';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !email.includes('@')) {
      setErrorMsg(isEn ? 'Please enter a valid email address.' : 'Introduce un correo electrónico válido.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      setErrorMsg(isEn ? 'Failed to sign in. Please try again.' : 'Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!firstName.trim() || !email.includes('@')) {
      setErrorMsg(isEn ? 'Please fill in all required fields.' : 'Por favor completa todos los campos requeridos.');
      return;
    }
    setLoading(true);
    try {
      await register({
        firstName,
        lastName,
        email,
        phone,
        password,
        newsletterSubscribed: newsletter,
      });
      navigate(from, { replace: true });
    } catch {
      setErrorMsg(isEn ? 'Failed to create account.' : 'Error al crear la cuenta.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setLoading(true);
    await resetPassword(email);
    setLoading(false);
    setResetSent(true);
  };

  const handleTrackSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTrackError(false);
    const order = lookupGuestOrder(trackEmail, trackOrderNumber);
    if (order) {
      setGuestOrderResult(order);
    } else {
      setGuestOrderResult(null);
      setTrackError(true);
    }
  };

  const handleDemoClick = () => {
    loginAsDemo();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[75vh] bg-[#fbf9f6] py-10 sm:py-16">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        {/* Cabecera */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-soft bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand-strong shadow-2xs">
            <UserRound className="h-3.5 w-3.5" />
            {isEn ? 'Customer Portal' : 'Portal de Clientes'}
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">
            {activeTab === 'login' && t.auth.loginTitle}
            {activeTab === 'register' && t.auth.registerTitle}
            {activeTab === 'forgot' && t.auth.forgotPasswordTitle}
            {activeTab === 'track' && t.auth.trackOrderHeading}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-brand-ink/70 leading-relaxed max-w-md mx-auto">
            {activeTab === 'login' && t.auth.loginSubtitle}
            {activeTab === 'register' && t.auth.registerSubtitle}
            {activeTab === 'forgot' && t.auth.forgotPasswordSubtitle}
            {activeTab === 'track' && t.auth.trackOrderDesc}
          </p>
        </div>

        {/* Acceso Rápido Demo (1 Clic) */}
        <div className="mt-6 rounded-2xl border border-brand/20 bg-brand-soft/40 p-4 shadow-2xs sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-strong">
                <Sparkles className="h-4 w-4" />
                <span>{t.auth.demoButton}</span>
              </div>
              <p className="mt-0.5 text-xs text-brand-ink/75">
                {isEn
                  ? 'Explore orders, engraved tags, and address book as Valentina Ríos in 1 click.'
                  : 'Explora pedidos, placas grabadas y libreta como Valentina Ríos en 1 clic.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleDemoClick}
              className="inline-flex min-h-9 items-center justify-center rounded-full bg-brand-strong px-4 text-xs font-bold text-white shadow-xs hover:bg-brand-ink transition-colors shrink-0"
            >
              {isEn ? 'Try Demo' : 'Probar Demo'}
            </button>
          </div>
        </div>

        {/* Card Principal con Formularios */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e6dcd3] bg-white shadow-xs">
          {/* Navegación de pestañas */}
          <div className="flex border-b border-[#e6dcd3] bg-brand-cream/40 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-3.5 text-center transition-colors border-b-2 ${
                activeTab === 'login'
                  ? 'border-brand text-brand-strong bg-white font-bold'
                  : 'border-transparent text-brand-ink/70 hover:text-brand'
              }`}
            >
              {t.auth.signInButton}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-3.5 text-center transition-colors border-b-2 ${
                activeTab === 'register'
                  ? 'border-brand text-brand-strong bg-white font-bold'
                  : 'border-transparent text-brand-ink/70 hover:text-brand'
              }`}
            >
              {t.auth.registerButton}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('track');
                setErrorMsg(null);
              }}
              className={`flex-1 py-3.5 text-center transition-colors border-b-2 ${
                activeTab === 'track'
                  ? 'border-brand text-brand-strong bg-white font-bold'
                  : 'border-transparent text-brand-ink/70 hover:text-brand'
              }`}
            >
              {isEn ? 'Track Order' : 'Rastrear'}
            </button>
          </div>

          <div className="p-5 sm:p-7">
            {errorMsg && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {errorMsg}
              </div>
            )}

            {/* TAB 1: Iniciar Sesión */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-xs font-semibold text-brand-ink">
                    {t.auth.emailLabel}
                  </label>
                  <div className="relative mt-1.5">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-ink/40" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="w-full rounded-xl border border-[#cfc4bb] bg-white py-2.5 pl-10 pr-3.5 text-xs text-brand-ink placeholder:text-brand-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-password" className="block text-xs font-semibold text-brand-ink">
                      {t.auth.passwordLabel}
                    </label>
                    <button
                      type="button"
                      onClick={() => setActiveTab('forgot')}
                      className="text-[11px] font-medium text-brand hover:text-brand-strong underline"
                    >
                      {t.auth.forgotPasswordLink}
                    </button>
                  </div>
                  <div className="relative mt-1.5">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-ink/40" />
                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-[#cfc4bb] bg-white py-2.5 pl-10 pr-3.5 text-xs text-brand-ink placeholder:text-brand-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-strong px-5 text-xs font-bold text-white shadow-xs hover:bg-brand-ink disabled:opacity-60 transition-colors"
                >
                  <span>{loading ? (isEn ? 'Signing in...' : 'Iniciando sesión...') : t.auth.signInButton}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* TAB 2: Registrarse */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="reg-first-name" className="block text-xs font-semibold text-brand-ink">
                      {t.auth.firstNameLabel} *
                    </label>
                    <input
                      id="reg-first-name"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Valentina"
                      className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink placeholder:text-brand-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-last-name" className="block text-xs font-semibold text-brand-ink">
                      {t.auth.lastNameLabel}
                    </label>
                    <input
                      id="reg-last-name"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ríos"
                      className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink placeholder:text-brand-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="reg-email" className="block text-xs font-semibold text-brand-ink">
                    {t.auth.emailLabel} *
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="valentina@ejemplo.com"
                    className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink placeholder:text-brand-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="reg-phone" className="block text-xs font-semibold text-brand-ink">
                    {t.auth.phoneLabel}
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink placeholder:text-brand-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="reg-password" className="block text-xs font-semibold text-brand-ink">
                    {t.auth.passwordLabel}
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink placeholder:text-brand-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 text-xs text-brand-ink/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newsletter}
                      onChange={(e) => setNewsletter(e.target.checked)}
                      className="mt-0.5 rounded border-[#cfc4bb] text-brand focus:ring-brand/20"
                    />
                    <span className="leading-relaxed">{t.auth.newsletterCheckbox}</span>
                  </label>
                </div>

                <p className="text-[11px] text-brand-ink/60 leading-relaxed pt-1">
                  {t.auth.termsNotice}
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-strong px-5 text-xs font-bold text-white shadow-xs hover:bg-brand-ink disabled:opacity-60 transition-colors"
                >
                  <span>{loading ? (isEn ? 'Creating account...' : 'Creando cuenta...') : t.auth.registerButton}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {/* TAB 3: Recuperar Contraseña */}
            {activeTab === 'forgot' && (
              <div className="space-y-4">
                {resetSent ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-2" />
                    <p className="text-xs font-semibold text-emerald-800">
                      {t.auth.resetSuccess}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setResetSent(false);
                        setActiveTab('login');
                      }}
                      className="mt-4 text-xs font-bold text-brand hover:underline"
                    >
                      {t.auth.backToLogin}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="reset-email" className="block text-xs font-semibold text-brand-ink">
                        {t.auth.emailLabel}
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu-correo@ejemplo.com"
                        className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink placeholder:text-brand-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-brand-strong px-5 text-xs font-bold text-white shadow-xs hover:bg-brand-ink disabled:opacity-60 transition-colors"
                    >
                      {loading ? (isEn ? 'Sending...' : 'Enviando...') : t.auth.sendResetLink}
                    </button>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-xs font-semibold text-brand-ink/70 hover:text-brand"
                      >
                        ← {t.auth.backToLogin}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 4: Rastrear Pedido Invitado */}
            {activeTab === 'track' && (
              <div className="space-y-4">
                <form onSubmit={handleTrackSubmit} className="space-y-3.5">
                  <div>
                    <label htmlFor="track-email" className="block text-xs font-semibold text-brand-ink">
                      {t.auth.emailLabel}
                    </label>
                    <input
                      id="track-email"
                      type="email"
                      required
                      value={trackEmail}
                      onChange={(e) => setTrackEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink placeholder:text-brand-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="track-number" className="block text-xs font-semibold text-brand-ink">
                      {t.account.orders.orderNumber}
                    </label>
                    <input
                      id="track-number"
                      type="text"
                      required
                      value={trackOrderNumber}
                      onChange={(e) => setTrackOrderNumber(e.target.value)}
                      placeholder={t.auth.orderNumberPlaceholder}
                      className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink placeholder:text-brand-ink/40 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all uppercase"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-strong px-5 text-xs font-bold text-white shadow-xs hover:bg-brand-ink transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    <span>{t.auth.trackOrderButton}</span>
                  </button>
                </form>

                {trackError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 text-center">
                    {isEn
                      ? 'No order found with those details. Try MC-2026-9842 with demo user.'
                      : 'No encontramos ningún pedido con esos datos. Prueba con MC-2026-9842.'}
                  </div>
                )}

                {guestOrderResult && (
                  <div className="rounded-xl border border-[#e6dcd3] bg-brand-cream/60 p-4 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-bold text-brand-ink">
                        {guestOrderResult.orderNumber}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        <Truck className="h-3 w-3" />
                        {guestOrderResult.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-brand-ink/80 space-y-1">
                      <p><strong>{t.account.orders.carrier}:</strong> {guestOrderResult.carrierName || 'Correos Express'}</p>
                      {guestOrderResult.trackingNumber && (
                        <p><strong>Tracking:</strong> {guestOrderResult.trackingNumber}</p>
                      )}
                      {guestOrderResult.estimatedDelivery && (
                        <p><strong>{isEn ? 'Estimated Delivery:' : 'Entrega estimada:'}</strong> {guestOrderResult.estimatedDelivery}</p>
                      )}
                      <p><strong>{t.cart.subtotal}:</strong> {formatPrice(guestOrderResult.total)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Garantías de Seguridad */}
        <div className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-brand-ink/60">
          <ShieldCheck className="h-4 w-4 text-brand-strong" />
          <span>{t.cart.pciSecurityBadge}</span>
        </div>
      </div>
    </div>
  );
}
