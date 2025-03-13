import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Database connected successfully')
    } catch (error) {
        console.error('Database connection failed:', error)
        process.exit(1)
    }
}

export const closeDB = async () => {
    try {
        await mongoose.connection
            .close()
            .then(console.log('Database connection closed successfully'))
    } catch (error) {
        console.error('Failed to close connection:', error)
    }
}

export default connectDB
