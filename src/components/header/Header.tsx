"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import Link from "next/link";
import "../../styles/header.css";
import Image from "next/image";
import Logo from "@/public/Logo.png";
// import DesktopBanner from "./DesktopBanner";
// import MobileBanner from "./MobileBanner";

export type HeaderLinkData = { id: string; name: string } & (
    | { url: string }
    | { url: string; scrollRef: React.RefObject<HTMLDivElement | null> }
    | { customOnClick: () => void }
);

/**
 * The main header, consisting of a big "UWB HACKS" as well
 * as navigation links.
 * On mobile, this contains a sidebar.
 * @param links - is a list of links to show on the header.
 * @param mainPage - should the header be shown in the main page style?
 * @param banner - should the banner be shown?
 *                 This should only really be used on the main page.
 * @param bgColor - hex code of the header background color (e.g. #ffffff)
 */
export default function Header({
    links,
    mainPage,
    // banner,
    bgColor = null,
}: {
    links: HeaderLinkData[];
    mainPage?: boolean;
    banner?: boolean;
    bgColor?: string | null;
}) {
    const [sideNav, setSideNav] = useState(false);

    let headerBackgroundColor;
    if (mainPage) {
        headerBackgroundColor = "#0a84dc";
    } else if (bgColor != null) {
        headerBackgroundColor = bgColor;
    } else {
        headerBackgroundColor = "#84c6ff";
    }

    return (
        <>
            <div className="hidden lg:block">
                {/* Heading spacer */}
                <div className="h-28" />
                <HeaderDesktop
                    links={links}
                    mainPage={mainPage}
                    // banner={banner}
                    bgColor={headerBackgroundColor}
                />
            </div>
            <div className="block lg:hidden">
                <HeaderMobile
                    setSideNav={setSideNav}
                    mainPage={mainPage}
                    // banner={banner}
                    bgColor={headerBackgroundColor}
                />
            </div>

            <HeaderSidebar
                links={links}
                sideNav={sideNav}
                setSideNav={setSideNav}
            />
        </>
    );
}

function UWBHacksButton({
    mainPage,
    mobile,
}: {
    mainPage?: boolean;
    mobile?: boolean;
}) {
    return (
        <Link href="/">
            <Image
                src={Logo}
                alt="UWB Hacks 2026: The Future"
                className={`${mobile ? "tilt-animation" : ""} scale-up-animation ${mainPage ? "w-[50%] sm:w-[40%] md:w-[30%] lg:w-[20%]" : "w-[45%] sm:w-[35%] md:w-[25%] lg:w-[15%]"} top-[28px] absolute`}
                // Slightly bigger than the real size to allow the scale up animation to work at full resolution.
                sizes="(min-width: 1000px) 25vw, (min-width: 800px) 35vw, (min-width: 450px) 45vw, 55vw"
            />
        </Link>
    );
}

function HeaderLink({ link }: { link: HeaderLinkData }) {
    // TODO: When selected, add border-3 border-white
    const linkClassName =
        "font-bold text-xl scale-up-animation rounded-full text-white p-[10px]";
    if ("customOnClick" in link) {
        return (
            <button className={linkClassName} onClick={link.customOnClick}>
                {link.name}
            </button>
        );
    }

    if ("scrollRef" in link) {
        return (
            <Link href={link.url} scroll={false}>
                <button
                    className={linkClassName}
                    onClick={() => {
                        // Scroll to the relevant section.
                        if (link.scrollRef.current) {
                            link.scrollRef.current.scrollIntoView({
                                behavior: "smooth",
                            });
                        }
                    }}
                >
                    {link.name}
                </button>
            </Link>
        );
    }

    return (
        <Link href={link.url}>
            <button className={linkClassName}>{link.name}</button>
        </Link>
    );
}

