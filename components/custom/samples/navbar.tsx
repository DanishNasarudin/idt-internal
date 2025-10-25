"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useScrollListener } from "@/lib/hooks/useScrollListener";
import { cn } from "@/lib/utils";
import { ChevronDown, MenuIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LogoIcon } from "../icons";

type MenuStd = {
  title: string;
  href: string;
  target: boolean;
};

type MenuList = MenuStd & {
  dropdown?: MenuStd[];
};

const menuList: MenuList[] = [
  {
    title: "Home",
    href: "https://idealtech.com.my/",
    target: true,
    dropdown: undefined,
  },
  {
    title: "About",
    href: "javascript:void(0)",
    target: true,
    dropdown: [
      {
        title: "Ideal Tech PC",
        href: "https://idealtech.com.my/about-us/",
        target: true,
      },
      {
        title: "Events",
        href: "https://idealtech.com.my/offline-events/",
        target: true,
      },
      {
        title: "NVIDIA AI PC",
        href: "https://idealtech.com.my/nvidia-rtx-ai/",
        target: true,
      },
      {
        title: "NVIDIA Studio PC",
        href: "https://idealtech.com.my/geforce-studiopc/",
        target: true,
      },
    ],
  },
  {
    title: "Customize Your Own",
    href: "https://build.idealtech.com.my",
    target: true,
  },
  {
    title: "Special Offer",
    href: "javascript:void(0)",
    target: true,
    dropdown: [
      {
        title: "Package Gaming PCs",
        href: "https://idealtech.com.my/gaming-pcs/#rtx-geforce-pc",
        target: true,
      },
      {
        title: "Workstation PC",
        href: "https://idealtech.com.my/workstation-pc",
        target: true,
      },
      {
        title: "Custom Watercooling PC",
        href: "https://watercool.idealtech.com.my/",
        target: true,
      },
    ],
  },
  {
    title: "Customer Care",
    href: "javascript:void(0)",
    target: true,
    dropdown: [
      {
        title: "AEON Easy Payment",
        href: "https://idealtech.com.my/aeon-easy-payment/",
        target: true,
      },
      {
        title: "Terms & Condition",
        href: "https://idealtech.com.my/terms-of-use/",
        target: true,
      },
      {
        title: "Warranty Service",
        href: "https://idealtech.com.my/warranty-info/",
        target: true,
      },
      {
        title: "Cancellation & Refund Policy",
        href: "https://idealtech.com.my/cancellation-and-returns-policy/",
        target: true,
      },
    ],
  },
  {
    title: "Contact Us",
    href: "https://idealtech.com.my/contact-us/",
    target: true,
    dropdown: [
      {
        title: "Contacts",
        href: "https://idealtech.com.my/contact-us/",
        target: true,
      },
      {
        title: "Career",
        href: "https://career.idealtech.com.my/",
        target: true,
      },
    ],
  },
];

