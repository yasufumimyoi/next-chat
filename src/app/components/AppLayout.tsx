import { Header } from "./Header";
import { Menu } from "./Menu";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <div className="flex p-4">
        <aside className="w-64">
          <Menu />
        </aside>
        <main className="flex-grow p-4">{children}</main>
      </div>
    </div>
  );
};
