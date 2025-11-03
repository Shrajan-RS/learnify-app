import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB_NAME}`
    );

    console.log(
      `Connected To DB \n HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Failed To Connect DB", error);
    process.exit(0);
  }
};

export default connectDB;
