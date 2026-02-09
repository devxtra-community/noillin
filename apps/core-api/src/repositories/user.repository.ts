import { User } from "../modules/users/user.model.js";

class UserRepository{
    async findEmailWithPassword(email: string) {
    return User.findOne({ email }).select("+password");
}


    async saveRefreshToken(userId:string, refreshToken:string){
        return User.findByIdAndUpdate(userId,{refreshToken})
    }
}

export const userRepository = new UserRepository()