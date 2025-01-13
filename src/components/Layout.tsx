import Connect from "./Connect";

declare type LayoutType = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutType) => {
  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-white border-gray-200 dark:bg-gray-900 shadow-md">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <button className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="https://gamacoin.ai/assets/images/gama-logo.svg"
              className="h-8"
              alt="Gama Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Flip Coin
            </span>
          </button>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <Connect />
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
};

export default Layout;
