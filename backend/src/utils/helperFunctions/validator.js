const regex = /^\S+@\S+\.\S+$/;

const signupValidator = (name, email, password) => {
  if (!name || name.trim() === "") return "Name is required!";
  if (name.split("").length < 3) return "Name Must At Least 3 Characters Long!";

  if (!email || email.trim() === "") return "Email is required!";
  if (!regex.test(email)) return "Please Provide a Valid Email Address";
  if (!password || password.trim() === "") return "Password is required!";
};

const loginValidator = (email, password) => {
  if (!email || email.trim() === "") return "Email is required!";
  if (!regex.test(email)) return "Please Provide a Valid Email Address!";
  if (!password || password.trim() === "") return "Password is required!";
};

const OTPValidator = (OTP) => {
  if (OTP.trim() === "") return "OTP Is Required!";

  if (OTP.length < 6 || OTP.length > 6) return "Enter 6 Digit OTP!";
};

export { signupValidator, loginValidator, OTPValidator };
