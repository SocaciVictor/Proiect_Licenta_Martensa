// modules/auth/validation/authSchema.ts
import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Email invalid").required("Emailul este necesar"),
  password: yup
    .string()
    .min(6, "Minim 6 caractere")
    .required("Parola este necesară"),
});

export const registerSchema = yup.object().shape({
  email: yup.string().email("Email invalid").required("Emailul este necesar"),
  password: yup.string().min(6).required("Parola este necesară"),
  firstName: yup.string().required("Prenumele este necesar"),
  lastName: yup.string().required("Numele este necesar"),
  address: yup.string().required("Adresa este necesară"),
  phoneNumber: yup.string().required("Numărul de telefon este necesar"),
  dateOfBirth: yup.string().required("Data nașterii este necesară"),
});
