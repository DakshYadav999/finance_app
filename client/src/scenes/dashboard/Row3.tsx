import BoxHeader from "@/components/BoxHeader";
import DashboardBox from "@/components/DashboardBox";
import { useGetTransactionsQuery } from "@/state/api";
import { Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';


const Row3 = () => {
  const  {data:kpiData} =useGetKpisQuery();
  const  {data:productData} =useGetProductsQuery();
  const  {data:transactionData} =useGetTransactionsQuery();
  console.log("transactionsData:", transactionData);
  return (
    <>
        <DashboardBox sx={{ gridArea: "g", }} >
          <BoxHeader title="List of Products" sideText={`${productData?.length}products`}></BoxHeader>
          <Box
            mt="0.5rem"
            p="0 0.5rem"
            height="75%"
            sx={{
              
            }}
          >
            <DataGrid/>
          </Box>
        </DashboardBox>
        <DashboardBox sx={{ gridArea: "h", }} ></DashboardBox>
        <DashboardBox sx={{ gridArea: "i", }} ></DashboardBox>
        <DashboardBox sx={{ gridArea: "j", }} ></DashboardBox>
    </>
  )
}

export default Row3