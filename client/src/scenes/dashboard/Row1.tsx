import DashboardBox from '@/components/DashboardBox'
import { useGetKpisQuery } from '@/state/api';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
type Props = {}

const Row1 = (props: Props) => {
    const { data }= useGetKpisQuery();
    console.log("data:",data);
  return (
    <>
        <DashboardBox sx={{ gridArea: "a", }}> 
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                <CartesianGrid />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="x"
                    stroke="#8884d8"
                    fill="#8884d8"
                />
                </AreaChart>
            </ResponsiveContainer></DashboardBox> 
        <DashboardBox sx={{ gridArea: "b", }} />
        <DashboardBox sx={{ gridArea: "c", }} />
    </>
  )
}

export default Row1