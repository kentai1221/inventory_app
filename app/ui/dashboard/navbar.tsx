"use client";
import { useSession, signOut } from "next-auth/react"
import {useTranslations, useLocale} from 'next-intl';
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { useSidebarContext } from "@/app/lib/sidebar-context";
import { useMediaQuery } from "@/app/lib/use-media-query";
import {
  Avatar,
  DarkThemeToggle,
  Dropdown,
  Navbar,
  Tooltip,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import {
  HiArchive,
  HiBell,
  HiCog,
  HiCurrencyDollar,
  HiEye,
  HiInbox,
  HiLogout,
  HiMenuAlt1,
  HiOutlineTicket,
  HiSearch,
  HiShoppingBag,
  HiUserCircle,
  HiUsers,
  HiViewGrid,
  HiX,
  HiOutlineBell
} from "react-icons/hi";
import Cookies from 'js-cookie';
import LanguageDropdown from "@/app/ui/languageDropdown";

export function DashboardNavbar() {
  const { status, data: session } = useSession()
  const i18n = useTranslations('navBar');
  const locale = useLocale();
  const sidebar = useSidebarContext();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  function handleToggleSidebar() {
    if (isDesktop) {
      sidebar.desktop.toggle();
    } else {
      sidebar.mobile.toggle();
    }
  }

  //console.log(session?.user)

  const { user: { session_expiry: sessionExpiry = null } = {} } = session || {};

  useEffect(() => {
    const isSiteSessionExpired = sessionExpiry && new Date(sessionExpiry) < new Date();
    if (status === "authenticated" && isSiteSessionExpired) {
      signOut();
    }
  }, [sessionExpiry,status]);

  return (
    <Navbar
      fluid
      className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white p-0 sm:p-0 dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="w-full p-3 pr-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleToggleSidebar}
              className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Toggle sidebar</span>
              {/* mobile */}
              <div className="lg:hidden">
                {sidebar.mobile.isOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenuAlt1 className="h-6 w-6" />
                )}
              </div>
              {/* desktop */}
              <div className="hidden lg:block">
                <HiMenuAlt1 className="h-6 w-6" />
              </div>
            </button>
            <Navbar.Brand as={Link} href="/" className="mr-14">
              {/* <Image
                className="mr-3 h-8"
                alt=""
                src="/polyu_logo.png"
                width={32}
                height={32}
              /> */}
              
              <span className="lg:hidden self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              {i18n('title_mobile')}
              </span>
              <span className="hidden lg:block self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              {i18n('title')} - {locale=="en"?session?.user?.branches[0]?.name_en:session?.user?.branches[0]?.name} 
              </span>
            </Navbar.Brand>
            {/* <form className="hidden lg:block lg:pl-2">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <TextInput
                className="w-full lg:w-96"
                icon={HiSearch}
                id="search"
                name="search"
                placeholder="Search"
                required
                type="search"
              />
            </form> */}
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              {/* <button className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700">
                <span className="sr-only">Search</span>
                <HiSearch className="h-6 w-6" />
              </button> */}
              <NotificationBellDropdown />
              {/* <AppDrawerDropdown /> */}
              <LanguageDropdown />
              <div className="hidden dark:block">
                <Tooltip content={i18n('light_mode')} className="text-white">
                  <DarkThemeToggle />
                </Tooltip>
              </div>
              <div className="dark:hidden">
                <Tooltip content={i18n('dark_mode')}>
                  <DarkThemeToggle />
                </Tooltip>
              </div>
              <div className="ml-3 flex items-center">
                <UserDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Navbar>
  );
}


