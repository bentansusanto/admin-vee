"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

import data from "./data.json"
import { useAppSelector } from "@/redux/hooks";

export default function Page() {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <>
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome {user?.name || "Back"}
        </h1>
      </div>
      <SectionCards />
        <ChartAreaInteractive />
      <DataTable data={data} />
    </>
  )
}
