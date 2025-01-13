import { Card } from "@/components/ui/card";

interface StepCardProps {
  stepNumber: number;
  header: JSX.Element;
  description: JSX.Element;
  isRtl?: boolean;
}

export default function StepCard({ stepNumber = 1, header, description, isRtl = false }: StepCardProps) {
  return (
    <Card
      className={`${
        isRtl ? "md:flex-row-reverse" : "md:flex-row"
      } flex flex-col  border-2 min-h-32 border-black max-w-screen-xl rounded-lg overflow-visible relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[4px] hover:-translate-y-[4px]`}
    >
      <div
        className={`absolute z-10 -top-3 ${
          isRtl ? "-right-3" : "-left-3"
        }  bg-white border-2 border-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
      >
        {stepNumber}
      </div>
      {header}
      <div className="flex-1 p-4">{description}</div>
    </Card>
  );
}
