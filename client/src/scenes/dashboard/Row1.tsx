import DashboardBox from '@/components/DashboardBox'
import { useGetKpisQuery } from '@/state/api';

type Props = {}

const Row1 = (props: Props) => {
    const { data }= useGetKpisQuery();
  return (
    <>
        <DashboardBox sx={{ gridArea: "a", }} />
        <DashboardBox sx={{ gridArea: "b", }} />
        <DashboardBox sx={{ gridArea: "c", }} />
    </>
  )
}

export default Row1