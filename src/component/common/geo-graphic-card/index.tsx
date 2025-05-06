import clsx from "clsx";
import { FC } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

export interface GeoGraphicCardProps {
     clickAction: () => void;
     name: string;
     id: string;
     selectedCard: boolean;
}

export const GeoGraphicCard: FC<GeoGraphicCardProps> = ({
     clickAction,
     id,
     selectedCard,
     name,
}) => {
     return (
          <div
               onClick={clickAction}
               key={id}
               className={clsx(
                    "flex items-center justify-between shadow-lg rounded-lg px-4 py-2 border d w-[200px]",
                    selectedCard && "border-primary-500 text-primary-500"
               )}
          >
               <p className="capitalize">{name}</p>
               <div className="flex items-center gap-2">
                    <button>
                         <AiOutlineEdit className="size-5" />
                    </button>
                    <button>
                         <AiOutlineDelete className="size-5" />
                    </button>
               </div>
          </div>
     );
};
