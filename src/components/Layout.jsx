import { Outlet, NavLink } from "react-router";

export default function Layout() {
  return (
    <div>
      
      <header>
        <nav>
          <NavLink></NavLink>
          <NavLink></NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};
