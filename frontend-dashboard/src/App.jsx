import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Reserves } from "./pages/Reserves";
import { Legal } from "./pages/Legal";

const PAGES = {
  dashboard: Dashboard,
  transactions: Transactions,
  reserves: Reserves,
  legal: Legal,
};

export default function App() {
  const [active, setActive] = useState("dashboard");
  const Page = PAGES[active] || Dashboard;

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar active={active} onChange={setActive} />
      <main className="pb-16">
        <Page />
      </main>
    </div>
  );
}
