import bcrypt from "bcrypt"

export const hashPassword = async (password) => {
    try {
        const genSalt = 10
        const hashedPassword = await bcrypt.hash(password, genSalt)
        return hashedPassword
    } catch (error) {
        console.log(error)
    }
}

export const comparePassword = async (password, hashedPassword) => {
    try {
        return bcrypt.compare(password, hashedPassword)
    } catch (error) {
        console.log(error)
    }
}