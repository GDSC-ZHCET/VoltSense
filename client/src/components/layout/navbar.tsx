import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import Link from "next/link";
import { Button } from "../ui/button";

export const VoltLogo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="lightblue"
      stroke="none"
      width="40"
      height="40"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
};

export default function Nav() {
  return (
    <Navbar className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white shadow-lg rounded-2xl px-8 py-4 w-[95%] max-w-6xl transition-all duration-300 z-10 hidden md:flex">
      <NavbarBrand className="flex items-center space-x-2">
        <VoltLogo />
        <p className="font-bold text-white tracking-wide">Voltsense</p>
      </NavbarBrand>
      <NavbarContent
        className="hidden sm:flex gap-x-8 space-x-4"
        justify="center"
      >
        <NavbarItem>
          <Link color="foreground" href="#">
            Home
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            About
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="hidden sm:flex gap-x-8 space-x-4" justify="end">
        <NavbarItem className="hidden lg:flex">
          <Button
            // as={Link}
            // href="#"
            // variant="flat"
            className="border border-grey-500 px-5 py-2 rounded-lg text-white-500 text-base hover:bg-blue-500 hover:text-white transition"
          >
            Login
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            // as={Link}
            // href="#"
            // variant="flat"
            className="border border-grey-500 px-5 py-2 rounded-lg text-white-500  text-base hover:bg-blue-500 hover:text-white transition"
          >
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
