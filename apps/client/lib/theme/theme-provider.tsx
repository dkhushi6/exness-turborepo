"use client";

import {
  ThemeProvider as BaseThemeProvider,
  ThemeProviderProps,
} from "next-themes";
import React from "react";

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <BaseThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </BaseThemeProvider>
  );
};

export { ThemeProvider };
