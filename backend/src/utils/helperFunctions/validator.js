const regex = /^\S+@\S+\.\S+$/;

const validateCredentials = (name, email, password) => {
  if (!name || name.trim() === "") return "Name is required!";
  if (name.split("").length < 3) return "Name Must At Least 3 Characters Long!";

  if (!email || email.trim() === "") return "Email is required!";
  if (!regex.test(email)) return "Please provide a valid email address";
  if (!password || password.trim() === "") return "password is required!";
};

export default validateCredentials;
