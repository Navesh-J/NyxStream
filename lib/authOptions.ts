import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing Email or Password")
                }
                try {
                    await connectToDatabase()
                    const user = await User.findOne({email:credentials.email})

                    if(!user){
                        throw new Error("No user found")
                    }
                    const isValid = await bcrypt.compare(credentials.password,user.password)

                    if(!isValid){
                        throw new Error("Invalid Password")
                    }
                    return{
                        id:user._id.toString(),
                        email:user.email
                    }
                } catch (error) {
                    console.error("Auth error")
                    throw error;
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token.id = user.id
            }
            return token
        },
        async session({session,user,token}){
            if(session.user){
                session.user.id = token.id as string
            }
            return session
        }
    },

    pages:{
        signIn:"/login",
        error:"/login",
    },
    session:{
        strategy:"jwt",
        maxAge:30*24*60*60,
    },
    secret:process.env.NEXTAUTH_SECRET
}