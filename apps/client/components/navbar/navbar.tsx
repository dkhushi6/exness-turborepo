import React, { useEffect } from "react";
import { Button, buttonVariants } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { SymbolType } from "@/lib/types";
const symbolInfoType = {
  btc: { name: "Bitcoin", symbol: "BTCUSDT", color: "#B3995E" },
  eth: { name: "Ethereum", symbol: "ETHUSDT", color: "#82C995" },
  sol: { name: "Solana", symbol: "SOLUSDT", color: "#F28B82" },
};
type NavbarPropsType = {
  symbolInfo: typeof symbolInfoType;
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
    <div className="flex justify-between items-center px-6 py-4  border-b border-[#2a2f3e]">
      <div className="text-[#ffd633] text-4xl font-semibold tracking-tight">
        exness
      </div>
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(symbolInfo) as Array<"btc" | "eth" | "sol">).map(
          (symbol) => {
            const info = symbolInfo[symbol];
            const isActive = selectedSymbol === symbol;

            return (
              <Button
                key={symbol}
                onClick={() => setSelectedSymbol(symbol)}
                className={`
                  px-5 py-2.5 rounded-md font-semibold transition-all text-sm
                  ${
                    isActive
                      ? "text-white shadow-lg border-0"
                      : "bg-[#252936] text-[#8b92a7] hover:bg-[#2a2f3e] hover:text-white border-0"
                  }
                `}
                style={isActive ? { backgroundColor: info.color } : {}}
                variant="outline"
              >
                {info.symbol}
              </Button>
            );
          }
        )}
      </div>
      <div className="text-muted-foreground flex items-center gap-2 ">
        Balance:{" "}
        <div className="text-sm flex items-center gap-2 text-white">
          <div className="text-xl "> ${balance}</div>
          <div className="text-green-400">tradable:{tradableAmt}</div>
          <div className="text-red-500">locked:{lockedAmt}</div>
        </div>
      </div>
      <div>
        {session?.user ? (
          <div>
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
          </div>
        ) : (
          <div>
            {" "}
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline" })}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
