import { object, string } from "yup";

export const DemoValidation = object().shape({
     demoType: string().required("Demo Type is required"),
     name: string().required("Name is required"),
     image: string().required("Image is required"),
     category: string().required("Category is required"),
     description: string().required("Description is required"),
});
