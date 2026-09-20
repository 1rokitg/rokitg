"use client";

import nextDynamic from "next/dynamic";

export const PeopleTerminalClient = nextDynamic(
  () => import("./PeopleTerminal").then((mod) => mod.PeopleTerminal),
  { ssr: false },
);
