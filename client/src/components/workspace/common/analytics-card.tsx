import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowBigUp, ArrowBigDown, Loader } from "lucide-react";

const AnalyticsCard = (props: {
  title: string;
  value: number;
  isLoading: boolean;
}) => {
  const { title, value, isLoading } = props;

  const getArrowIcon = () => {
    if (title === "Overdue Task") {
      return value > 0 ? (
        <ArrowBigDown strokeWidth={2.5} className="h-4 w-4 text-red-500" />
      ) : (
        <ArrowBigUp strokeWidth={2.5} className="h-4 w-4 text-green-500" />
      );
    }
    if (title === "Completed Task" || title === "Total Task") {
      return value > 0 ? (
        <ArrowBigUp strokeWidth={2.5} className="h-4 w-4 text-green-500" />
      ) : (
        <ArrowBigDown strokeWidth={2.5} className="h-4 w-4 text-red-500" />
      );
    }
    return null;
  };
  return (
    <Card className="shadow-none w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6">
        <div className="flex items-center gap-1 min-w-0">
          <CardTitle className="text-xs sm:text-sm font-medium truncate">{title}</CardTitle>
          <div className="mb-[0.2px] shrink-0">{getArrowIcon()}</div>
        </div>
        <Activity
          strokeWidth={2.5}
          className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0"
        />
      </CardHeader>
      <CardContent className="w-full p-3 sm:p-6 pt-0">
        <div className="text-2xl sm:text-3xl font-bold">
          {isLoading ? <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : value}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsCard;
