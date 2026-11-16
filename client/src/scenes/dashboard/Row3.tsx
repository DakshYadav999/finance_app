
import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import FlexBetween from "@/components/FlexBetween";
import {
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
} from "@/state/api";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridCellParams } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

const Row3 = () => {
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[500]];

  const { data: kpiData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery();
  const { data: transactionData } = useGetTransactionsQuery();

  const pieChartData = useMemo(() => {
    if (kpiData?.[0]) {
      const totalExpenses = kpiData[0].totalExpenses;

      return Object.entries(kpiData[0].expensesByCategory).map(
        ([key, value]) => [
          {
            name: key,
            value: value,
          },
          {
            name: `${key} of Total`,
            value: totalExpenses - value,
          },
        ]
      );
    }

    return [];
  }, [kpiData]);

  const productColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "expense",
      headerName: "Expense",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
  ];

  const transactionColumns = [
    {
      field: "_id",
      headerName: "id",
      flex: 1,
    },
    {
      field: "buyer",
      headerName: "Buyer",
      flex: 0.67,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.35,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    {
      field: "productIds",
      headerName: "Count",
      flex: 0.1,
      renderCell: (params: GridCellParams) =>
        (params.value as Array<string>).length,
    },
  ];

  const cardStyles = {
    minHeight: 0,
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    overflow: "hidden",
  };

  const gridContainerStyles = {
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  width: "100%",
  display: "flex",
  flexDirection: "column" as const,

  "& .MuiDataGrid-root": {
    color: palette.grey[300],
    border: "none",
    backgroundColor: palette.background.default,
    "--DataGrid-containerBackground": palette.background.default,
  },

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: palette.background.default,
    borderBottom: `1px solid ${palette.grey[800]} !important`,
  },

  "& .MuiDataGrid-virtualScroller": {
    backgroundColor: palette.background.default,
  },
  "& .MuiDataGrid-row.Mui-hovered": {
    backgroundColor: `${palette.background.default} !important`,
  },
  "& .MuiDataGrid-row": {
    backgroundColor: palette.background.default,
  },

 "& .MuiDataGrid-row:hover": {
   backgroundColor: `${palette.background.default} !important`
},

  "& .MuiDataGrid-cell": {
    borderBottom: `1px solid ${palette.grey[800]} !important`,
  },

  "& .MuiDataGrid-columnSeparator": {
    visibility: "hidden",
  },
};
  return (
    <>
      {/* Products */}
      <DashboardBox sx={{ ...cardStyles, gridArea: "g" }}>
        <BoxHeader
          title="List of Products"
          sideText={`${productData?.length ?? 0} products`}
        />

        <Box sx={{ mt: "0.5rem", px: "0.5rem", ...gridContainerStyles }}>
          <DataGrid
            getRowId={(row) => row._id}
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={productData || []}
            columns={productColumns}
            sx={{
  "--DataGrid-containerBackground": palette.background.default,
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: palette.background.default,
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: palette.background.default,
  },
  "& .MuiDataGrid-container--top [role='row']": {
    backgroundColor: palette.background.default,
  },
  "& .MuiDataGrid-filler": {
    backgroundColor: palette.background.default,
  },
}}
          />
        </Box>
      </DashboardBox>

      {/* Recent Orders */}
      <DashboardBox sx={{ ...cardStyles, gridArea: "h" }}>
        <BoxHeader
          title="Recent Orders"
          sideText={`${transactionData?.length ?? 0} latest transactions`}
        />

        <Box sx={{ mt: "1rem", px: "0.5rem", ...gridContainerStyles }}>
          <DataGrid
            getRowId={(row) => row._id}
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={transactionData || []}
            columns={transactionColumns}
            sx={{
  "--DataGrid-containerBackground": palette.background.default,
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: palette.background.default,
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: palette.background.default,
  },
  "& .MuiDataGrid-container--top [role='row']": {
    backgroundColor: palette.background.default,
  },
  "& .MuiDataGrid-filler": {
    backgroundColor: palette.background.default,
  },
}}
          />
        </Box>
      </DashboardBox>

      {/* Expense Breakdown */}
      



<DashboardBox sx={{ gridArea: "i" }}>
  <BoxHeader
    title="Expense Breakdown By Category"
    sideText="+4%"
  />

  <FlexBetween mt="0.25rem" gap="0.5rem" p="0 1rem" textAlign="center">
    {pieChartData.slice(0, 3).map((data, i) => (
      <Box
        key={`${data[0].name}-${i}`}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <PieChart width={90} height={75}>
          <Pie
            stroke="none"
            data={data}
            innerRadius={15}
            outerRadius={30}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index]} />
            ))}
          </Pie>
        </PieChart>

        <Typography variant="h5" sx={{ mt: 0, lineHeight: 1.2 }}>
          {data[0].name}
        </Typography>
      </Box>
    ))}
  </FlexBetween>
</DashboardBox>



      {/* Overall Summary */}
      <DashboardBox sx={{ gridArea: "j" }}>
        <BoxHeader
          title="Overall Summary and Explanation Data"
          sideText="+15%"
        />

        <Box
          sx={{
            height: "15px",
            m: "1.25rem 1rem 0.4rem 1rem",
            bgcolor: palette.primary[800],
            borderRadius: "1rem",
          }}
        >
          <Box
            sx={{
              height: "15px",
              bgcolor: palette.primary[600],
              borderRadius: "1rem",
              width: "40%",
            }}
          />
        </Box>

        <Typography sx={{ mx: "1rem" }} variant="h6">
          Orci aliquam enim vel diam. Venenatis euismod id donec mus lorem etiam
          ullamcorper odio sed. Ipsum non sed gravida etiam urna egestas
          molestie volutpat et. Malesuada quis pretium aliquet lacinia ornare
          sed. In volutpat nullam at est id cum pulvinar nunc.
        </Typography>
      </DashboardBox>
    </>
  );
};

export default Row3;
