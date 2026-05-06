import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import {
  BackIcon,
  BellIcon,
  BookOpenIcon,
  BoxIcon,
  ChatIcon,
  CheckBadgeIcon,
  ChevronRightIcon,
  CreditCardIcon,
  DownloadBoxIcon,
  HeartIcon,
  LocationIcon,
  LogoutIcon,
  CameraIcon,
  SettingsIcon,
  StarIcon,
  TicketIcon,
  UserIcon,
  WalletIcon,
} from "@/components/Icons/Icons";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/contexts/AuthContext";
import AuthService from "@/services/authService";
import { hasAdminRole } from "@/utils/roles";
import UserService, { type UpdateUserProfileRequest, type UserAddress } from "@/services/userService";
import notify from "@/utils/notify";
import { PageLoading } from "@/components/ui/page-loading";
import "./MemberPage.scss";

const MEMBER = {
  name: "王小明",
  avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&auto=format&fit=crop&q=60",
};

const ORDER_STATUS_TABS = [
  { id: "PENDING", label: "待付款", icon: <CreditCardIcon /> },
  { id: "SHIPPED", label: "待出貨", icon: <BoxIcon /> },
  { id: "DELIVERED", label: "待收貨", icon: <DownloadBoxIcon />, active: true },
  { id: "COMPLETED", label: "已完成", icon: <CheckBadgeIcon /> },
] as const;

const TOOLS = [
  { id: "profile", label: "會員資料", icon: <UserIcon /> },
  { id: "wishlist", label: "我的收藏", icon: <HeartIcon /> },
  { id: "history", label: "歷史紀錄", icon: <BookOpenIcon />, active: true },
  { id: "coupon", label: "優惠券", icon: <TicketIcon /> },
  { id: "payment", label: "付款方式", icon: <WalletIcon /> },
  { id: "rating", label: "評價", icon: <StarIcon /> },
  { id: "review", label: "我的評論", icon: <ChatIcon /> },
  { id: "address", label: "收貨地址", icon: <LocationIcon /> },
];

const RECENT_ORDERS = [
  {
    id: "12345678",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=120&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=120&auto=format&fit=crop&q=60",
    ],
    total: 590,
    status: "待收貨",
    statusKey: "pending_receipt",
    actions: [
      { label: "評價", variant: "outline" },
      { label: "申請退貨", variant: "outline" },
      { label: "確認收貨", variant: "solid" },
    ],
  },
  {
    id: "12345678",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=120&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=120&auto=format&fit=crop&q=60",
    ],
    total: 590,
    status: "待付款",
    statusKey: "pending_payment",
    actions: [
      { label: "修改資料", variant: "outline" },
      { label: "取消訂單", variant: "solid" },
    ],
  },
  {
    id: "12345678",
    images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?w=120&auto=format&fit=crop&q=60"],
    total: 590,
    status: "已完成",
    statusKey: "completed",
    actions: [
      { label: "查看評價", variant: "outline" },
      { label: "再買一次", variant: "solid" },
    ],
  },
];

type ProfileFormState = {
  name: string;
  email: string;
  phone: string;
  birthday: string;
  gender: "male" | "female" | "other";
  address: string;
  idCardNumber: string;
  avatarUrl: string;
};

const toGenderLabel = (value?: boolean | null): ProfileFormState["gender"] => {
  if (value === true) return "male";
  if (value === false) return "female";
  return "other";
};

const toGenderBoolean = (value: ProfileFormState["gender"]): boolean | null => {
  if (value === "male") return true;
  if (value === "female") return false;
  return null;
};

