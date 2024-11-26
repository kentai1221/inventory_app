"use client";
import { useSidebarContext } from "@/app/lib/sidebar-context";
import {useTranslations, useLocale} from 'next-intl';
import { Dropdown, Sidebar, TextInput, Tooltip } from "flowbite-react";
import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";
import type { ComponentProps, FC, HTMLAttributeAnchorTarget } from "react";
import { useEffect, useState } from "react";
import {
  HiAdjustments,
  HiChartPie,
  HiClipboardList,
  HiCog,
  HiCollection,
  HiDocumentReport,
  HiInboxIn,
  HiLockClosed,
  HiSearch,
  HiShoppingBag,
  HiSupport,
  HiUsers,
  HiViewGrid,
  HiOutlineTable,
  HiOutlinePencilAlt
} from "react-icons/hi";
import { twMerge } from "tailwind-merge";
import Cookies from 'js-cookie';


interface SidebarItem {
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  icon?: FC<ComponentProps<"svg">>;
  label: string;
  items?: SidebarItem[];
  badge?: string;
}

interface SidebarItemProps extends SidebarItem {
  pathname: string;
}

export function DashboardSidebar() {
  return (
    <>
      <div className="lg:hidden">
        <MobileSidebar />
      </div>
      <div className="hidden lg:block">
        <DesktopSidebar />
      </div>
    </>
  );
}

function DesktopSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (locale:string) => {
    Cookies.set('locale', locale);
    router.refresh();
  };
  
  const { isCollapsed, setCollapsed } = useSidebarContext().desktop;
  const [isPreview, setIsPreview] = useState(isCollapsed);

  useEffect(() => {
    if (isCollapsed) setIsPreview(false);
  }, [isCollapsed]);

  const preview = {
    enable() {
      if (!isCollapsed) return;

      setIsPreview(true);
      setCollapsed(false);
    },
    disable() {
      if (!isPreview) return;

      setCollapsed(true);
    },
  };

  const i18n = useTranslations('sidebar');
  const pages: SidebarItem[] = [
    { href: "/", icon: HiChartPie, label: i18n('dashboard') },
    { href: "/trainee", icon: HiUsers, label:i18n('trainee') },
    // { href: "/mailing/inbox", icon: HiInboxIn, label: "Inbox", badge: "3" },
    // {
    //   icon: HiShoppingBag,
    //   label: "E-commerce",
    //   items: [
    //     { href: "/e-commerce/products", label: "Products" },
    //     { href: "/e-commerce/billing", label: "Billing" },
    //     { href: "/e-commerce/invoice", label: "Invoice" },
    //   ],
    // },
    // {
    //   icon: HiUsers,
    //   label: "Users",
    //   items: [
    //     { href: "/users/list", label: "Users list" },
    //     { href: "/users/profile", label: "Profile" },
    //     { href: "/users/feed", label: "Feed" },
    //     { href: "/users/settings", label: "Settings" },
    //   ],
    // },
    {
      icon: HiDocumentReport,
      label: i18n('assessment'),
      items: [
        { href: "/pages/pricing", label: i18n('physical')},
        { href: "/pages/maintenance", label: i18n('mental') },
        { href: "/pages/404", label: i18n('health_record') },
      ],
    },
    {
      icon: HiOutlinePencilAlt,
      label: i18n('training'),
      items: [
        { href: "/authentication/sign-in", label:  i18n('info') },
        { href: "/authentication/sign-up", label:  i18n('material') },
        { href: "/authentication/forgot-password", label:  i18n('video') },
      ],
    },
  ];

  const externalPages: SidebarItem[] = [
    {
      href: "/",
      target: "_blank",
      icon: HiOutlineTable,
      label: i18n('schedule'),
    },
    {
      href: "https://polyu.edu.hk",
      target: "_blank",
      icon: HiSupport,
      label: i18n('help'),
    },
  ];
  


  return (
    <Sidebar
      onMouseEnter={preview.enable}
      onMouseLeave={preview.disable}
      aria-label="Sidebar with multi-level dropdown example"
      collapsed={isCollapsed}
      className={twMerge(
        "fixed inset-y-0 left-0 z-20 flex h-full shrink-0 flex-col border-r border-gray-200 pt-16 duration-75 lg:flex dark:border-gray-700",
        isCollapsed && "hidden w-16",
      )}
      id="sidebar"
    >
      <div className="flex h-full flex-col justify-between">
        <div className="py-2">
          <Sidebar.Items>
            <Sidebar.ItemGroup className="mt-0 border-t-0 pb-1 pt-0">
              {pages.map((item) => (
                <SidebarItem key={item.label} {...item} pathname={pathname} />
              ))}
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup className="mt-2 pt-2">
              {externalPages.map((item) => (
                <SidebarItem key={item.label} {...item} pathname={pathname} />
              ))}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
        {/* <BottomMenu isCollapsed={isCollapsed} /> */}
      </div>
    </Sidebar>
  );
}

function MobileSidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebarContext().mobile;

  if (!isOpen) return null;

  const i18n = useTranslations('sidebar');
  const pages: SidebarItem[] = [
    { href: "/", icon: HiChartPie, label: i18n('dashboard') },
    { href: "/trainee", icon: HiUsers, label:i18n('trainee') },
    // { href: "/mailing/inbox", icon: HiInboxIn, label: "Inbox", badge: "3" },
    // {
    //   icon: HiShoppingBag,
    //   label: "E-commerce",
    //   items: [
    //     { href: "/e-commerce/products", label: "Products" },
    //     { href: "/e-commerce/billing", label: "Billing" },
    //     { href: "/e-commerce/invoice", label: "Invoice" },
    //   ],
    // },
    // {
    //   icon: HiUsers,
    //   label: "Users",
    //   items: [
    //     { href: "/users/list", label: "Users list" },
    //     { href: "/users/profile", label: "Profile" },
    //     { href: "/users/feed", label: "Feed" },
    //     { href: "/users/settings", label: "Settings" },
    //   ],
    // },
    {
      icon: HiDocumentReport,
      label: i18n('assessment'),
      items: [
        { href: "/pages/pricing", label: i18n('physical')},
        { href: "/pages/maintenance", label: i18n('mental') },
        { href: "/pages/404", label: i18n('health_record') },
      ],
    },
    {
      icon: HiOutlinePencilAlt,
      label: i18n('training'),
      items: [
        { href: "/authentication/sign-in", label:  i18n('info') },
        { href: "/authentication/sign-up", label:  i18n('material') },
        { href: "/authentication/forgot-password", label:  i18n('video') },
      ],
    },
  ];

  const externalPages: SidebarItem[] = [
    {
      href: "/",
      target: "_blank",
      icon: HiOutlineTable,
      label: i18n('schedule'),
    },
    {
      href: "https://polyu.edu.hk",
      target: "_blank",
      icon: HiSupport,
      label: i18n('help'),
    },
  ];

  return (
    <>
      <Sidebar
        aria-label="Sidebar with multi-level dropdown example"
        className={twMerge(
          "fixed inset-y-0 left-0 z-20 hidden h-full shrink-0 flex-col border-r border-gray-200 pt-16 lg:flex dark:border-gray-700",
          isOpen && "flex",
        )}
        id="sidebar"
      >
        <div className="flex h-full flex-col justify-between">
          <div className="py-2">
            {/* <form className="pb-3">
              <TextInput
                icon={HiSearch}
                type="search"
                placeholder="Search"
                required
                size={32}
              />
            </form> */}
            <Sidebar.Items>
              <Sidebar.ItemGroup className="mt-0 border-t-0 pb-1 pt-0">
                {pages.map((item) => (
                  <SidebarItem key={item.label} {...item} pathname={pathname} />
                ))}
              </Sidebar.ItemGroup>
              <Sidebar.ItemGroup className="mt-2 pt-2">
                {externalPages.map((item) => (
                  <SidebarItem key={item.label} {...item} pathname={pathname} />
                ))}
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
          {/* <BottomMenu isCollapsed={false} /> */}
        </div>
      </Sidebar>
      <div
        onClick={close}
        aria-hidden="true"
        className="fixed inset-0 z-10 h-full w-full bg-gray-900/50 pt-16 dark:bg-gray-900/90"
      />
    </>
  );
}

function SidebarItem({
  href,
  target,
  icon,
  label,
  items,
  badge,
  pathname,
}: SidebarItemProps) {
  if (items) {
    const isOpen = items.some((item) => pathname.startsWith(item.href ?? ""));

    return (
      <Sidebar.Collapse
        icon={icon}
        label={label}
        open={isOpen}
        theme={{ list: "space-y-2 py-2  [&>li>div]:w-full" }}
      >
        {items.map((item) => (
          <Sidebar.Item
            key={item.label}
            as={Link}
            href={item.href}
            target={item.target}
            className={twMerge(
              "justify-center [&>*]:font-normal",
              pathname === item.href && "bg-gray-100 dark:bg-gray-700",
            )}
          >
            {item.label}
          </Sidebar.Item>
        ))}
      </Sidebar.Collapse>
    );
  }

  return (
    <Sidebar.Item
      as={Link}
      href={href}
      target={target}
      icon={icon}
      label={badge}
      className={twMerge(pathname === href && "bg-gray-100 dark:bg-gray-700")}
    >
      {label}
    </Sidebar.Item>
  );
}

function BottomMenu({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-center gap-4",
        isCollapsed && "flex-col",
      )}
    >
      <button className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white">
        <span className="sr-only">Tweaks</span>
        <HiAdjustments className="h-6 w-6" />
      </button>
      <Tooltip content="Settings page">
        <Link
          href="/users/settings"
          className="inline-flex cursor-pointer justify-center rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          <span className="sr-only">Settings page</span>
          <HiCog className="h-6 w-6" />
        </Link>
      </Tooltip>
      <div>
        {/*<LanguageDropdown />*/}
      </div>
    </div>
  );
}

