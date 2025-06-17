import {
     Description,
     Dialog,
     DialogPanel,
     DialogTitle,
   } from "@headlessui/react";
   import clsx from "clsx";
   import { FC, ReactNode } from "react";
   import { AppButton } from "../button";
   
   export interface AppModalProps {
     isOpen: boolean;
     toggle: (state: boolean) => void;
     children: ReactNode;
     modalTitle?: string;
     subTitle?: string;
     width?: "sm" | "md" | "lg" | "xl";
     action: () => void; // This is typed as always a function
     btnTitle?: string;
     btnLoader?: boolean;
   }
   
   export const AppModal: FC<AppModalProps> = ({
     isOpen,
     toggle,
     children,
     modalTitle,
     subTitle,
     width = "sm",
     action, // 'action' is always a function due to its type definition
     btnTitle,
     btnLoader,
   }) => {
     const modalWidthClasses = {
       sm: "max-w-sm w-11/12 sm:w-5/6 md:w-2/3 lg:w-1/3 xl:w-1/6",
       md: "max-w-md w-11/12 sm:w-5/6 md:w-3/4 lg:w-1/2 xl:w-1/4",
       lg: "max-w-lg w-11/12 sm:w-5/6 md:w-4/5 lg:w-2/3 xl:w-1/2",
       xl: "max-w-xl w-11/12 sm:w-5/6 md:w-full lg:w-3/4 xl:w-2/3",
     };
   
     return (
       <Dialog open={isOpen} onClose={toggle} className="relative z-50">
         <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gray-950 bg-opacity-50">
           <DialogPanel
             className={clsx(
               "space-y-4 border bg-white p-6 rounded-lg shadow-xl",
               "flex flex-col",
               "max-h-[calc(100vh-2rem)] overflow-hidden",
               modalWidthClasses[width],
             )}
           >
             {/* Title and Subtitle Section */}
             {(modalTitle || subTitle) && (
               <div className="pb-4 border-b border-gray-200">
                 {modalTitle && (
                   <DialogTitle className="font-bold text-xl text-gray-900">
                     {modalTitle}
                   </DialogTitle>
                 )}
                 {subTitle && (
                   <Description className="text-slate-400 text-sm mt-1">
                     {subTitle}
                   </Description>
                 )}
               </div>
             )}
   
             {/* Children Content Area - this is where scrolling happens */}
             <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
               {children}
             </div>
   
             {/* Action Buttons */}
             {/* Removed the 'action || btnTitle' check in the div */}
             <div className="flex gap-4 justify-end pt-4 border-t border-gray-200 mt-auto">
               <AppButton
                 type="button"
                 black
                 onClick={() => toggle(false)}
               >
                 Close
               </AppButton>
               {/* The check for btnTitle is still valid, as btnTitle is optional */}
               {btnTitle && (
                 <AppButton
                   type="submit"
                   loading={btnLoader}
                   onClick={action} // No need to check 'action' here, it's always a function
                 >
                   {btnTitle}
                 </AppButton>
               )}
             </div>
           </DialogPanel>
         </div>
       </Dialog>
     );
   };