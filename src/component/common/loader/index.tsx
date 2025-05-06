import { FC } from "react";
import { AiOutlineLoading } from "react-icons/ai";

export const AppLoader: FC = () => {
     return (
          <div className="flex items-center justify-center h-[300px]">
               <AiOutlineLoading className="animate-spin size-20" />
          </div>
     );
};
