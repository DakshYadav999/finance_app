import DashboardBox from "@/components/DashboardBox";

type Props = {}

const Row3 = (props: Props) => {
  return (
    <>
        <DashboardBox sx={{ gridArea: "g", }} />
        <DashboardBox sx={{ gridArea: "h", }} />
        <DashboardBox sx={{ gridArea: "i", }} />
        <DashboardBox sx={{ gridArea: "j", }} />
    </>
  )
}

export default Row3