const MemberPage = () => {
  const navigate = useNavigate();
  const [activeOrderTab, setActiveOrderTab] = useState("");
  const [activeTool, setActiveTool] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileRoles, setProfileRoles] = useState<string[]>([]);
  const { logout, user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [addressForm, setAddressForm] = useState({ recipientName: "", phone: "", address: "" });
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [profile, setProfile] = useState<ProfileFormState>({
    name: MEMBER.name,
    email: "",
    phone: "",
    birthday: "",
    gender: "other",
    address: "",
    idCardNumber: "",
    avatarUrl: MEMBER.avatar,
  });

  const handleGoBack = () => navigate(-1);
  const handleAllOrders = () => navigate(ROUTES.ORDERS);
  const handleOrderTabClick = (status: (typeof ORDER_STATUS_TABS)[number]["id"]) => {
    setActiveOrderTab(status);
    navigate(`${ROUTES.ORDERS}?status=${encodeURIComponent(status)}`);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const user = await UserService.getCurrentUserProfile();
        const rolesFromApi = user.roles ?? [];
        setProfileRoles(rolesFromApi);
        if (rolesFromApi.length > 0) {
          localStorage.setItem("userRoles", JSON.stringify(rolesFromApi));
        }
        setProfile({
          name: user.name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          birthday: user.birthday ?? "",
          gender: toGenderLabel(user.gender),
          address: user.address ?? "",
          idCardNumber: user.idCardNumber ?? "",
          avatarUrl: user.avatarUrl || MEMBER.avatar,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        notify.error("載入會員資料失敗");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await UserService.getAddresses();
        setAddresses(data);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };
    fetchAddresses();
  }, []);

  const profilePayload: UpdateUserProfileRequest = useMemo(
    () => ({
      name: profile.name,
      phone: profile.phone || undefined,
      address: profile.address || undefined,
      idCardNumber: profile.idCardNumber || undefined,
      birthday: profile.birthday || undefined,
      gender: toGenderBoolean(profile.gender),
    }),
    [profile]
  );

  const handleSaveProfile = async () => {
    try {
      const user = await UserService.updateCurrentUserProfile(profilePayload);
      setProfile((prev) => ({
        ...prev,
        name: user.name ?? prev.name,
        phone: user.phone ?? "",
        birthday: user.birthday ?? "",
        gender: toGenderLabel(user.gender),
        address: user.address ?? "",
        idCardNumber: user.idCardNumber ?? "",
        avatarUrl: user.avatarUrl || prev.avatarUrl,
      }));
      setIsEditingProfile(false);
      notify.success("會員資料更新成功");
    } catch (error) {
      console.error("Failed to update profile:", error);
      notify.error("會員資料更新失敗");
    }
  };

  const handleAvatarPick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const user = await UserService.uploadAvatar(file);
      setProfile((prev) => ({ ...prev, avatarUrl: user.avatarUrl || prev.avatarUrl }));
      notify.success("頭像更新成功");
    } catch (error) {
      console.error("Upload avatar failed:", error);
      notify.error("頭像上傳失敗");
    } finally {
      event.target.value = "";
    }
  };

  const handleSendResetLink = async () => {
    try {
      await AuthService.requestPasswordReset(profile.email);
      notify.success("已寄出重設密碼信件，請至信箱確認。");
    } catch (error) {
      console.error("Send reset link failed:", error);
      notify.error("寄送重設密碼信件失敗");
    }
  };

  const resetAddressForm = () => {
    setAddressForm({ recipientName: "", phone: "", address: "" });
    setEditingAddressId(null);
  };

  const handleAddressSubmit = async () => {
    if (!addressForm.recipientName || !addressForm.phone || !addressForm.address) {
      notify.info("請完整填寫收件資料");
      return;
    }
    try {
      setIsSubmittingAddress(true);
      if (editingAddressId) {
        await UserService.updateAddress(editingAddressId, addressForm);
        notify.success("地址更新成功");
      } else {
        await UserService.createAddress({ ...addressForm, isDefault: addresses.length === 0 });
        notify.success("地址新增成功");
      }
      const latest = await UserService.getAddresses();
      setAddresses(latest);
      resetAddressForm();
    } catch (error) {
      console.error("Save address failed:", error);
      notify.error("地址儲存失敗");
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  const handleEditAddress = (item: UserAddress) => {
    setEditingAddressId(item.id);
    setAddressForm({ recipientName: item.recipientName, phone: item.phone, address: item.address });
    setActiveTool("address");
  };

  const handleDeleteAddress = async (id: number) => {
    const ok = await notify.confirm("確定刪除此收貨地址？", { variant: "destructive", title: "刪除地址" });
    if (!ok) return;
    try {
      await UserService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      notify.success("地址已刪除");
    } catch (error) {
      console.error("Delete address failed:", error);
      notify.error("地址刪除失敗");
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      await UserService.setDefaultAddress(id);
      const latest = await UserService.getAddresses();
      setAddresses(latest);
      notify.success("已設為預設地址");
    } catch (error) {
      console.error("Set default address failed:", error);
      notify.error("設定預設地址失敗");
    }
  };

  const renderProfilePanel = () => (
    <section className="member-page__orders-panel member-page__orders-panel--profile">
      <div className="member-page__profile-head">
        <h2 className="member-page__orders-panel-title">會員資料設定</h2>
        <button
          className={`member-page__order-action-btn ${isEditingProfile ? "member-page__order-action-btn--solid" : "member-page__order-action-btn--outline"}`}
          onClick={() => setIsEditingProfile((prev) => !prev)}
        >
          {isEditingProfile ? "取消編輯" : "編輯資料"}
        </button>
      </div>

      {loadingProfile ? (
        <PageLoading />
      ) : (
        <div className="member-page__profile-form">
          <label className="member-page__profile-field">
            <span>姓名</span>
            <input value={profile.name} disabled={!isEditingProfile} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} />
          </label>
          <label className="member-page__profile-field">
            <span>Email</span>
            <input value={profile.email} disabled />
          </label>
          <label className="member-page__profile-field">
            <span>手機</span>
            <input value={profile.phone} disabled={!isEditingProfile} onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))} />
          </label>
          <label className="member-page__profile-field">
            <span>生日</span>
            <input type="date" value={profile.birthday} disabled={!isEditingProfile} onChange={(e) => setProfile((prev) => ({ ...prev, birthday: e.target.value }))} />
          </label>
          <label className="member-page__profile-field">
            <span>身分證字號</span>
            <input value={profile.idCardNumber} disabled={!isEditingProfile} onChange={(e) => setProfile((prev) => ({ ...prev, idCardNumber: e.target.value.toUpperCase() }))} />
          </label>
          <label className="member-page__profile-field">
            <span>地址</span>
            <input value={profile.address} disabled={!isEditingProfile} onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))} />
          </label>
          <div className="member-page__profile-field member-page__profile-field--gender">
            <span>性別</span>
            <div>
              {(["male", "female", "other"] as const).map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="member-gender"
                    value={option}
                    checked={profile.gender === option}
                    disabled={!isEditingProfile}
                    onChange={() => setProfile((prev) => ({ ...prev, gender: option }))}
                  />
                  {option === "male" ? "男" : option === "female" ? "女" : "其他"}
                </label>
              ))}
            </div>
          </div>
          {isEditingProfile && (
            <div className="member-page__profile-actions">
              <button className="member-page__order-action-btn member-page__order-action-btn--solid" onClick={handleSaveProfile}>
                儲存變更
              </button>
            </div>
          )}
          <div className="member-page__profile-security">
            <h3>密碼設定</h3>
            <p>透過 Email 連結重設密碼（會寄送至 {profile.email || "您的註冊信箱"}）</p>
            <button className="member-page__order-action-btn member-page__order-action-btn--outline" onClick={handleSendResetLink}>
              發送重設密碼連結
            </button>
          </div>
          {hasAdminRole([...(user?.roles ?? []), ...AuthService.getUserRoles(), ...profileRoles]) && (
            <div className="member-page__profile-admin">
              <h3>後台</h3>
              <p>管理商品分類與 Header 大分類歸屬。</p>
              <Link className="member-page__order-action-btn member-page__order-action-btn--outline member-page__admin-link" to={ROUTES.ADMIN_CATEGORIES}>
                分類管理
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  );

  const renderAddressPanel = () => (
    <section className="member-page__orders-panel member-page__orders-panel--profile">
      <h2 className="member-page__orders-panel-title">收貨地址管理</h2>
      <div className="member-page__profile-form">
        <label className="member-page__profile-field">
          <span>收件人</span>
          <input value={addressForm.recipientName} onChange={(e) => setAddressForm((prev) => ({ ...prev, recipientName: e.target.value }))} />
        </label>
        <label className="member-page__profile-field">
          <span>手機</span>
          <input value={addressForm.phone} onChange={(e) => setAddressForm((prev) => ({ ...prev, phone: e.target.value }))} />
        </label>
        <label className="member-page__profile-field member-page__profile-field--full">
          <span>地址</span>
          <input value={addressForm.address} onChange={(e) => setAddressForm((prev) => ({ ...prev, address: e.target.value }))} />
        </label>
        <div className="member-page__profile-actions">
          {editingAddressId && (
            <button className="member-page__order-action-btn member-page__order-action-btn--outline" onClick={resetAddressForm}>
              取消
            </button>
          )}
          <button className="member-page__order-action-btn member-page__order-action-btn--solid" onClick={handleAddressSubmit} disabled={isSubmittingAddress}>
            {editingAddressId ? "更新地址" : "新增地址"}
          </button>
        </div>
      </div>
      <div className="member-page__address-list">
        {addresses.map((item) => (
          <div key={item.id} className={`member-page__address-card ${item.isDefault ? "member-page__address-card--default" : ""}`}>
            <div>
              <strong>{item.recipientName}</strong> | {item.phone}
              {item.isDefault && <span className="member-page__address-badge">預設</span>}
            </div>
            <p>{item.address}</p>
            <div className="member-page__order-actions">
              {!item.isDefault && (
                <button className="member-page__order-action-btn member-page__order-action-btn--outline" onClick={() => handleSetDefaultAddress(item.id)}>
                  設為預設
                </button>
              )}
              <button className="member-page__order-action-btn member-page__order-action-btn--outline" onClick={() => handleEditAddress(item)}>
                編輯
              </button>
              <button className="member-page__order-action-btn member-page__order-action-btn--solid" onClick={() => handleDeleteAddress(item.id)}>
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="member-page">
      <header className="member-page__mobile-header">
        <button className="member-page__mobile-header-btn" onClick={handleGoBack} aria-label="返回">
          <BackIcon />
        </button>
        <h1 className="member-page__mobile-header-title">會員</h1>
        <div className="member-page__mobile-header-icons">
          <button className="member-page__mobile-header-icon-btn" aria-label="通知">
            <BellIcon />
          </button>
          <button className="member-page__mobile-header-icon-btn" aria-label="設定">
            <SettingsIcon />
          </button>
          <button className="member-page__mobile-header-icon-btn" aria-label="登出" onClick={handleLogout}>
            <LogoutIcon />
          </button>
        </div>
      </header>

      <Header variant="member" />

      <main className="member-page__main">
        <div className="container">
          <section className="member-page__profile">
            <div className="member-page__avatar-wrapper">
              <img className="member-page__avatar" src={profile.avatarUrl || MEMBER.avatar} alt={profile.name || MEMBER.name} />
              <button className="member-page__avatar-upload-btn" aria-label="上傳頭像" onClick={handleAvatarPick}>
                <CameraIcon />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="member-page__avatar-upload-input" onChange={handleAvatarUpload} />
            </div>
            <span className="member-page__name">{profile.name || MEMBER.name}</span>
            <button className="member-page__help-btn" aria-label="登出" onClick={handleLogout}>
              <LogoutIcon />
            </button>
          </section>

          <div className="member-page__body">
            <aside className="member-page__sidebar">
              <div className="member-page__card">
                <div className="member-page__card-header">
                  <h2 className="member-page__card-title">我的訂單</h2>
                  <button className="member-page__card-link" onClick={handleAllOrders}>
                    全部訂單
                    <span className="member-page__card-link-icon">
                      <ChevronRightIcon />
                    </span>
                  </button>
                </div>

                <ul className="member-page__order-tabs">
                  {ORDER_STATUS_TABS.map((tab) => (
                    <li key={tab.id} className="member-page__order-tab-item">
                      <button
                        className={`member-page__order-tab-btn${activeOrderTab === tab.id ? " member-page__order-tab-btn--active" : ""}`}
                        onClick={() => handleOrderTabClick(tab.id)}
                        aria-pressed={activeOrderTab === tab.id}
                      >
                        <span className="member-page__order-tab-icon">{tab.icon}</span>
                        <span className="member-page__order-tab-label">{tab.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="member-page__card member-page__card--tools">
                <h2 className="member-page__card-title">常用工具</h2>

                <ul className="member-page__tools-grid">
                  {TOOLS.map((tool) => (
                    <li key={tool.id} className="member-page__tool-item">
                      <button
                        className={`member-page__tool-btn${activeTool === tool.id ? " member-page__tool-btn--active" : ""}`}
                        onClick={() => setActiveTool(tool.id)}
                        aria-pressed={activeTool === tool.id}
                      >
                        <span className="member-page__tool-icon">{tool.icon}</span>
                        <span className="member-page__tool-label">{tool.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>

                <ul className="member-page__tools-list">
                  {TOOLS.map((tool) => (
                    <li key={`list-${tool.id}`} className="member-page__tools-list-item">
                      <button
                        className={`member-page__tools-list-btn${activeTool === tool.id ? " member-page__tools-list-btn--active" : ""}`}
                        onClick={() => setActiveTool(tool.id)}
                        aria-pressed={activeTool === tool.id}
                      >
                        <span className="member-page__tools-list-icon">{tool.icon}</span>
                        <span className="member-page__tools-list-label">{tool.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {activeTool === "profile" ? (
              renderProfilePanel()
            ) : activeTool === "address" ? (
              renderAddressPanel()
            ) : (
            <section className="member-page__orders-panel">
              <h2 className="member-page__orders-panel-title">最近訂單</h2>

              <div className="member-page__orders-table">
                <div className="member-page__orders-thead">
                  <span className="member-page__orders-th">訂單編號</span>
                  <span className="member-page__orders-th">商品</span>
                  <span className="member-page__orders-th">總價</span>
                  <span className="member-page__orders-th">狀態</span>
                </div>

                {RECENT_ORDERS.map((order, idx) => (
                  <div key={`${order.id}-${order.statusKey}-${idx}`} className="member-page__order-row">
                    <div className="member-page__order-row-main">
                      <span className="member-page__order-id">{order.id}</span>
                      <div className="member-page__order-images">
                        {order.images.map((img, i) => (
                          <img key={`${order.id}-${img}-${i}`} className="member-page__order-img" src={img} alt={`訂單商品 ${i + 1}`} />
                        ))}
                      </div>
                      <span className="member-page__order-total">${order.total}</span>
                      <span className={`member-page__order-status member-page__order-status--${order.statusKey}`}>{order.status}</span>
                    </div>
                    <div className="member-page__order-actions">
                      {order.actions.map((action, ai) => (
                        <button
                          key={`${order.id}-${action.label}-${ai}`}
                          className={`member-page__order-action-btn member-page__order-action-btn--${action.variant}`}
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            )}
          </div>
        </div>
      </main>

      <div className="member-page__footer-wrapper">
        <Footer />
      </div>
    </div>
  );
};

export default MemberPage;
