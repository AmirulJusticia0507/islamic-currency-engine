import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Reserves } from "./pages/Reserves";
import { Legal } from "./pages/Legal";
import { Gold } from "./pages/Gold";
import { Admin } from "./pages/Admin";
import { Audit } from "./pages/Audit";
import { api, getToken, setToken } from "./api/client";

const PAGES = {
  dashboard: Dashboard,
  transactions: Transactions,
  reserves: Reserves,
  legal: Legal,
  gold: Gold,
  admin: Admin,
  audit: Audit,
};

export default function App() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    if (!getToken()) return setLoading(false);
    api.me().then((d) => setAuth(d.user)).catch(() => setToken("")).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">Memuat...</div>;

  if (!auth) {
    return (
      <Login
        onLogin={(user) => {
          setAuth(user);
          setActive("dashboard");
        }}
      />
    );
  }

  const perms = auth.permissions || [];
  const Page = PAGES[active] || Dashboard;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar
        active={active}
        onChange={setActive}
        permissions={perms}
        user={auth}
        onLogout={() => {
          setToken("");
          setAuth(null);
        }}
      />
      <main className="pb-16">
        <Page permissions={perms} />
      </main>
    </div>
  );
}