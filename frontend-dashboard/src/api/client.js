const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || data.reason || `HTTP ${res.status}`);
  return data;
}

export const api = {
  getReserves: () => request("/reserves"),
  getAudit: () => request("/reserves/audit"),
  createReserve: (body) => request("/reserves", { method: "POST", body: JSON.stringify(body) }),
  getTransactions: () => request("/transactions"),
  transfer: (body) => request("/transactions/transfer", { method: "POST", body: JSON.stringify(body) }),
  getLegalPartners: () => request("/legal/partners"),
  getLegalContracts: () => request("/legal/contracts"),
  createPartner: (body) => request("/legal/partners", { method: "POST", body: JSON.stringify(body) }),
  createContract: (body) => request("/legal/contracts", { method: "POST", body: JSON.stringify(body) }),
  getWallets: (addr) => request(`/wallets/${addr}`),
  registerBiometric: (body) => request("/biometric/register", { method: "POST", body: JSON.stringify(body) }),
  verifyBiometric: (body) => request("/biometric/verify", { method: "POST", body: JSON.stringify(body) }),
  listDevices: (wallet) => request(`/biometric?wallet_address=${wallet || ""}`),
  getQrisImage: (wallet, amount) => request(`/qris/${wallet}/qr${amount ? `?amount=${amount}` : ""}`),
  getQrisPayload: (wallet, amount) => request(`/qris/${wallet}/payload${amount ? `?amount=${amount}` : ""}`),
};
