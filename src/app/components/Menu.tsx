import Link from "next/link";
import { MenuItems } from "../constants/menu";
export const Menu = () => {
  return (
    <ul className="flex flex-col gap-4">
      {MenuItems.map((item) => (
        <li className="border-b border-gray-700 pb-2" key={item.href}>
          <Link href={item.href}>{item.label}</Link>
        </li>
      ))}
    </ul>
  );
};
