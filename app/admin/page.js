"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import StatCard from "../../components/StatCard";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return <p className="text-char-400">Loading dashboard…</p>;
  }

  const today = new Date()
    .toLocaleDateString("en-IN", { weekday: "short" })
    .replace(".", "")
    .trim();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-char-50">
        Overview
      </h1>
      <p className="mt-1 text-sm text-char-400">
        Everything that matters, at a glance.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={`₹${stats.totalRevenue}`}
          sub={`${stats.orderCount} orders all-time`}
        />
        <StatCard
          label="Active orders"
          value={stats.activeOrders}
          sub="In the kitchen or floor right now"
          accent="chili"
        />
        <StatCard label="Avg. order value" value={`₹${stats.avgOrderValue}`} />
        <StatCard
          label="Table occupancy"
          value={`${stats.occupancy?.occupied || 0}/${stats.occupancy?.total || 0}`}
          sub="Occupied or reserved"
          accent="sage"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-ticket border border-char-800 bg-char-900 p-5">
          <h2 className="font-display text-lg font-semibold text-char-50">
            Revenue, last 7 days
          </h2>

          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.revenueByDay}
                onMouseMove={(state) => {
                  if (state && state.isTooltipActive) {
                    setHoverIndex(state.activeTooltipIndex);
                  } else {
                    setHoverIndex(null);
                  }
                }}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#302922" />
                <XAxis dataKey="day" stroke="#8a7c6b" fontSize={12} />
                <YAxis stroke="#8a7c6b" fontSize={12} />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    background: "#1c1815",
                    border: "1px solid #302922",
                  }}
                  labelStyle={{ color: "#ffffff" }}
                  itemStyle={{ color: "#ffffff" }}
                  formatter={(value) => [`₹${value}`, "Revenue"]}
                />
                <Bar
                  dataKey="revenue"
                  radius={[3, 3, 0, 0]}
                  isAnimationActive={false}
                  fillOpacity={1}
                  minPointSize={4}
                >
                  {stats.revenueByDay.map((entry, index) => {
                    const barDay = entry.day.replace(".", "").trim();
                    const isToday = barDay === today;
                    const isHovered = index === hoverIndex;

                    return (
                      <Cell
                        key={index}
                        fill={
                          isToday
                            ? "#e0a72e"
                            : isHovered
                            ? "#ffffff"
                            : "transparent"
                        }
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-ticket border border-char-800 bg-char-900 p-5">
          <h2 className="font-display text-lg font-semibold text-char-50">
            Top sellers
          </h2>

          <ul className="mt-4 space-y-3">
            {stats.topItems.length === 0 && (
              <p className="text-sm text-char-400">No orders yet.</p>
            )}

            {stats.topItems.map((item, index) => (
              <li
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-char-100">
                  <span className="mr-2 font-mono text-char-400">
                    {index + 1}.
                  </span>
                  {item.name}
                </span>
                <span className="font-mono text-saffron-400">
                  {item.qty} sold
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {stats.lowStock?.length > 0 && (
        <div className="mt-6 rounded-ticket border border-chili-500/40 bg-chili-500/10 p-5">
          <h2 className="font-display text-lg font-semibold text-chili-400">
            Low stock alerts
          </h2>

          <ul className="mt-3 space-y-1 text-sm text-char-100">
            {stats.lowStock.map((item) => (
              <li key={item.id}>
                {item.name} — {item.quantity}
                {item.unit} left
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}