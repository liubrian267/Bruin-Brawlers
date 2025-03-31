"use server";
import z from 'zod';
import { connectToDatabase } from '@/utils/database';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import { SignUpState } from '@/types/Users';

//validate Supercell ID before sign up
const SUPERCELL_API_URL = "https://bsproxy.royaleapi.dev/v1";
const BS_API_KEY = process.env.BS_API_KEY;
let userName = ""; 
async function validateBrawlID(brawlID: string): Promise<boolean> {
    try {
        const response = await fetch(`${SUPERCELL_API_URL}/players/%23${brawlID}`, {
            headers: {
                Authorization: `Bearer ${BS_API_KEY}`,
            },
        });
        if (response.status == 200){
            const data = await response.json();
            userName = data.name;
            console.log(data)
            console.log("username being updated", userName);
            return true;
        } else {
            console.log("Error response: ", response)
            return false;
        }
    } catch (error) {
        console.error("Error validating BrawlID:", error);
        throw new Error("Failed to validate BrawlID");
    }
}


//Zod object to validate the input
const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    BrawlID: z.string()
});


export async function signUp(prevState: SignUpState, formData : FormData) {
    await connectToDatabase();
    const result = signUpSchema.safeParse(Object.fromEntries(formData))
    //parsing error incorrect output
    if (!result.success) {
        console.log("Error parsing input: ", result.error.errors[0]);
        return { 
            errors: result.error.flatten().fieldErrors 
        };
    } 
    
    const {email, password, BrawlID} = result.data

    //check if BrawlID is valid
    const isBrawlIDValid = await validateBrawlID(BrawlID);
    if (!isBrawlIDValid) {
        return { 
            errors: {
                BrawlID: ["Invalid Brawl Stars ID"]
            }
        };
    } 
    console.log("BrawlID is valid");
    //save the user if does not exist
    // Check if email or BrawlID is already in use
    const existingUser = await User.findOne({ $or: [{ email }, { BrawlID }] });
    if (existingUser) {
        return {
            errors: {
                email: existingUser.email === email ? ["Email is already in use"] : undefined,
                BrawlID: existingUser.BrawlID === BrawlID ? ["BrawlID is already in use"] : undefined,
            }
        };
    }
    
    try {
        await User.create({email : email, password: password, BrawlID: BrawlID, username: userName })
        console.log("User created")
    } catch (error) {
        console.error("Failed to save user:", error);
        return { error: "Failed to save user" };
    }
    redirect('/login')
    
}
  

