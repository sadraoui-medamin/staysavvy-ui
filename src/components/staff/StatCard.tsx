// Compact KPI card with sparkline + delta used across the staff console.
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  value: string | number;
  delta?: number;                  // percentage change, positive/negative
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger" | "accent";
  series?: { v: number }[];
  hint?: string;
};

const toneStyles: Record<NonNullable<Props["tone"]>, string> = {
  default: "text-foreground",
  success: "text-emerald-600",
  warning: "text-amber-600",
  danger:  "text-destructive",
  accent:  "text-accent",
};

const strokeByTone: Record<NonNullable<Props["tone"]>, string> = {
  default: "hsl(var(--muted-foreground))",
  success: "hsl(142 71% 45%)",
  warning: "hsl(38 92% 50%)",
  danger:  "hsl(0 84% 60%)",
  accent:  "hsl(var(--accent))",
};

export default function StatCard({
  label, value, delta, icon: Icon, tone = "default", series, hint,
}: Props) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="bg-card border border-border rounded-xl p-3 sm:p-4 shadow-soft flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] sm:text-xs text-muted-foreground font-medium truncate">{label}</span>
        {Icon && <Icon size={15} className={toneStyles[tone]} />}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="text-lg sm:text-2xl font-display font-bold leading-none">{value}</div>
        {series && series.length > 1 && (
          <div className="h-8 w-16 sm:w-20 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 2, bottom: 0, left: 0, right: 0 }}>
                <defs>
                  <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"  stopColor={strokeByTone[tone]} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={strokeByTone[tone]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke={strokeByTone[tone]} strokeWidth={1.5} fill={`url(#spark-${label})`} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      {(delta !== undefined || hint) && (
        <div className="flex items-center gap-1 text-[11px]">
          {delta !== undefined && (
            <span className={`inline-flex items-center gap-0.5 font-medium ${positive ? "text-emerald-600" : "text-destructive"}`}>
              {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {positive ? "+" : ""}{delta.toFixed(1)}%
            </span>
          )}
          {hint && <span className="text-muted-foreground truncate">{hint}</span>}
        </div>
      )}
    </div>
  );
}
