"use client"
import React from "react";
import {
  Navbar as MTNavbar,
  Collapse,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { signIn, signOut} from 'next-auth/react'
import { useSession } from "next-auth/react";
import ModalLoading from "./ModalLoading";
import ModalLogin from "./ModalLogin";
import { useState } from "react";

const NAV_MENU = ["Inicio", "Acerca de nosotros", "Comparte tu experiencia"];

function NavItem({ children }: { children: React.ReactNode }) {
  return (
    <li>
      <Typography
        as="a"
        href="#"
        variant="paragraph"
        className="flex items-center gap-2 font-medium"
      >
        {children}
      </Typography>
    </li>
  );
}

export function Navbar() {
  const {data: session}  = useSession()
  console.log(session)
  const [open, setOpen] = React.useState(false);
  const [isScrolling, setIsScrolling] = React.useState(false);
  function handleOpen() {
    setOpen((cur) => !cur);
  }

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpen(false)
    );
  }, []);

  React.useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 0) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [loginModal, setloginModal] = useState(false)
  const handleChangeLoading = () => {
    setloginModal(!loginModal)
  }

  return (
    <MTNavbar
      fullWidth
      shadow={false}
      blurred={false}
      color={isScrolling ? "white" : "transparent"}
      className="fixed top-0 z-50 border-0"
    >
      <ModalLogin handleOpenLoading={handleChangeLoading} openValue={loginModal}/>
      <div className="container mx-auto flex items-center justify-between">
        <Typography
          as="a"
          href="https://www.material-tailwind.com"
          target="_blank"
          className="text-lg font-bold"
          color={isScrolling ? "blue-gray" : "white"}
        >
          NUTRITION BOT
        </Typography>
        <ul
          className={`ml-10 hidden items-center gap-6 lg:flex ${
            isScrolling ? "text-gray-900" : "text-white"
          }`}
        >
          {NAV_MENU.map((name) => (
            <NavItem key={name}>{name}</NavItem>
          ))}
        </ul>
        {session?.user ? ( <div className="hidden items-center gap-2 lg:flex">
          <Button variant="text" color={isScrolling ? "gray" : "white"}>
            {session.user.name}
          </Button>
            <Button color={isScrolling ? "gray" : "white"} onClick={ () => signOut()}>Cerrar Sesión</Button>
        </div>)
        :
        (<div className="hidden items-center gap-2 lg:flex">
          
            <Button color={isScrolling ? "gray" : "white"} onClick={ () => setloginModal(true)}>Iniciar Sesión</Button>
        </div>)
        }
        <IconButton
          variant="text"
          onClick={handleOpen}
          color={isScrolling ? "gray" : "white"}
          className="ml-auto inline-block lg:hidden"
        >
          {open ? (
            <XMarkIcon strokeWidth={2} className="h-6 w-6" />
          ) : (
            <Bars3Icon strokeWidth={2} className="h-6 w-6" />
          )}
        </IconButton>
      </div>
      <Collapse open={open}>
        <div className="container mx-auto bg-white rounded-lg py-4 px-6 mt-3 border-t border-gray-200">
          <ul className="flex flex-col gap-4">
            {NAV_MENU.map((name) => (
              <NavItem key={name}>{name}</NavItem>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-2">
          {session?.user ? ( <div className="items-center gap-2 lg:flex">
          <Button variant="text" color="gray">
            {session.user.name}
          </Button>
            <Button color={isScrolling ? "gray" : "white"} onClick={ () => signOut()}>Cerrar Sesión</Button>
        </div>)
        :
        (<div className="items-center gap-2 lg:flex">
            <Button color={isScrolling ? "gray" : "white"} onClick={ () => {setloginModal(true)}}>Iniciar Sesión</Button>
        </div>)
        }
          </div>
        </div>
      </Collapse>
    </MTNavbar>
  );
}

export default Navbar;
