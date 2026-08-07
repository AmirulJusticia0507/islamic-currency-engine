const BASE_URL = import.meta.env.VITE_API_URL || "/api";

let _token = localStorage.getItem("idce_token") || "";

export const setToken = (t) => {
  _token = t;
  if (t) localStorage.setItem("idce_token", t);
  else localStorage.removeItem("idce_token");
};
export const getToken = () => _token;

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (_token) headers.Authorization = `Bearer ${_token}`;
  const res = await fetch(`${BASE_URL}${path}`, { headers, ...options });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.reason || `HTTP ${res.status}`);
  return data;
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),
  listUsers: () => request("/auth/users"),
  assignRole: (userId, role) => request(`/auth/users/${userId}/roles`, { method: "POST", body: JSON.stringify({ role }) }),
  getReserves: () => request("/reserves"),
  getAudit: () => request("/reserves/audit"),
  createReserve: (body) => request("/reserves", { method: "POST", body: JSON.stringify(body) }),
  getTransactions: (params) => request(`/transactions${params ? "?" + new URLSearchParams(params) : ""}`),
  transfer: (body) => request("/transactions/transfer", { method: "POST", body: JSON.stringify(body) }),
  verifySignature: (hash, notarySignature) =>
    request(`/transactions/${hash}/verify`, { method: "POST", body: JSON.stringify({ notary_signature: notarySignature }) }),
  getLegalPartners: () => request("/legal/partners"),
  getLegalContracts: () => request("/legal/contracts"),
  createPartner: (body) => request("/legal/partners", { method: "POST", body: JSON.stringify(body) }),
  createContract: (body) => request("/legal/contracts", { method: "POST", body: JSON.stringify(body) }),
  verifyLegalContract: (id) => request(`/legal/contracts/${id}/verify`),
  legalPdfUrl: (id) => request(`/legal/contracts/${id}/pdf`),
  getWallets: (addr) => request(`/wallets/${addr}`),
  registerBiometric: (body) => request("/biometric/register", { method: "POST", body: JSON.stringify(body) }),
  verifyBiometric: (body) => request("/biometric/verify", { method: "POST", body: JSON.stringify(body) }),
  listDevices: (wallet) => request(`/biometric?wallet_address=${wallet || ""}`),
  getQrisImage: (wallet, amount) => request(`/qris/${wallet}/qr${amount ? `?amount=${amount}` : ""}`),
  getQrisPayload: (wallet, amount) => request(`/qris/${wallet}/payload${amount ? `?amount=${amount}` : ""}`),
  getGoldPrice: () => request("/oracle/gold"),
  getGoldHistory: (limit) => request(`/oracle/gold/history${limit ? `?limit=${limit}` : ""}`),
  getAuditLogs: (params) => request(`/audit${params ? "?" + new URLSearchParams(params) : ""}`),
  getNotifications: () => request("/notifications"),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: "POST" }),
  listEscrows: () => request("/escrows"),
  createEscrow: (body) => request("/escrows", { method: "POST", body: JSON.stringify(body) }),
  releaseEscrow: (id) => request(`/escrows/${id}/release`, { method: "POST" }),
  refundEscrow: (id) => request(`/escrows/${id}/refund`, { method: "POST" }),
  listDisputes: () => request("/escrows/disputes"),
  openDispute: (body) => request("/escrows/dispute", { method: "POST", body: JSON.stringify(body) }),
  resolveDispute: (id, body) => request(`/escrows/disputes/${id}/resolve`, { method: "POST", body: JSON.stringify(body) }),
};
