interface ILocationProps {
     _id?: string;
     name?: string;
}

export interface IUserProps {
     _id?: string;
     seS_id: string;
     name: string;
     email: string;
     password: string;
     confirmPassword: string;
     // mobile: string;
     is_active: boolean;
     isApproved?: boolean;
     designation: string;
     department: string;
     created_at?: string;
     modified_at?: string;
     session_id?: string;
     // city_id: ILocationProps;
     country_id: ILocationProps;
     region_id: ILocationProps;
     user_type_id: {
          _id: string;
          type_name: string;
     };
}

export type userRoleType = "Admin" | "Regional Admin" | "Employee";

export const userRole: userRoleType[] = ["Admin", "Regional Admin", "Employee"];

export interface ILoginProps {
     seS_id: string;
     password: string;
     lat: number;
     log: number;
     deviceType: "mobile" | "desktop";
}
