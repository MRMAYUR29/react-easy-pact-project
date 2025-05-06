export interface IUserType {
     type_name: string;
     is_active: boolean;
     created_at?: Date;
     _id?: string;
}

export interface IMapProductProps {
     user_id: string | { name: string };
     demo_product_id: string | { title: string };
     created_at?: Date;
     _id?: string;
}