function Navbar() {
  const scroll = useScrollListener();
  const [hideNavbar, setHideNavbar] = useState(false);

  useEffect(() => {
    if (scroll.checkY > 0) {
      setHideNavbar(true);
    } else if (scroll.checkY < 0) {
      setHideNavbar(false);
    }
  }, [scroll.y, scroll.lastY]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const router = useRouter();

  // ------ clear the link from google analytics
  let isSafari: boolean;
  let pathname = "";

  if (typeof window !== "undefined") {
    pathname = String(window.location.search);

    isSafari = /^((?!chrome|android).)*safari/i.test(
      window.navigator.userAgent
    );
  }
  useEffect(() => {
    // // List of common Google Analytics parameters - remove them

    if (pathname.includes("_ga") || pathname.includes("_gl")) {
      router.replace("/");
    }
  }, [pathname]);

  return (
    <nav
      className={`sticky top-0 z-[100] transition-all
    ${hideNavbar ? "translate-y-[-100%]" : ""}
    `}
    >
      <div
        className={`
    top-0 z-[100] border-b-[1px] border-border bg-background/80 transition-all 
    before:absolute before:top-0 before:-z-10 before:h-full before:w-full before:backdrop-blur-md before:content-['']
    
    `}
      >
        <div
          className="
      relative mx-auto max-w-[1000px]"
        >
          <NavigationMenu
            className="z-[100] mx-auto hidden w-full max-w-none items-center justify-between
            px-4 py-4 text-xs sm:flex sm:py-8 [&>div:first-child]:w-full
      [&>div]:flex"
            delayDuration={0}
          >
            <NavigationMenuList
              className="flex justify-between"
              style={{ width: "100%" }}
            >
              <Link href={"/"}>
                <LogoIcon size={40} className="text-foreground" />
              </Link>
              {menuList.map((main, idx) => {
                if (main.dropdown === undefined) {
                  return (
                    <React.Fragment key={idx}>
                      <NavigationMenuItem className="bg-transparent">
                        <NavigationMenuLink
                          href={main.href}
                          target={main.target ? "_blank" : undefined}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "hover:accent/50 bg-transparent"
                          )}
                        >
                          {main.title}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </React.Fragment>
                  );
                } else {
                  return (
                    <React.Fragment key={idx}>
                      <Popover>
                        <PopoverTrigger asChild className="gap-2">
                          <Button
                            variant="ghost"
                            className="[&[data-state=open]>svg]:rotate-0"
                          >
                            {main.title}
                            <ChevronDown className="h-4 w-4 shrink-0 rotate-90 duration-200 transition-transform" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className={cn(
                            "z-[100] mt-8",
                            "relative overflow-hidden bg-background/50"
                          )}
                        >
                          <ul className=" transition-all before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:backdrop-blur-md before:content-['']">
                            {main.dropdown.map((drop) => (
                              <ListItem
                                key={drop.title}
                                title={drop.title}
                                href={drop.href}
                                target={drop.target ? "_blank" : undefined}
                                className="flex items-center"
                              ></ListItem>
                            ))}
                          </ul>
                        </PopoverContent>
                      </Popover>
                    </React.Fragment>
                  );
                }
              })}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="z-[100] flex justify-between px-4 py-4 sm:hidden">
            <Link href={"/"}>
              <LogoIcon size={40} className="text-foreground" />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-transparent px-2 text-white">
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent
                className="
              top-0 z-[100] flex w-full
              flex-col border-b-[1px] border-[#323232] bg-background/80 transition-all 
    before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:backdrop-blur-md before:content-['']
              "
              >
                <NavigationMenu className="mt-8 w-full max-w-none items-start [&>div:first-child]:w-full px-4">
                  <NavigationMenuList className="flex w-full flex-col items-start gap-2 space-x-0">
                    {menuList.map((main, idx) => {
                      if (main.dropdown === undefined) {
                        return (
                          <React.Fragment key={idx}>
                            <NavigationMenuItem className="w-full bg-transparent">
                              <Link
                                href={main.href}
                                target={main.target ? "_blank" : undefined}
                              >
                                <NavigationMenuLink
                                  className={cn(
                                    navigationMenuTriggerStyle(),
                                    "hover:accent/50 w-full items-start bg-transparent"
                                  )}
                                >
                                  {main.title}
                                </NavigationMenuLink>
                              </Link>
                            </NavigationMenuItem>
                          </React.Fragment>
                        );
                      } else {
                        return (
                          <React.Fragment key={idx}>
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full text-sm"
                            >
                              <AccordionItem
                                value={String(idx)}
                                className="border-b-0 data-[state=open]:border-b"
                              >
                                <AccordionTrigger className="py-2 px-4">
                                  {main.title}
                                </AccordionTrigger>
                                <AccordionContent className="mt-2 flex flex-col gap-2">
                                  {main.dropdown.map((drop) => (
                                    <ListItem
                                      key={drop.title}
                                      title={drop.title}
                                      href={drop.href}
                                      target={
                                        drop.target ? "_blank" : undefined
                                      }
                                      className="flex items-start px-4"
                                    ></ListItem>
                                  ))}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </React.Fragment>
                        );
                      }
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
                <SheetFooter className="flex-col gap-4 text-zinc-400">
                  <LogoIcon size={40} className="text-white" />
                  <p>Ideal Tech PC Sdn Bhd</p>
                  <p>
                    17, Jalan Pandan Prima 1, Dataran Pandan Prima, 55100 Kuala
                    Lumpur. 201401008251 (1084329-M)
                  </p>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "hover:text-accent-foreground focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent focus:bg-accent",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
