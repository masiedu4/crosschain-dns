import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { IconType } from "react-icons";
import { convertUnixToDate } from "@/lib/utils";

interface HistoryProps {
  title: string;
  Icon: IconType;
  data: any[]; // Replace 'any' with a more specific type if possible
  columns: string[];
}

const HistorySection: React.FC<HistoryProps> = ({
  title,
  Icon,
  data,
  columns,
}) => (
  <div className="gap-2 flex flex-col items-start self-stretch">
    <div className="flex items-center gap-2">
      <Icon className="text-yellow-400" />
      <p className="text-base text-white font-semibold">{title}</p>
    </div>
    <div className="w-full flex flex-col p-4 gap-2 rounded-[8px] border border-custom-border bg-primary-bg/10">
      {data.length > 0 ? (
        <div className="h-[200px] overflow-y-auto custom-scrollbar">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column: string, index: number) => (
                  <TableHead
                    key={index}
                    className="bg-secondary-bg sticky top-0 text-white"
                  >
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="text-sm text-white">
                    {convertUnixToDate(item.timestamp)}
                  </TableCell>
                  <TableCell className="text-sm text-white">
                    {item.total_points}
                  </TableCell>
                  <TableCell className="text-sm text-white">
                    {item.mode || "Normal"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[200px] text-center">
          <Icon className="text-4xl text-gray-500 mb-2" />
          <p className="text-base text-gray-400">
            No {title.toLowerCase()} available.
          </p>
        </div>
      )}
    </div>
  </div>
);

export default HistorySection;
