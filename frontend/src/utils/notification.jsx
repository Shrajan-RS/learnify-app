import toast from "react-hot-toast";

import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

const successNotification = ({ icon, message, duration }) =>
  toast.success(message, {
    icon: icon || <FaCheckCircle size={25} />,
    style: {
      borderRadius: "10px",
      background: "#181A26",
      color: "white",
    },
    duration: duration || 2500,
  });

const failedNotification = ({ icon, message, duration, size }) =>
  toast.error(message, {
    icon: icon || <IoIosCloseCircle size={`${size || 25}`} />,
    style: {
      borderRadius: "10px",
      background: "#181A26",
      color: "white",
    },
    duration: duration || 2500,
  });

const customNotification = ({ icon, message, duration }) =>
  toast(message, {
    icon: icon || "",
    style: {
      borderRadius: "10px",
      background: "#181A26",
      color: "white",
    },
    duration: duration || 2500,
  });

export { successNotification, failedNotification, customNotification };
