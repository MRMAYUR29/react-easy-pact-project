import moment from "moment";
import React, { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { AppButton } from "../../UI";

export interface DemoCardProps {
     name: string;
     category: string;
     image: string;
     productId: string;
     uploadedAt: Date;
}

export const DemoCard: React.FC<DemoCardProps> = ({
     category,
     image,
     name,
     productId,
     uploadedAt,
}) => {
     const [imgSrc, setImgSrc] = useState(image);
     const navigate = useNavigate();
     return (
          <div className="group relative hover:border-gray-200 flex w-full flex-col transition-colors duration-300 overflow-hidden rounded-lg border-2 border-gray-100 bg-white shadow-md">
               <Link
                    className="relative mx-4 h-60 object-cover flex items-center justify-center overflow-hidden rounded-xl"
                    to={`/demo-details/${productId}`}
               >
                    <img
                         className="object-contain"
                         src={imgSrc}
                         alt={name}
                         onError={() =>
                              setImgSrc(
                                   "https://placehold.co/600x400/EEE/31343C"
                              )
                         }
                    />
               </Link>
               <div className="mt-4 px-5 pb-5">
                    <a href="#">
                         <h5 className="text-md truncate tracking-tight group-hover:text-slate-950 text-slate-500">
                              {category}
                         </h5>
                    </a>
                    <div className="flex items-center justify-between">
                         <p>
                              <span className="text-xl text-slate-900 group-hover:text-primary-500 truncate capitalize">
                                   {name}
                              </span>
                         </p>
                    </div>
                    <p className="my-2 text-sm text-gray-500">
                         {moment(uploadedAt).fromNow()}
                    </p>
                    <div className="flex items-center justify-end">
                         <AppButton
                              onClick={() => {
                                   navigate(`/demo-details/${productId}`);
                              }}
                         >
                              Watch Demo
                              <FaChevronRight className="size-3" />
                         </AppButton>
                    </div>
               </div>
          </div>
     );
};
