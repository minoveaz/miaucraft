import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  UserRound,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ShoppingBag,
  ShieldCheck,
  X,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useCart } from '../lib/cart';
import { useTranslation } from '../hooks/useTranslation';
import { products, productImage } from '../lib/products';
import type { CustomerOrder, UserAddress, OrderStatus } from '../types/customer';

const base = import.meta.env.BASE_URL;

export default function AccountPage() {
  const {
    user,
    isAuthenticated,
    orders,
    wishlist,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultShippingAddress,
    toggleWishlist,
  } = useAuth();
  const { addLine } = useCart();
  const { t, isEn, formatPrice } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab activo
  const tabParam = (searchParams.get('tab') as 'overview' | 'orders' | 'addresses' | 'wishlist' | 'profile') || 'overview';
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'wishlist' | 'profile'>(tabParam);

  // Modal de Pedido
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  // Modal de Dirección
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: '',
    recipientName: '',
    phone: '',
    street: '',
    apartment: '',
    postalCode: '',
    city: '',
    province: '',
    country: 'ES',
    isDefaultShipping: false,
    isDefaultBilling: false,
  });

  // Formulario de Perfil
  const [profileFirstName, setProfileFirstName] = useState('');
  const [profileLastName, setProfileLastName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileLang, setProfileLang] = useState<'es' | 'en'>('es');
  const [taxCompany, setTaxCompany] = useState('');
  const [taxId, setTaxId] = useState('');
  const [taxFiscalAddress, setTaxFiscalAddress] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Formulario de Contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Guard de autenticación
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/cuenta/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Sincronizar datos de perfil
  useEffect(() => {
    if (user) {
      setProfileFirstName(user.firstName || '');
      setProfileLastName(user.lastName || '');
      setProfilePhone(user.phone || '');
      setProfileLang(user.preferredLocale || 'es');
      if (user.billingDetails) {
        setTaxCompany(user.billingDetails.companyName || '');
        setTaxId(user.billingDetails.taxId || '');
        setTaxFiscalAddress(user.billingDetails.fiscalAddress || '');
      }
    }
  }, [user]);

  // Sincronizar tab con URL
  const handleTabChange = (newTab: 'overview' | 'orders' | 'addresses' | 'wishlist' | 'profile') => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  if (!user) return null;

  // Acciones de Direcciones
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      label: isEn ? 'Home' : 'Casa',
      recipientName: `${user.firstName} ${user.lastName}`.trim(),
      phone: user.phone || '',
      street: '',
      apartment: '',
      postalCode: '',
      city: '',
      province: '',
      country: 'ES',
      isDefaultShipping: user.addresses.length === 0,
      isDefaultBilling: user.addresses.length === 0,
    });
    setAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: UserAddress) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      label: addr.label,
      recipientName: addr.recipientName,
      phone: addr.phone,
      street: addr.street,
      apartment: addr.apartment || '',
      postalCode: addr.postalCode,
      city: addr.city,
      province: addr.province,
      country: addr.country,
      isDefaultShipping: Boolean(addr.isDefaultShipping),
      isDefaultBilling: Boolean(addr.isDefaultBilling),
    });
    setAddressModalOpen(true);
  };

  const handleSaveAddress = (e: FormEvent) => {
    e.preventDefault();
    if (!addressForm.recipientName || !addressForm.street || !addressForm.city || !addressForm.postalCode) {
      return;
    }
    if (editingAddressId) {
      updateAddress(editingAddressId, addressForm);
    } else {
      addAddress(addressForm);
    }
    setAddressModalOpen(false);
  };

  // Guardar perfil
  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    setProfileSuccess(false);
    await updateProfile({
      firstName: profileFirstName,
      lastName: profileLastName,
      phone: profilePhone,
      preferredLocale: profileLang,
      billingDetails: {
        companyName: taxCompany,
        taxId,
        fiscalAddress: taxFiscalAddress,
      },
    });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3500);
  };

  // Cambiar contraseña
  const handleUpdatePassword = (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);
    if (!currentPassword) {
      setPasswordError(isEn ? 'Please enter your current password.' : 'Introduce tu contraseña actual.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError(isEn ? 'New password must have at least 6 characters.' : 'La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(isEn ? 'Passwords do not match.' : 'Las contraseñas no coinciden.');
      return;
    }
    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3500);
  };

  // Reordenar items de un pedido
  const handleReorder = (order: CustomerOrder) => {
    order.items.forEach((item) => {
      addLine(
        {
          handle: item.productHandle,
          title: isEn ? item.productName.en : item.productName.es,
          unitPrice: item.unitPrice,
          image: item.image,
          options: item.engravedDetails,
        },
        item.quantity,
        true // abre el drawer automáticamente
      );
    });
  };

  // Badge de estado de pedido
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-800">
            <Clock className="h-3 w-3" />
            {t.account.orders.statusConfirmed}
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
            <Sparkles className="h-3 w-3" />
            {t.account.orders.statusPreparing}
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-800">
            <Truck className="h-3 w-3" />
            {t.account.orders.statusShipped}
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-3 w-3" />
            {t.account.orders.statusDelivered}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-bold text-stone-800">
            {status}
          </span>
        );
    }
  };

  const defaultShippingAddr = user.addresses.find((a) => a.isDefaultShipping) || user.addresses[0];
  const recentOrder = orders[0];

  return (
    <div className="min-h-[80vh] bg-[#fbf9f6] py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Cabecera del Portal */}
        <div className="rounded-2xl border border-[#e6dcd3] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-lg font-bold text-brand-strong ring-4 ring-brand-cream">
                {user.firstName.charAt(0)}
                {user.lastName ? user.lastName.charAt(0) : ''}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-xl sm:text-2xl font-bold text-brand-ink">
                    {t.account.welcomeBack}, {user.firstName}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-brand-soft bg-brand-cream/60 px-2.5 py-0.5 text-[11px] font-bold text-brand-strong">
                    <Sparkles className="h-3 w-3" />
                    {t.account.memberBadge}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-brand-ink/65">
                  {user.email}
                  {user.catProfile && (
                    <span className="ml-2 font-medium text-brand-strong">
                      · {isEn ? 'Cat:' : 'Gato:'} {user.catProfile.catName} ({user.catProfile.breed})
                    </span>
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-[#cfc4bb] bg-white px-4 text-xs font-semibold text-brand-ink/80 shadow-2xs hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors self-start sm:self-auto"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{t.account.profile.logoutButton}</span>
            </button>
          </div>

          {/* Navegación por Pestañas */}
          <nav aria-label="Account Tabs" className="mt-6 flex flex-wrap gap-2 border-t border-[#e6dcd3] pt-4 sm:gap-3">
            {[
              { id: 'overview', label: t.account.tabs.overview, icon: UserRound },
              { id: 'orders', label: t.account.tabs.orders, icon: Package, count: orders.length },
              { id: 'addresses', label: t.account.tabs.addresses, icon: MapPin, count: user.addresses.length },
              { id: 'wishlist', label: t.account.tabs.wishlist, icon: Heart, count: wishlist.length },
              { id: 'profile', label: t.account.tabs.profile, icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id as typeof activeTab)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-strong text-white shadow-xs'
                      : 'border border-[#e6dcd3] bg-white text-brand-ink/75 hover:bg-brand-cream hover:text-brand-ink'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-brand-soft text-brand-strong'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* CONTENIDO DE CADA PESTAÑA */}
        <div className="mt-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Métricas Rápidas */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => handleTabChange('orders')}
                  className="group flex items-center justify-between rounded-2xl border border-[#e6dcd3] bg-white p-5 text-left shadow-xs hover:border-brand/50 transition-all"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-ink/60">
                      {t.account.tabs.orders}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-brand-ink">
                      {orders.length}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand-strong group-hover:underline">
                      {t.account.overview.viewAllOrders} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong group-hover:bg-brand-strong group-hover:text-white transition-colors">
                    <Package className="h-6 w-6" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('addresses')}
                  className="group flex items-center justify-between rounded-2xl border border-[#e6dcd3] bg-white p-5 text-left shadow-xs hover:border-brand/50 transition-all"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-ink/60">
                      {t.account.tabs.addresses}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-brand-ink">
                      {user.addresses.length}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand-strong group-hover:underline">
                      {t.account.overview.manageAddresses} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong group-hover:bg-brand-strong group-hover:text-white transition-colors">
                    <MapPin className="h-6 w-6" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabChange('wishlist')}
                  className="group flex items-center justify-between rounded-2xl border border-[#e6dcd3] bg-white p-5 text-left shadow-xs hover:border-brand/50 transition-all"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-ink/60">
                      {t.account.tabs.wishlist}
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-brand-ink">
                      {wishlist.length}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand-strong group-hover:underline">
                      {t.account.overview.viewWishlist} <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong group-hover:bg-brand-strong group-hover:text-white transition-colors">
                    <Heart className="h-6 w-6" />
                  </div>
                </button>
              </div>

              {/* Pedido Activo Reciente */}
              <div className="overflow-hidden rounded-2xl border border-[#e6dcd3] bg-white shadow-xs">
                <div className="border-b border-[#e6dcd3] bg-brand-cream/40 px-5 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-sm font-bold text-brand-ink sm:text-base">
                      {t.account.overview.recentOrderTitle}
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleTabChange('orders')}
                      className="text-xs font-bold text-brand-strong hover:underline"
                    >
                      {t.account.overview.viewAllOrders}
                    </button>
                  </div>
                </div>

                {recentOrder ? (
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dcd3] pb-4">
                      <div>
                        <span className="font-display text-base font-bold text-brand-ink">
                          {recentOrder.orderNumber}
                        </span>
                        <p className="text-xs text-brand-ink/60">
                          {new Date(recentOrder.date).toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(recentOrder.status)}
                        <span className="font-display text-base font-bold text-brand-strong">
                          {formatPrice(recentOrder.total)}
                        </span>
                      </div>
                    </div>

                    {/* Barra de progreso de envío */}
                    <div className="rounded-xl border border-brand-soft bg-brand-cream/30 p-4">
                      <div className="flex items-center justify-between text-xs font-medium text-brand-ink mb-2">
                        <span className="flex items-center gap-1.5">
                          <Truck className="h-4 w-4 text-brand-strong" />
                          <strong>{recentOrder.carrierName}:</strong> {recentOrder.trackingNumber}
                        </span>
                        {recentOrder.estimatedDelivery && (
                          <span className="text-brand-ink/70">
                            {isEn ? 'Estimated:' : 'Entrega:'} <strong>{recentOrder.estimatedDelivery}</strong>
                          </span>
                        )}
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-[#e6dcd3]">
                        <div
                          className="h-full bg-brand-strong rounded-full transition-all"
                          style={{
                            width:
                              recentOrder.status === 'confirmed'
                                ? '25%'
                                : recentOrder.status === 'preparing'
                                ? '55%'
                                : recentOrder.status === 'shipped'
                                ? '85%'
                                : '100%',
                          }}
                        />
                      </div>
                    </div>

                    {/* Lista rápida de productos */}
                    <div className="space-y-3 pt-2">
                      {recentOrder.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#e6dcd3] bg-brand-cream">
                              <img
                                src={`${base}images/${item.image}`}
                                alt={isEn ? item.productName.en : item.productName.es}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-brand-ink">
                                {isEn ? item.productName.en : item.productName.es}
                              </p>
                              <p className="text-[11px] text-brand-ink/65">
                                {isEn ? item.variantName.en : item.variantName.es} · Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-brand-ink">{formatPrice(item.lineTotal)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-3 border-t border-[#e6dcd3]">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(recentOrder)}
                        className="inline-flex min-h-9 items-center justify-center rounded-full bg-brand-cream px-4 text-xs font-bold text-brand-ink hover:bg-brand-soft hover:text-brand-strong transition-colors"
                      >
                        {t.account.orders.viewDetails}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorder(recentOrder)}
                        className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-brand-strong px-4 text-xs font-bold text-white shadow-2xs hover:bg-brand-ink transition-colors"
                      >
                        <RotateCcw className="h-3 w-3" />
                        {t.account.orders.repeatOrder}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-brand-ink/60">
                    {t.account.overview.noActiveOrders}
                  </div>
                )}
              </div>

              {/* Tarjeta de Beneficio del Club Felino */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-brand-soft bg-gradient-to-r from-brand-soft/60 to-brand-cream p-6 shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-strong shadow-2xs">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-brand-ink sm:text-base">
                      {t.account.overview.memberBenefitTitle}
                    </h3>
                    <p className="mt-0.5 text-xs text-brand-ink/70 leading-relaxed max-w-xl">
                      {t.account.overview.memberBenefitDesc}
                    </p>
                  </div>
                </div>
                <Link
                  to="/coleccion/tag-cat"
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-brand-strong px-5 text-xs font-bold text-white shadow-xs hover:bg-brand-ink transition-colors shrink-0"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {isEn ? 'Customize New Tag' : 'Personalizar Nueva Placa'}
                </Link>
              </div>
            </div>
          )}

          {/* TAB 2: MIS PEDIDOS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-brand-ink">
                    {t.account.orders.title}
                  </h2>
                  <p className="mt-1 text-xs text-brand-ink/70">
                    {t.account.orders.subtitle}
                  </p>
                </div>
                <Link
                  to="/coleccion/tag-cat"
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-brand-strong px-5 text-xs font-bold text-white shadow-xs hover:bg-brand-ink transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t.account.orders.exploreShop}
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="rounded-2xl border border-[#e6dcd3] bg-white p-12 text-center shadow-xs">
                  <Package className="mx-auto h-12 w-12 text-brand-ink/40 mb-3" />
                  <h3 className="font-display text-base font-bold text-brand-ink">
                    {t.account.orders.emptyTitle}
                  </h3>
                  <p className="mt-1 text-xs text-brand-ink/65 max-w-sm mx-auto">
                    {t.account.orders.emptyDesc}
                  </p>
                  <Link
                    to="/coleccion/tag-cat"
                    className="mt-5 inline-flex min-h-10 items-center rounded-full bg-brand-strong px-6 text-xs font-bold text-white hover:bg-brand-ink"
                  >
                    {t.account.orders.exploreShop}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="overflow-hidden rounded-2xl border border-[#e6dcd3] bg-white shadow-xs"
                    >
                      {/* Cabecera de la tarjeta */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dcd3] bg-brand-cream/30 px-5 py-3.5 sm:px-6">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-display text-sm font-bold text-brand-ink">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs text-brand-ink/60">
                            {new Date(order.date).toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(order.status)}
                          <span className="font-display text-sm font-bold text-brand-strong">
                            {formatPrice(order.total)}
                          </span>
                        </div>
                      </div>

                      {/* Lista de Artículos */}
                      <div className="divide-y divide-[#e6dcd3] p-5 sm:p-6 space-y-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-4 pt-4 first:pt-0">
                            <div className="flex items-start gap-4">
                              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#e6dcd3] bg-brand-cream">
                                <img
                                  src={`${base}images/${item.image}`}
                                  alt={isEn ? item.productName.en : item.productName.es}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <Link
                                  to={`/producto/${item.productHandle}`}
                                  className="font-display text-xs font-bold text-brand-ink hover:text-brand-strong"
                                >
                                  {isEn ? item.productName.en : item.productName.es}
                                </Link>
                                <p className="mt-0.5 text-[11px] text-brand-ink/65">
                                  {isEn ? item.variantName.en : item.variantName.es} · {item.quantity} × {formatPrice(item.unitPrice)}
                                </p>

                                {/* Desglose de grabado personalizado */}
                                {item.engravedDetails && Object.keys(item.engravedDetails).length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1.5">
                                    {Object.entries(item.engravedDetails).map(([key, val]) => (
                                      <span
                                        key={key}
                                        className="inline-flex items-center rounded-md border border-[#e6dcd3] bg-brand-cream/80 px-2 py-0.5 text-[10px] text-brand-ink/80"
                                      >
                                        <strong className="mr-1 text-brand-ink">{key}:</strong> {val}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <span className="shrink-0 font-display text-xs font-bold text-brand-ink sm:text-right">
                              {formatPrice(item.lineTotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Acciones de la orden */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e6dcd3] bg-[#faf8f5] px-5 py-3 sm:px-6">
                        <div className="text-xs text-brand-ink/70">
                          {order.trackingNumber && (
                            <span className="inline-flex items-center gap-1.5">
                              <Truck className="h-3.5 w-3.5 text-brand-strong" />
                              <span>{order.carrierName}: <strong>{order.trackingNumber}</strong></span>
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex min-h-8 items-center justify-center rounded-full border border-[#cfc4bb] bg-white px-3.5 text-xs font-semibold text-brand-ink hover:bg-brand-soft hover:text-brand-strong transition-colors"
                          >
                            {t.account.orders.viewDetails}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorder(order)}
                            className="inline-flex min-h-8 items-center justify-center gap-1 rounded-full bg-brand-strong px-3.5 text-xs font-bold text-white shadow-2xs hover:bg-brand-ink transition-colors"
                          >
                            <RotateCcw className="h-3 w-3" />
                            {t.account.orders.repeatOrder}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DIRECCIONES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-brand-ink">
                    {t.account.addresses.title}
                  </h2>
                  <p className="mt-1 text-xs text-brand-ink/70">
                    {t.account.addresses.subtitle}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddAddress}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-brand-strong px-5 text-xs font-bold text-white shadow-xs hover:bg-brand-ink transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t.account.addresses.addNew}
                </button>
              </div>

              {user.addresses.length === 0 ? (
                <div className="rounded-2xl border border-[#e6dcd3] bg-white p-10 text-center shadow-xs">
                  <MapPin className="mx-auto h-10 w-10 text-brand-ink/40 mb-2" />
                  <p className="text-xs text-brand-ink/70">{t.account.addresses.noAddresses}</p>
                  <button
                    type="button"
                    onClick={handleOpenAddAddress}
                    className="mt-4 inline-flex min-h-9 items-center rounded-full bg-brand-strong px-5 text-xs font-bold text-white"
                  >
                    {t.account.addresses.addNew}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {user.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="flex flex-col justify-between rounded-2xl border border-[#e6dcd3] bg-white p-5 shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-display text-sm font-bold text-brand-ink">
                            {addr.label}
                          </span>
                          <div className="flex gap-1">
                            {addr.isDefaultShipping && (
                              <span className="rounded-md bg-brand-soft px-2 py-0.5 text-[10px] font-bold text-brand-strong">
                                {t.account.addresses.defaultShipping}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-brand-ink/80 space-y-1">
                          <p className="font-semibold text-brand-ink">{addr.recipientName}</p>
                          <p>{addr.street}</p>
                          {addr.apartment && <p>{addr.apartment}</p>}
                          <p>
                            {addr.postalCode} {addr.city}, {addr.province}
                          </p>
                          <p>{addr.country}</p>
                          <p className="text-[11px] text-brand-ink/60 pt-1">{addr.phone}</p>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-[#e6dcd3] pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditAddress(addr)}
                            className="inline-flex items-center gap-1 font-semibold text-brand hover:underline"
                          >
                            <Edit2 className="h-3 w-3" />
                            {t.account.addresses.edit}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteAddress(addr.id)}
                            className="inline-flex items-center gap-1 font-semibold text-red-600 hover:underline"
                          >
                            <Trash2 className="h-3 w-3" />
                            {t.account.addresses.delete}
                          </button>
                        </div>

                        {!addr.isDefaultShipping && (
                          <button
                            type="button"
                            onClick={() => setDefaultShippingAddress(addr.id)}
                            className="text-[11px] font-bold text-brand-strong hover:underline"
                          >
                            {t.account.addresses.makeDefaultShipping}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: FAVORITOS / WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-brand-ink">
                  {t.account.wishlist.title}
                </h2>
                <p className="mt-1 text-xs text-brand-ink/70">
                  {t.account.wishlist.subtitle}
                </p>
              </div>

              {wishlist.length === 0 ? (
                <div className="rounded-2xl border border-[#e6dcd3] bg-white p-12 text-center shadow-xs">
                  <Heart className="mx-auto h-12 w-12 text-brand-ink/40 mb-3" />
                  <h3 className="font-display text-base font-bold text-brand-ink">
                    {t.account.wishlist.emptyTitle}
                  </h3>
                  <p className="mt-1 text-xs text-brand-ink/65 max-w-sm mx-auto">
                    {t.account.wishlist.emptyDesc}
                  </p>
                  <Link
                    to="/coleccion/tag-cat"
                    className="mt-5 inline-flex min-h-10 items-center rounded-full bg-brand-strong px-6 text-xs font-bold text-white hover:bg-brand-ink"
                  >
                    {t.account.wishlist.exploreShop}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                  {wishlist.map((handle) => {
                    const prod = products.find((p) => p.handle === handle);
                    if (!prod) return null;
                    const imgSrc = `${base}images/${productImage(prod)}`;

                    return (
                      <div
                        key={handle}
                        className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e6dcd3] bg-white shadow-xs hover:border-brand/40 transition-all"
                      >
                        <div className="relative aspect-square overflow-hidden bg-brand-cream">
                          <img
                            src={imgSrc}
                            alt={prod.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={() => toggleWishlist(handle)}
                            title={t.account.wishlist.remove}
                            aria-label={`${t.account.wishlist.remove}: ${prod.title}`}
                            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-2xs hover:bg-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <Link
                              to={`/producto/${prod.handle}`}
                              className="font-display text-sm font-bold text-brand-ink hover:text-brand-strong"
                            >
                              {prod.title}
                            </Link>
                            <p className="mt-1 font-display text-sm font-bold text-brand-strong">
                              {formatPrice(prod.priceFrom)}
                            </p>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <Link
                              to={`/producto/${prod.handle}`}
                              className="flex-1 inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full bg-brand-strong px-3 text-xs font-bold text-white shadow-2xs hover:bg-brand-ink transition-colors"
                            >
                              <ShoppingBag className="h-3.5 w-3.5" />
                              <span>{isEn ? 'Customize' : 'Personalizar'}</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PERFIL Y SEGURIDAD */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-bold text-brand-ink">
                  {t.account.profile.title}
                </h2>
                <p className="mt-1 text-xs text-brand-ink/70">
                  {t.account.profile.subtitle}
                </p>
              </div>

              {profileSuccess && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{t.account.profile.savedSuccess}</span>
                </div>
              )}

              {/* Formulario de Datos Personales */}
              <div className="rounded-2xl border border-[#e6dcd3] bg-white p-6 shadow-xs sm:p-7">
                <h3 className="font-display text-base font-bold text-brand-ink border-b border-[#e6dcd3] pb-3 mb-5">
                  {t.account.profile.personalInfo}
                </h3>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="prof-first" className="block text-xs font-semibold text-brand-ink">
                        {t.account.profile.firstName}
                      </label>
                      <input
                        id="prof-first"
                        type="text"
                        value={profileFirstName}
                        onChange={(e) => setProfileFirstName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="prof-last" className="block text-xs font-semibold text-brand-ink">
                        {t.account.profile.lastName}
                      </label>
                      <input
                        id="prof-last"
                        type="text"
                        value={profileLastName}
                        onChange={(e) => setProfileLastName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="prof-email" className="block text-xs font-semibold text-brand-ink">
                        {t.account.profile.email}
                      </label>
                      <input
                        id="prof-email"
                        type="email"
                        disabled
                        value={user.email}
                        className="mt-1.5 w-full rounded-xl border border-[#e6dcd3] bg-brand-cream/40 p-2.5 text-xs text-brand-ink/60 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label htmlFor="prof-phone" className="block text-xs font-semibold text-brand-ink">
                        {t.account.profile.phone}
                      </label>
                      <input
                        id="prof-phone"
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Facturación Opcional */}
                  <div className="pt-4 border-t border-[#e6dcd3]">
                    <h4 className="font-display text-sm font-bold text-brand-ink mb-3">
                      {t.account.profile.taxTitle}
                    </h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="prof-tax-comp" className="block text-xs font-semibold text-brand-ink">
                          {t.account.profile.taxCompany}
                        </label>
                        <input
                          id="prof-tax-comp"
                          type="text"
                          value={taxCompany}
                          onChange={(e) => setTaxCompany(e.target.value)}
                          placeholder="Oliver Feline Studio S.L."
                          className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="prof-tax-id" className="block text-xs font-semibold text-brand-ink">
                          {t.account.profile.taxId}
                        </label>
                        <input
                          id="prof-tax-id"
                          type="text"
                          value={taxId}
                          onChange={(e) => setTaxId(e.target.value)}
                          placeholder="B-98765432"
                          className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand-strong px-6 text-xs font-bold text-white shadow-xs hover:bg-brand-ink transition-colors"
                    >
                      {t.account.profile.saveProfile}
                    </button>
                  </div>
                </form>
              </div>

              {/* Formulario de Cambio de Contraseña */}
              <div className="rounded-2xl border border-[#e6dcd3] bg-white p-6 shadow-xs sm:p-7">
                <h3 className="font-display text-base font-bold text-brand-ink border-b border-[#e6dcd3] pb-3 mb-5">
                  {t.account.profile.securityTitle}
                </h3>

                {passwordError && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{t.account.profile.passwordUpdated}</span>
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
                  <div>
                    <label htmlFor="pass-cur" className="block text-xs font-semibold text-brand-ink">
                      {t.account.profile.currentPassword}
                    </label>
                    <input
                      id="pass-cur"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="pass-new" className="block text-xs font-semibold text-brand-ink">
                      {t.account.profile.newPassword}
                    </label>
                    <input
                      id="pass-new"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="pass-conf" className="block text-xs font-semibold text-brand-ink">
                      {t.account.profile.confirmPassword}
                    </label>
                    <input
                      id="pass-conf"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-1.5 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand-strong px-6 text-xs font-bold text-white shadow-xs hover:bg-brand-ink transition-colors"
                  >
                    {t.account.profile.updatePassword}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: DETALLES DE PEDIDO */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#e6dcd3] bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-center justify-between border-b border-[#e6dcd3] pb-4">
              <div>
                <h3 className="font-display text-lg font-bold text-brand-ink">
                  {t.account.orders.modalTitle}: {selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-brand-ink/60">
                  {new Date(selectedOrder.date).toLocaleDateString(isEn ? 'en-US' : 'es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                aria-label="Cerrar modal"
                className="rounded-lg p-1.5 text-brand-ink/60 hover:bg-brand-cream hover:text-brand-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Estado y Envío */}
            <div className="mt-4 rounded-xl border border-brand-soft bg-brand-cream/30 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-brand-ink">{isEn ? 'Status:' : 'Estado:'}</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              {selectedOrder.trackingNumber && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-ink">{t.account.orders.carrier}:</span>
                  <a
                    href={selectedOrder.trackingUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-brand-strong hover:underline"
                  >
                    {selectedOrder.carrierName} ({selectedOrder.trackingNumber})
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {selectedOrder.estimatedDelivery && (
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-ink">{isEn ? 'Estimated Delivery:' : 'Entrega estimada:'}</span>
                  <span>{selectedOrder.estimatedDelivery}</span>
                </div>
              )}
            </div>

            {/* Dirección de Envío */}
            <div className="mt-4 border-t border-[#e6dcd3] pt-4 text-xs">
              <h4 className="font-display font-bold text-brand-ink mb-1.5">
                {t.account.orders.shippingDetails}
              </h4>
              <p className="text-brand-ink/80">{selectedOrder.shippingAddress.recipientName}</p>
              <p className="text-brand-ink/80">{selectedOrder.shippingAddress.street}</p>
              <p className="text-brand-ink/80">
                {selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}
              </p>
            </div>

            {/* Desglose de Artículos y Grabados */}
            <div className="mt-4 border-t border-[#e6dcd3] pt-4">
              <h4 className="font-display font-bold text-brand-ink text-xs mb-3">
                {isEn ? 'Products & Custom Engravings' : 'Productos y Grabados Personalizados'}
              </h4>
              <div className="divide-y divide-[#e6dcd3] space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-start gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-[#e6dcd3] bg-brand-cream">
                        <img
                          src={`${base}images/${item.image}`}
                          alt={isEn ? item.productName.en : item.productName.es}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-brand-ink">
                          {isEn ? item.productName.en : item.productName.es}
                        </p>
                        <p className="text-[11px] text-brand-ink/65">
                          {isEn ? item.variantName.en : item.variantName.es} · {item.quantity} × {formatPrice(item.unitPrice)}
                        </p>
                        {item.engravedDetails && (
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {Object.entries(item.engravedDetails).map(([k, v]) => (
                              <span
                                key={k}
                                className="inline-flex items-center rounded border border-[#e6dcd3] bg-brand-cream/80 px-1.5 py-0.5 text-[10px]"
                              >
                                <strong>{k}:</strong>&nbsp;{v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-brand-ink">{formatPrice(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totales */}
            <div className="mt-5 border-t border-[#e6dcd3] pt-4 space-y-1.5 text-xs text-brand-ink/80">
              <div className="flex justify-between">
                <span>{t.cart.subtotal}</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.cart.shipping}</span>
                <span>{selectedOrder.shipping === 0 ? t.cart.shippingFree : formatPrice(selectedOrder.shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-[#e6dcd3] pt-2 font-display text-sm font-bold text-brand-ink">
                <span>Total</span>
                <span className="text-brand-strong">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-[#e6dcd3] pt-4">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full border border-[#cfc4bb] bg-white px-5 py-2 text-xs font-bold text-brand-ink hover:bg-brand-cream"
              >
                {isEn ? 'Close' : 'Cerrar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleReorder(selectedOrder);
                  setSelectedOrder(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-strong px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-ink transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                {t.account.orders.repeatOrder}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AÑADIR / EDITAR DIRECCIÓN */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-[#e6dcd3] bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-center justify-between border-b border-[#e6dcd3] pb-3.5">
              <h3 className="font-display text-base font-bold text-brand-ink">
                {editingAddressId ? t.account.addresses.modalEditTitle : t.account.addresses.modalAddTitle}
              </h3>
              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="rounded-lg p-1 text-brand-ink/60 hover:text-brand-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-brand-ink">
                  {isEn ? 'Address Label' : 'Identificador de dirección'}
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  placeholder={t.account.addresses.labelPlaceholder}
                  className="mt-1 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-brand-ink">
                    {t.account.addresses.recipientName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.recipientName}
                    onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brand-ink">
                    {t.account.addresses.phone}
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-ink">
                  {t.account.addresses.street} *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  placeholder="Calle Gran Vía 28"
                  className="mt-1 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-ink">
                  {t.account.addresses.apartment}
                </label>
                <input
                  type="text"
                  value={addressForm.apartment}
                  onChange={(e) => setAddressForm({ ...addressForm, apartment: e.target.value })}
                  placeholder="Piso 4º B, Escalera Izquierda"
                  className="mt-1 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-brand-ink">
                    {t.account.addresses.postalCode} *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brand-ink">
                    {t.account.addresses.city} *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-brand-ink">
                    {t.account.addresses.country}
                  </label>
                  <select
                    value={addressForm.country}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-[#cfc4bb] bg-white p-2.5 text-xs text-brand-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  >
                    <option value="ES">España (ES)</option>
                    <option value="US">United States (US)</option>
                    <option value="MX">México (MX)</option>
                    <option value="CO">Colombia (CO)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-brand-ink/80">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefaultShipping}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefaultShipping: e.target.checked })}
                    className="rounded border-[#cfc4bb] text-brand focus:ring-brand/20"
                  />
                  <span>{t.account.addresses.defaultShipping}</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#e6dcd3]">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="rounded-full border border-[#cfc4bb] bg-white px-5 py-2 text-xs font-semibold text-brand-ink hover:bg-brand-cream"
                >
                  {t.account.addresses.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-brand-strong px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-ink transition-colors"
                >
                  {t.account.addresses.saveAddress}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
