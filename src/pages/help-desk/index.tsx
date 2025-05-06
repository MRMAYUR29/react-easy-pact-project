import { IconType } from "react-icons";
import { GoRocket } from "react-icons/go";
import { AppButton, AppModal } from "../../component";
import { useNavigate } from "react-router-dom";
import { useAppSlice } from "../../redux/slice";
import clsx from "clsx";
import { useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { TbUser } from "react-icons/tb";

interface OnboardingSection {
     Icon: IconType;
     title: string;
     description: string;
     content: {
          title: string;
          details: string[];
     }[];
}

export const HelpDeskPage = () => {
     const navigate = useNavigate();
     const { appUser } = useAppSlice();
     const [details, setDetails] = useState<OnboardingSection | null>(null);

     const userOnboardingGuide: OnboardingSection[] = [
          {
               Icon: GoRocket,
               title: "User Onboarding",
               description:
                    "This guide aims to assist users through the registration, login, and initial setup process on the EasyPact portal. Whether you’re an Admin setting up the system or an Employee accessing product demos, this onboarding ensures a smooth start.",
               content: [
                    {
                         title: "Introduction",
                         details: [
                              "What is EasyPact?",
                              `EasyPact is a web-based portal developed to help Schneider Electric sales teams present 3D product demos to clients in an intuitive and engaging manner.`,
                         ],
                    },
                    {
                         title: "User Roles in EasyPact:",
                         details: [
                              `There are three primary user roles within the system:`,
                              `Admin:`,
                              ` Manages the system, adds users, configures master data, and maintains operational control.`,
                              `Regional Admin: `,
                              `Oversees users and demo activities at a regional level.`,
                              `Employee (Sales Representative):`,
                              `Views and presents 3D product demos to clients.`,
                         ],
                    },
                    {
                         title: "Sign-Up Process",
                         details: [
                              `Note: Self-registration is not available. All users must be onboarded by an Admin.`,
                              `Admin Responsibilities:`,
                              `Navigate to the “Add User” section within the Admin dashboard.`,
                              `Fill in necessary user details (name, email, region, role).`,
                              `Assign login credentials (username and temporary password).`,
                              `Ensure role-based permissions are correctly configured.`,
                              `Eligible Users:`,
                              `Only authorized Schneider Electric employees, primarily from the sales department.`,
                              `Once registered, users will receive credentials to log in for the first time.`,
                         ],
                    },
                    {
                         title: "Login Process",
                         details: [
                              `All users (Admin, Regional Admin, Employee) access the platform via the same login page.`,
                              `Standard Login Steps: Visit the EasyPact portal login page.`,
                              `Enter your Username and Password.`,
                              `Click Login to access the system.`,
                              `Forgot Password:`,
                              `If a user forgets their password, they can click the “Forgot Password” link.`,
                              `Enter the registered email ID.`,
                              `Follow instructions to reset the password via email.`,
                         ],
                    },
                    {
                         title: "Getting Started",
                         details: [
                              `Once logged in, users will land on the Dashboard, which varies slightly by role.`,
                              `Dashboard Overview:`,
                              `The dashboard is designed to be simple and focused on demo performance.`,
                              `Key widgets include:`,
                              `Number of Demos Conducted, Number of Active Employees, Watch Hours (total time spent watching demos)`,
                              `Initial Setup (Admin Role Only):`,
                              `Before employees can begin using the platform effectively, the Admin must:`,
                              `Configure Master Data: Products, categories, regions, and demo content.`,
                              `Assign roles and link users to appropriate regional structures.`,
                              `Ensure that the 3D demo content is properly uploaded and accessible.`,
                              `This setup is crucial to ensure the demo experience works seamlessly during client interactions.`,
                         ],
                    },
                    {
                         title: "Accessing Support",
                         details: [
                              `In case users encounter issues or require assistance during onboarding or usage, they can reach out via the official support channel.`,
                              `Support Contact :`,
                              `📧 CHRP Support Email – Provided within the portal footer or help section.`,
                              `Response Time:`,
                              `Within 24 business hours`,
                              `Types of support available`,
                              `Login issues, content not loading, access errors, demo-related queries.`,
                         ],
                    },
               ],
          },
          {
               title: "Account Management (Admin Only)",
               description:
                    "nable Admins to manage and personalize their own account as well as handle user-level access within the application. This includes adding new users, updating user information, managing credentials, and handling account activation or deactivation.",
               content: [
                    {
                         title: "Editing Profile",
                         details: [
                              "Admins can update their own profile information to ensure accuracy and easy communication.",
                         ],
                    },
                    {
                         title: "✅ Steps to Edit Admin Profile:",
                         details: [
                              `Go to the Profile section from the Admin Dashboard.`,
                              `Click Edit Profile.`,
                              `Update fields such as:`,
                              `Full Name`,
                              `Contact Number`,
                              `Email (if editable)`,
                              `Click Save Changes to apply.`,
                              `⚠️ Note: Email changes may require re-verification, depending on platform settings.`,
                         ],
                    },
                    {
                         title: "Credentials Management",
                         details: [
                              `Admins have full control over their password and should update it regularly for security.`,
                              `🔐 Change Password:`,
                              `Navigate to Account Settings > Security.`,
                              `Click on Change Password.`,
                              `Enter the current password.`,
                              `Set a new strong password (at least 8 characters, including one symbol and one number).`,
                              `Confirm and save changes.`,
                         ],
                    },
                    {
                         title: "Account Deactivation / Deletion",
                         details: [
                              `Only users with Admin roles have the ability to deactivate or delete other users' accounts. This is helpful for user lifecycle management, employee transitions, or security issues.`,
                              `🚫 Deactivate User Account:`,
                              `Go to Admin Panel > Users.`,
                              `Search and select the user account.`,
                              `Click on Actions > Deactivate.`,
                              `Confirm action. The user will no longer be able to log in but their data will be retained.`,
                         ],
                    },
                    {
                         title: "❌ Delete User Account:",
                         details: [
                              `For permanent removal, select the user and click Actions > Delete.`,
                              `Confirm action. This will erase all user-associated data, except logs necessary for compliance.`,
                              `⚠️ Warning: Deleting an account is irreversible. Ensure necessary data backups or exports before proceeding.`,
                         ],
                    },
               ],
               Icon: TbUser,
          },
     ];

     return (
          <div className={clsx("pb-10", appUser ? "space-y-1" : "space-y-10")}>
               <div className="bg-primary-300 shadow-xl p-3 flex flex-col justify-end items-center">
                    <h6 className="text-2xl font-normal ">How do we help?</h6>

                    {!appUser && (
                         <div className="mt-5">
                              <AppButton onClick={() => navigate("/")}>
                                   Login Now
                              </AppButton>
                         </div>
                    )}
               </div>
               <div className="grid grid-cols-12 gap-10 p-10">
                    <div className="space-y-5 md:col-span-12 col-span-12">
                         <h1
                              className={clsx(
                                   "text-2xl capitalize pb-4 border-b",
                                   appUser ? "mb-2" : " mb-4 "
                              )}
                         >
                              Help Topic
                         </h1>
                         <div className="xl:grid-cols-2 grid gap-x-10 gap-y-5 grid-cols-1">
                              {userOnboardingGuide.map(
                                   (
                                        { Icon, description, title, ...props },
                                        i
                                   ) => (
                                        <div
                                             onClick={() => {
                                                  setDetails({
                                                       Icon,
                                                       title,
                                                       description,
                                                       ...props,
                                                  });
                                             }}
                                             key={i}
                                             className="flex items-center gap-5 group cursor-pointer border-b pb-5"
                                        >
                                             <div className="flex items-center text-primary-500 gap-3">
                                                  <Icon className="size-10" />
                                             </div>
                                             <div>
                                                  <p className="capitalize text-lg group-hover:text-primary-500">
                                                       {title}
                                                  </p>
                                                  <p className="text-sm mt-2 text-gray-400">
                                                       {description}
                                                  </p>
                                             </div>
                                        </div>
                                   )
                              )}
                         </div>
                    </div>
               </div>
               <div className="py-5 mx-5 flex items-center justify-between bg-gray-200 rounded-md p-3">
                    <h5 className="text-md">Need Support</h5>
                    <p className="text-xl text-gray-500">
                         Can't find the answer you're looking for? Don't worry
                         we're here to help!
                    </p>
                    <AppButton>
                         <span className="uppercase text-sm">
                              contact support
                         </span>
                    </AppButton>
               </div>
               {details && (
                    <AppModal
                         action={() => setDetails(null)}
                         isOpen={details !== null}
                         toggle={() => setDetails(null)}
                         btnLoader={false}
                         width="lg"
                    >
                         <div className="flex gap-5 items-center">
                              <details.Icon className="size-12 rounded-lg text-white bg-primary-500 p-2" />
                              <h5 className="text-2xl font-semibold ">
                                   {details.title}
                              </h5>
                         </div>
                         <p className="font-normal text-sm text-gray-500 mt-2">
                              {details.description}
                         </p>
                         <div className="h-[60vh] overflow-y-scroll p-3 my-2">
                              {details.content.map(
                                   ({ details, title }, index) => (
                                        <div key={index}>
                                             <h6 className="text-lg">
                                                  {index + 1}. {title}
                                             </h6>
                                             <div className="my-6 space-y-2">
                                                  {details.map(
                                                       (detail, index) => (
                                                            <div
                                                                 key={index}
                                                                 className="flex items-center gap-3"
                                                            >
                                                                 {!detail.includes(
                                                                      "?"
                                                                 ) &&
                                                                      !detail.includes(
                                                                           ":"
                                                                      ) && (
                                                                           <div>
                                                                                <IoIosArrowRoundForward className="size-6" />
                                                                           </div>
                                                                      )}
                                                                 <p className="text-sm text-gray-500">
                                                                      {detail}
                                                                 </p>
                                                            </div>
                                                       )
                                                  )}
                                             </div>
                                        </div>
                                   )
                              )}
                         </div>
                    </AppModal>
               )}
          </div>
     );
};
