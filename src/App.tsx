import "./App.css";
import Layout from "./components/Layout";
import { WagmiProvider } from "wagmi";
import { config } from "./config/injectConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import { Toaster } from "react-hot-toast";
import BalanceContext from "./components/BalanceContext";

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BalanceContext>
          <Layout>
            <BrowserRouter>
              <Toaster position="top-right" reverseOrder={false} />
              <Routes>
                <Route path="/">
                  <Route index element={<Home />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </Layout>
        </BalanceContext>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