function NotificationBellDropdown() {
  const i18n = useTranslations('navBar');
  return (
    <Dropdown
      className="rounded"
      arrowIcon={false}
      inline
      label={
        <span className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:text-white">
          <span className="sr-only">Notifications</span>
          <HiBell className="h-6 w-6" />
        </span>
      }
      theme={{ content: "py-0" }}
    >
      <div className="max-w-sm">
        <div className="block rounded-t-xl bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700 dark:bg-gray-700 dark:text-white">
        {i18n('notifications')}
        </div>
        <div>
          {/* <Link
            href="#"
            className="flex border-y px-4 py-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <div className="shrink-0">
              <Image
                alt=""
                height={44}
                src="/images/users/bonnie-green.png"
                width={44}
                className="rounded-full"
              />
              <div className="absolute -mt-5 ml-6 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-primary-700 dark:border-gray-700">
                <svg
                  className="h-3 w-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
                  <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
                </svg>
              </div>
            </div>
            <div className="w-full pl-3">
              <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
                New message from&nbsp;
                <span className="font-semibold text-gray-900 dark:text-white">
                  Bonnie Green
                </span>
                : &quot;Hey, what&apos;s up? All set for the presentation?&quot;
              </div>
              <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                a few moments ago
              </div>
            </div>
          </Link> */}
          <div  className="min-w-80 flex justify-center border-y px-4 py-3 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-600">
              <div className="mb-1.5 text-sm font-normal text-gray-500 dark:text-gray-400">
              {i18n('empty')}
              </div>
          </div>
        </div>
        <Link
          href="#"
          className="block rounded-b-xl border-t border-gray-200 bg-gray-50 py-2 text-center text-base font-normal text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:underline"
        >
          <div className="inline-flex items-center gap-x-2">
            <HiEye className="h-5 w-5" />
            <span>{i18n('view_all')}</span>
          </div>
        </Link>
      </div>
    </Dropdown>
  );
}

function AppDrawerDropdown() {
  return (
    <Dropdown
      className="rounded"
      arrowIcon={false}
      inline
      label={
        <span className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
          <span className="sr-only">Apps</span>
          <HiViewGrid className="h-6 w-6" />
        </span>
      }
      theme={{ content: "py-0" }}
    >
      <div className="block border-b bg-gray-50 px-4 py-2 text-center text-base font-medium text-gray-700 dark:border-b-gray-600 dark:bg-gray-700 dark:text-gray-400">
        Apps
      </div>
      <div className="grid grid-cols-3 gap-4 p-4">
        <Link
          href="#"
          className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiShoppingBag className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Sales
          </div>
        </Link>
        <Link
          href="#"
          className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiUsers className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Users
          </div>
        </Link>
        <Link
          href="#"
          className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiInbox className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Inbox
          </div>
        </Link>
        <Link
          href="#"
          className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiUserCircle className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Profile
          </div>
        </Link>
        <Link
          href="#"
          className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiCog className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Settings
          </div>
        </Link>
        <Link
          href="#"
          className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiArchive className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Products
          </div>
        </Link>
        <Link
          href="#"
          className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiCurrencyDollar className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Pricing
          </div>
        </Link>
        <Link
          href="#"
          className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiOutlineTicket className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Billing
          </div>
        </Link>
        <Link
          href="#"
          className="block rounded-lg p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <HiLogout className="mx-auto mb-1 h-7 w-7 text-gray-500 dark:text-gray-400" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Logout
          </div>
        </Link>
      </div>
    </Dropdown>
  );
}

function UserDropdown() {
  const i18n = useTranslations('navBar');
  const { data: session } = useSession()
  //console.log(session)
  return (
    <Dropdown
      className="rounded"
      arrowIcon={false}
      inline
      label={
        <span>
          <span className="sr-only">User menu</span>
          <Avatar alt="" img={session?.user?.image?session?.user?.image:""} rounded size="sm" />
        </span>
      }
    >
      <Dropdown.Header className="px-4 py-3">
        <span className="block text-sm mb-2">{i18n('user')}: {session?.user?.name}</span>
        <span className="block truncate text-sm">
        {i18n('email')}: {session?.user?.email}
        </span>
      </Dropdown.Header>
      <Link href="/settings"><Dropdown.Item>{i18n('setting')}</Dropdown.Item></Link>
      <Dropdown.Divider />
      <Dropdown.Item onClick={() => signOut()}>{i18n('logout')}</Dropdown.Item>
    </Dropdown>
  );
}
