export interface DemoProps {
     _id?: string;
     title: string;
     description: string;
     image_url: string;
     video_url: string;
     product_category_id: {
          _id?: string;
          name?: string;
     };
     is_active: boolean;
     created_at?: Date;
     modified_at?: Date;
}

export type demoType = "webgl" | "video";
export const demoType: demoType[] = ["webgl", "video"];
