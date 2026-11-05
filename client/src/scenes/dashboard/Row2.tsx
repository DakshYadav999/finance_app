import DashboardBox from "@/components/DashboardBox";

type Props = {}

const Row2 = (props: Props) => {
  return (
    <>
        <DashboardBox sx={{ gridArea: "d", }} />
        <DashboardBox sx={{ gridArea: "e", }} />
        <DashboardBox sx={{ gridArea: "f", }} />
    </>
  )
}

export default Row2