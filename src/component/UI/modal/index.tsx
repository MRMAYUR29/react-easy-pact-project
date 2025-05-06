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
     width?: "sm" | "md" | "lg";
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
     width = "sm",
     action,
     btnTitle,
     btnLoader,
}) => {
     return (
          <Dialog open={isOpen} onClose={toggle} className="relative z-50">
               <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-gray-950 bg-opacity-50    ">
                    <DialogPanel
                         className={clsx(
                              "space-y-4 border bg-white p-4 rounded-lg",
                              width === "sm" && "xl:w-1/6 w-1/8",
                              width === "md" && "xl:w-1/4 w-1/8",
                              width === "lg" && "xl:w-1/2 w-1/8"
                         )}
                    >
                         <div>
                              {modalTitle && (
                                   <DialogTitle className="font-bold text-xl">
                                        {modalTitle}
                                   </DialogTitle>
                              )}
                              {subTitle && (
                                   <Description className="text-slate-400">
                                        {subTitle}
                                   </Description>
                              )}
                         </div>
                         <div>{children}</div>
                         <div className="flex gap-4 justify-end">
                              <AppButton
                                   type="button"
                                   black
                                   onClick={() => toggle(false)}
                              >
                                   Close
                              </AppButton>
                              {btnTitle && (
                                   <AppButton
                                        type="submit"
                                        loading={btnLoader}
                                        onClick={action}
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
