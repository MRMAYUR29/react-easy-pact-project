import { object, string, ref } from "yup";

export const UserValidation = object().shape({
  name: string().required("Name is required"),
  sesa_id: string().required("Sesa-Id is required"),
  email: string().email("Invalid email address").required("Email is required"),
  password: string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: string()
    .oneOf([ref('password')], "Passwords must match")
    .required("Please confirm your password"),
  mobile: string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile is required"),
  city_id: object({
    _id: string().required("City is required"),
  }),
  country_id: object({
    _id: string().required("Country is required"),
  }),
  region_id: object({
    _id: string().required("Region is required"),
  }),
  user_type_id: object({
    _id: string().required("Role is required"), // Changed from type_name to _id to match your form
  }),
  department: string().required("Department is required"),
  designation: string().required("Designation is required"),
});

export const signInValidationSchema = object().shape({
  seS_id: string().required("Sesa-Id is required"),
  password: string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});