import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Adresa de email nu este validă")
    .required("Adresa de email este obligatorie"),
  password: Yup.string()
    .min(6, "Parola trebuie să aibă cel puțin 6 caractere")
    .required("Parola este obligatorie"),
});
