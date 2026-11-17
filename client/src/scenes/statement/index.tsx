import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import {
  useClearStatementMutation,
  useGetForecastQuery,
  useGetStatementQuery,
  useUploadStatementMutation,
} from "@/state/api";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const errorMessage = (err: unknown, fallback: string) =>
  (err as { data?: { message?: string } })?.data?.message ?? fallback;

const Statement = () => {
  const { palette } = useTheme();
  const { data: txns } = useGetStatementQuery();
  const { data: forecast } = useGetForecastQuery();
  const [uploadStatement, { isLoading }] = useUploadStatementMutation();
  const [clearStatement] = useClearStatementMutation();
  const [message, setMessage] = useState("");

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const result = await uploadStatement(formData).unwrap();
            setMessage(
        result.inserted === 0
          ? "No new transactions: this statement was already imported."
          : `Imported ${result.inserted} new transactions` +
              (result.skipped ? ` (${result.skipped} duplicates skipped).` : ".")
      );
    }  catch (err) {
      setMessage(errorMessage(err, "Upload failed. Check the CSV format."));
    }
    e.target.value = "";
  };

  const chartData = useMemo(
    () => [...(forecast?.history ?? []), ...(forecast?.forecast ?? [])],
    [forecast]
  );

  const columns = [
    {
      field: "date",
      headerName: "Date",
      flex: 0.6,
      renderCell: (params: GridRenderCellParams) => new Date(params.value).toLocaleDateString(),
    },
    { field: "description", headerName: "Description", flex: 1.5 },
    { field: "category", headerName: "Category", flex: 0.6 },
    { field: "type", headerName: "Type", flex: 0.4 },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.5,
      renderCell: (params: GridRenderCellParams) => `₹${params.value}`,
    },
  ];

  const hasData = (txns?.length ?? 0) > 0;
  // NEW: demo mode is switched on by VITE_DEMO_MODE=true (set on Vercel only)
  const isDemo = import.meta.env.VITE_DEMO_MODE === "true";

    const summary = useMemo(() => {
    const list = txns ?? [];
    const debits = list.filter((t) => t.type === "debit");
    const spent = debits.reduce((s, t) => s + t.amount, 0);
    const income = list
      .filter((t) => t.type === "credit")
      .reduce((s, t) => s + t.amount, 0);

    const byCategory: Record<string, number> = {};
    debits.forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] ?? 0) + t.amount;
    });
    const categories = Object.entries(byCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { spent, income, saved: income - spent, categories };
  }, [txns]);

  const money = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

 const categoryColorMap: Record<string, string> = {
    Bills: "#12efc8",
    Food: "#fbbf24",
    Shopping: "#a78bfa",
    Subscriptions: "#f472b6",
    Travel: "#38bdf8",
    Income: "#4ade80",
    Other: "#94a3b8",
  };

  return (
    <Box sx={{ display: "grid", gap: "1.5rem", p: "1rem" }}>
      <DashboardBox sx={{ p: "1rem" }}>
        <Typography variant="h3" sx={{ mb: "0.5rem" }}>
          Import your bank statement
        </Typography>
        <Typography variant="h6" sx={{ mb: "1rem" }}>
          Upload a CSV export from your bank. No CSV handy? Download the sample
          and upload it to see how it works.
        </Typography>

        {/* NEW: public demo notice */}
        {isDemo && (
          <Box
            sx={{
              mb: "1rem",
              p: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #fbbf24",
            }}
          >
            <Typography variant="h6" sx={{ color: "#fbbf24" }}>
              Public demo: importing and deleting are disabled so the shared
              sample data stays intact. Please don't enter real financial
              information anywhere in this app. To try your own CSV, run the
              project locally from the GitHub repo.
            </Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {/* CHANGED: also disabled in demo mode */}
          <Button variant="contained" component="label" disabled={isLoading || isDemo}>
            {isLoading ? "Uploading..." : "Choose CSV file"}
            <input hidden type="file" accept=".csv" onChange={onFileChange} />
          </Button>
          <Button
            variant="outlined"
            component="a"
            href="/sample-statement.csv"
            download
          >
            Download sample CSV
          </Button>
          {hasData && (
            <Button
              variant="text"
              color="error"
              disabled={isDemo}
              onClick={async () => {
                // CHANGED: shows an error message instead of a false "cleared" message
                try {
                  await clearStatement().unwrap();
                  setMessage("Imported data cleared.");
                } catch (err) {
                setMessage(errorMessage(err, "Could not clear data."));
              }
              }}
            >
              Clear data
            </Button>
          )}
        </Box>

        {message && (
          <Typography variant="h6" sx={{ mt: "1rem", color: palette.primary[500] }}>
            {message}
          </Typography>
        )}
      </DashboardBox>

      {hasData && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1.5rem",
          }}
        >
        {[
            ["Total spent", money(summary.spent), "#fbbf24"],
            ["Total income", money(summary.income), palette.primary[500]],
            ["Net savings", money(summary.saved), "#38bdf8"],
          ].map(([label, value, color]) => (
            <DashboardBox key={label} sx={{ p: "1rem" }}>
              <Typography variant="h6">{label}</Typography>
              <Typography variant="h3" sx={{ color, mt: "0.25rem" }}>
                {value}
              </Typography>
            </DashboardBox>
          ))}
        </Box>
      )}

      {hasData && (
        <DashboardBox sx={{ height: "320px" }}>
          <BoxHeader title="Spending by category" sideText="" />
            <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={summary.categories}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={90}
                paddingAngle={3}
                stroke="none"
              >
                {summary.categories.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={categoryColorMap[entry.name] ?? "#94a3b8"}
                  />
                ))}
              </Pie>
              <text
                x="50%"
                y="46%"
                textAnchor="middle"
                fill={palette.grey[300]}
                fontSize={12}
              >
                Total spent
              </text>
              <text
                x="50%"
                y="54%"
                textAnchor="middle"
                fill={palette.grey[100]}
                fontSize={20}
                fontWeight={700}
              >
                {money(summary.spent)}
              </text>
              <Tooltip
                formatter={(v) => money(Number(v))}
                contentStyle={{
                  backgroundColor: palette.grey[900],
                  border: "none",
                  borderRadius: 8,
                }}
                itemStyle={{ color: palette.grey[100] }}
              />
              <Legend
                formatter={(value: string) => (
                  <span style={{ color: palette.grey[200] }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </DashboardBox>
      )}
      <DashboardBox sx={{ height: "320px" }}>
        <BoxHeader title="Monthly spending and 3-month forecast" sideText="" />
        {chartData.length === 0 ? (
          <Typography variant="h6" sx={{ p: "1rem" }}>
            Upload a statement to see your spending trend.
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} stroke={palette.grey[800]} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="actual" stroke={palette.primary.main} />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#fbbf24"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </DashboardBox>

      <DashboardBox sx={{ height: "400px", p: "0.5rem" }}>
        <DataGrid
          rows={txns || []}
          columns={columns}
          getRowId={(row) => row._id}
          rowHeight={35}
          hideFooter={true}
        />
      </DashboardBox>
    </Box>
  );
};

export default Statement;