import { FC } from "react";

export interface PageTitleProps {
     title: string;
     subTitle?: string;
}

export const PageTitle: FC<PageTitleProps> = ({ title, subTitle }) => {
     return (
          <div>
               <h3 className="text-xl capitalize">{title}</h3>
               {subTitle && <p className="text-gray-500">{subTitle}</p>}
          </div>
     );
};
