import { object, string, ref } from "yup";
import { isValidPhoneNumber } from 'react-phone-number-input';

export const UserValidation = object().shape({
  name: string().required("Name is required"),
  seS_id: string()
    .required('seS ID is required')
    .matches(
      /^SESA\d{6}$/,
      'seS ID must start with SESA followed by 6 digits'
    )
    .uppercase() // Ensure it's always uppercase
    .transform((value) => value?.toUpperCase()),
  email: string().email("Invalid email address").required("Email is required"),
  password: string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: string()
    .oneOf([ref('password')], "Passwords must match")
    .required("Please confirm your password"),
    mobile: string()
    .test('is-valid-phone', 'Invalid phone number', (value) => {
      return value ? isValidPhoneNumber(value) : false;
    })
    .required("Mobile number is required"),
  // city_id: object({
  //   _id: string().required("City is required"),
  // }),
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

export const forgotPasswordValidationSchema = object({
  seS_id: string().required("SESA ID is required"),
  password: string()
    .required("New password is required")
    .min(6, "Password must be at least 6 characters"),
});