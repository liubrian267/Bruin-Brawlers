"use server";
import z from 'zod';
import { connectToDatabase } from '@/utils/database';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { createSession } from '@/utils/jwt';
import { appUser } from '@/types/Users';
import { State } from '@/types/Users';
//Zod object to validate the input
//aids with development aswell
const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export async function login(prevState: State, formData : FormData) {
    await connectToDatabase();
    const result = signUpSchema.safeParse(Object.fromEntries(formData))
    //parsing error incorrect output
    if (!result.success) {
        return { 
            errors: result.error.flatten().fieldErrors 
        };
    }      
    const {email, password} = result.data    
    try {
        const user : appUser | null = await User.findOne({email: email})
        //check if password matches generate a jwt token and validate user on certian paths
        if (!user || !bcrypt.compareSync(password, user.password)){
            console.log("Invalid email or password");
            return { 
                errors: {
                    email: ["Invalid email or password"]
                }
             };
        }
        //generate a jwt token
        await createSession(user.id, user.BrawlID);
        console.log("User logged in successfully");
    } catch (error) {
        return { message : "Server error, please try again later", error: error };
    };
     
    redirect('/feed');
}
  