function HeaderDesktop({
    links,
    mainPage,
    // banner,
    bgColor,
}: {
    links: HeaderLinkData[];
    mainPage?: boolean;
    banner?: boolean;
    bgColor: string;
}) {
    // const [bannerVisible, setBannerVisible] = useState(banner || false);

    return (
        <nav className="fixed z-999 top-0 w-full">
            <div
                className="flex items-center justify-around lg:justify-between h-28 lg:px-20 w-full"
                style={{ backgroundColor: bgColor }}
            >
                <UWBHacksButton mainPage={mainPage} />

                <div className="hidden md:flex gap-x-10 ">
                    {links.map((link) => (
                        <HeaderLink key={link.id} link={link} />
                    ))}
                </div>
            </div>

            {/* <DesktopBanner
                bannerVisible={bannerVisible}
                setBannerVisible={setBannerVisible}
            /> */}
        </nav>
    );
}

function HeaderMobile({
    mainPage,
    setSideNav,
    // banner,
    bgColor,
}: {
    mainPage?: boolean;
    setSideNav: Dispatch<SetStateAction<boolean>>;
    // banner?: boolean;
    bgColor: string;
}) {
    // const [bannerVisible] = useState(banner || false);

    return (
        <nav className="">
            {/* <MobileBanner bannerVisible={bannerVisible} /> */}
            <div
                className="flex items-center justify-between lg:justify-between h-28 px-5 lg:px-20 w-full min-w-72"
                style={{ backgroundColor: bgColor }}
            >
                <UWBHacksButton mainPage={mainPage} mobile />
                <HeaderSidebarButton setSideNav={setSideNav} />
            </div>
        </nav>
    );
}

function HeaderSidebarButton({
    setSideNav,
}: {
    setSideNav: Dispatch<SetStateAction<boolean>>;
}) {
    return (
        <>
            <button
                className="w-12 h-12 flex justify-center items-center hover:scale-[1.1] transiton duration-300"
                onClick={() => {
                    setSideNav(true);
                }}
            >
                <Image
                    src="/header/menu-icon.svg"
                    width={35}
                    height={35}
                    alt="Side Nav"
                />
            </button>
        </>
    );
}

function HeaderSidebarLink({
    link,
    setSideNav,
}: {
    link: HeaderLinkData;
    setSideNav: Dispatch<SetStateAction<boolean>>;
}) {
    const linkClassName = "text-white font-h1 text-3xl";

    if ("customOnClick" in link) {
        return (
            <button className={linkClassName} onClick={link.customOnClick}>
                {link.name}
            </button>
        );
    }

    if ("scrollRef" in link) {
        return (
            <Link href={link.url} scroll={false} className="text-center">
                <button
                    className={linkClassName}
                    onClick={() => {
                        setSideNav(false);

                        // Scroll down to the relevant section.
                        if (link.scrollRef.current) {
                            link.scrollRef.current.scrollIntoView({
                                behavior: "smooth",
                            });
                        }
                    }}
                >
                    {link.name}
                </button>
            </Link>
        );
    }

    return (
        <Link href={link.url} className="text-center">
            <button
                className={linkClassName}
                onClick={() => {
                    setSideNav(false);
                }}
            >
                {link.name}
            </button>
        </Link>
    );
}

function HeaderSidebar({
    links,
    sideNav,
    setSideNav,
}: {
    links: HeaderLinkData[];
    sideNav: boolean;
    setSideNav: Dispatch<SetStateAction<boolean>>;
}) {
    return (
        <div
            className={`bg-[#0a84dc] fixed top-0 w-full h-screen p-5 font-h1 text-3xl transition-transform z-1000`}
            style={{
                transform: sideNav ? undefined : "translate(100%, 0)",
            }}
        >
            <button
                className="hover:scale-[1.1] transiton duration-300"
                onClick={() => setSideNav(false)}
            >
                X
            </button>
            <div className="flex flex-col gap-y-5 justify-around h-1/2 pt-20">
                {links.map((link) => (
                    <HeaderSidebarLink
                        key={link.id}
                        link={link}
                        setSideNav={setSideNav}
                    />
                ))}
            </div>
        </div>
    );
}

export async function handleLogout() {
    try {
        const response = await fetch("/api/logout", { method: "POST" });
        if (response.ok) {
            window.location.href = "/"; // Redirect to the main page after logout
        } else {
            console.error("Failed to log out");
        }
    } catch (error) {
        console.error("Error during logout:", error);
    }
}
