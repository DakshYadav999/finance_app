import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useGetKpisQuery } from "@/state/api";
import {
  Box,
  LinearProgress,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "finsight-monthly-expense-budget";

const loadSavedBudget = (): string => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};

const formatMoney = (value: number) =>
  `$${Math.round(value).toLocaleString()}`;

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);

const BudgetTracker = () => {
  const { palette } = useTheme();
  const { data: kpiData } = useGetKpisQuery();

  const [budgetInput, setBudgetInput] = useState<string>(loadSavedBudget);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Save the budget whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, budgetInput);
    } catch {
      // storage unavailable (private mode etc.) - ignore
    }
  }, [budgetInput]);

  const months = useMemo(() => kpiData?.[0]?.monthlyData ?? [], [kpiData]);

  // Use the chosen month, or fall back to the latest month in the data
  const activeMonth =
    months.find((m) => m.month === selectedMonth) ?? months[months.length - 1];

  const budget = Number(budgetInput);
  const validBudget = Number.isFinite(budget) && budget > 0 ? budget : 0;

  const actual = activeMonth?.expenses ?? 0;
  const remaining = validBudget - actual;
  const percentUsed = validBudget > 0 ? (actual / validBudget) * 100 : 0;
  const isExceeded = validBudget > 0 && actual > validBudget;
  const isNearLimit = validBudget > 0 && !isExceeded && percentUsed >= 80;

  const barColor = isExceeded
    ? palette.error.main
    : isNearLimit
    ? palette.warning.main
    : palette.primary[500];

    const fieldSx = {
  "& .MuiInputLabel-root": { color: palette.grey[200] },
  "& .MuiInputLabel-root.Mui-focused": { color: palette.primary[500] },
  "& .MuiOutlinedInput-root": {
    color: palette.grey[100],
    backgroundColor: palette.background.default,
    "& fieldset": { borderColor: palette.grey[500] },
    "&:hover fieldset": { borderColor: palette.primary[500] },
    "&.Mui-focused fieldset": { borderColor: palette.primary[500] },
  },
  "& .MuiSvgIcon-root": { color: palette.grey[200] },
};

  return (
<DashboardBox sx={{ mb: "1.5rem", pb: "1.5rem" }}>
      <BoxHeader
        title="Monthly Expense Budget"
        sideText={activeMonth ? capitalize(activeMonth.month) : ""}
      />

      <Box sx={{ px: "1rem", mt: "1rem" }}>
        {/* Inputs */}
        <Box sx={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <TextField
            select
            size="small"
            label="Month"
            value={activeMonth?.month ?? ""}
            onChange={(e) => setSelectedMonth(e.target.value)}
            disabled={months.length === 0}
            sx={{ ...fieldSx, minWidth: 150 }}
          >
            {months.map((m) => (
              <MenuItem key={m.month} value={m.month}>
                {capitalize(m.month)}
              </MenuItem>
            ))}
          </TextField>

            <TextField
              size="small"
              label="Monthly budget ($)"
              value={budgetInput}
              onChange={(e) =>
                setBudgetInput(e.target.value.replace(/[^0-9.]/g, ""))
              }
              slotProps={{ htmlInput: { inputMode: "decimal" } }}
              sx={{ ...fieldSx, minWidth: 180 }}
            />
        </Box>

        {/* Numbers */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem",
            mt: "1.5rem",
          }}
        >
          <Box>
            <Typography variant="h6">Budget</Typography>
            <Typography variant="h3">
              {validBudget > 0 ? formatMoney(validBudget) : "—"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">Actual expenses</Typography>
            <Typography variant="h3">
              {activeMonth ? formatMoney(actual) : "—"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">
              {isExceeded ? "Over budget by" : "Remaining"}
            </Typography>
            <Typography variant="h3">
              {validBudget > 0 ? formatMoney(Math.abs(remaining)) : "—"}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">Budget used</Typography>
            <Typography variant="h3">
              {validBudget > 0 ? `${percentUsed.toFixed(1)}%` : "—"}
            </Typography>
          </Box>
        </Box>

        {/* Progress bar */}
        <LinearProgress
          variant="determinate"
          value={Math.min(percentUsed, 100)}
          sx={{
            height: "15px",
            borderRadius: "1rem",
            mt: "1.5rem",
            bgcolor: palette.primary[800],
            "& .MuiLinearProgress-bar": {
              borderRadius: "1rem",
              bgcolor: barColor,
            },
          }}
        />

        {/* Status message */}
        <Typography
          variant="h6"
          sx={{
            mt: "0.75rem",
            color: isExceeded
              ? palette.error.main
              : isNearLimit
              ? palette.warning.main
              : palette.grey[300],
            fontWeight: isExceeded ? 700 : 400,
          }}
        >
          {validBudget === 0
            ? "Enter a monthly budget above to start tracking."
            : isExceeded
            ? `Budget exceeded by ${formatMoney(Math.abs(remaining))}.`
            : isNearLimit
            ? `Heads up: you've used ${percentUsed.toFixed(0)}% of this month's budget.`
            : "Spending is within budget."}
        </Typography>
      </Box>
    </DashboardBox>
  );
};

export default BudgetTracker;