"use client";
import React, { useEffect } from "react";
import { Button, buttonVariants } from "../../components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/ui/hover-card";
import { symbolIcons, SymbolInfoType, SymbolType } from "../../lib/types";
import ThemeSwitcher from "../theme/theme-switcher";

type NavbarPropsType = {
  symbolInfo: SymbolInfoType;
  selectedSymbol: string;
  setSelectedSymbol: (symbol: SymbolType) => void;
  balance: string;
  tradableAmt: number;
  lockedAmt: number;
};

const Navbar = ({
  symbolInfo,
  selectedSymbol,
  setSelectedSymbol,
  balance,
  tradableAmt,
  lockedAmt,
}: NavbarPropsType) => {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      console.log("no session");
    }
  }, [session]);

  return (
    <div
      className="
        relative flex justify-between items-center px-6 py-4 border-b mb-5
       
      "
    >
      <div className="text-[#ffd633] text-4xl font-semibold tracking-tight z-20">
        exness
      </div>

      {/* Only show symbols & balance if session exists */}
      {session?.user && (
        <>
          <div className="flex gap-2 flex-wrap z-20">
            {(Object.keys(symbolInfo) as Array<"btc" | "eth" | "sol">).map(
              (symbol) => {
                const info = symbolInfo[symbol];
                const isActive = selectedSymbol === symbol;

                return (
                  <Button
                    key={symbol}
                    onClick={() => setSelectedSymbol(symbol)}
                    className={`
                      px-5 py-5 font-semibold text-[17px] rounded-md transition-all
                      border-b-2 border-transparent
                      data-[active=true]:border-accent
                      data-[active=true]:shadow-md
                      data-[active=true]:bg-muted
                      data-[active=true]:text-foreground
                      hover:bg-muted/50 hover:text-foreground
                    `}
                    variant="ghost"
                    data-active={isActive ? "true" : "false"}
                  >
                    <Image
                      src={symbolIcons[info.symbol] || ""}
                      alt={info.symbol}
                      width={28}
                      height={20}
                    />
                    {info.symbol}
                  </Button>
                );
              },
            )}
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 text-sm text-muted-foreground z-20">
            <span className="font-medium">Balance:</span>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-semibold text-foreground">
                  ${balance}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-muted-foreground">Tradable:</span>
                <span className="text-green-500 font-medium">
                  ${tradableAmt}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-muted-foreground">Locked:</span>
                <span className="text-red-500 font-medium">${lockedAmt}</span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="z-20">
        <ThemeSwitcher />
      </div>

      <div className="z-20">
        {session?.user ? (
          <HoverCard>
            <HoverCardTrigger>
              <Image
                alt="user-image"
                src={session.user.image || "default.jpg"}
                width={32}
                height={32}
                className="rounded-full"
              />
            </HoverCardTrigger>
            <HoverCardContent>
              <Button variant="ghost" onClick={() => signOut()}>
                LogOut
              </Button>
            </HoverCardContent>
          </HoverCard>
        ) : (
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline" })}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
