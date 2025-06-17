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
     width?: "sm" | "md" | "lg" | "xl"; // Made optional with '?'
     action: () => void;
     btnTitle?: string;
     btnLoader?: boolean;
   }
   
   export const AppModal: FC<AppModalProps> = ({
     isOpen,
     toggle,
     children,
     modalTitle,
     subTitle,
     width = "sm", // Default value for 'width'
     action,
     btnTitle,
     btnLoader,
   }) => {
     const modalWidthClasses = {
       // We'll use max-w- to cap the width, and w-full to make it take available space
       // on smaller screens.
       sm: "max-w-sm", // Max width of 24rem (384px)
       md: "max-w-md", // Max width of 28rem (448px)
       lg: "max-w-2xl", // A larger max-width, e.g., 42rem (672px)
       xl: "max-w-4xl", // Even larger, e.g., 56rem (896px) - adjust as needed
     };
   
     return (
       <Dialog open={isOpen} onClose={toggle} className="relative z-50">
         <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gray-950 bg-opacity-50">
           <DialogPanel
             className={clsx(
               "space-y-4 border bg-white p-6 rounded-lg shadow-xl",
               "flex flex-col",
               "w-full", // Important: Make it take full width on smaller screens, constrained by max-w
               "max-h-[calc(100vh-2rem)] overflow-hidden",
               modalWidthClasses[width], // Apply the specific max-w for the chosen width
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
             <div className="flex gap-4 justify-end pt-4 border-t border-gray-200 mt-auto">
               <AppButton type="button" black onClick={() => toggle(false)}>
                 Close
               </AppButton>
               {btnTitle && (
                 <AppButton type="submit" loading={btnLoader} onClick={action}>
                   {btnTitle}
                 </AppButton>
               )}
             </div>
           </DialogPanel>
         </div>
       </Dialog>
     );
   };