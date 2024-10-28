import mongoose from "mongoose"

export const connectDB=async()=>{
    try {
        const {connection}=await mongoose.connect(process.env.MONGOURI as string)

        console.log(`Database connected as ${connection.host}`)
    } catch (error) {
        console.log(`${error}`)
    }
}