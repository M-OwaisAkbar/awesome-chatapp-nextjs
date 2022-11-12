import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth from 'next-auth'
const authOptions = {
  secret: process.env.JWT_SECRET,
  providers: [
    CredentialsProvider({
      session: { strategy: "jwt" },
      name: 'Credentials',
      credentials: {
        username: { label: "email", type: "email", placeholder: "ow@gmail.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        //process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';
        const server = "http://localhost:3000";
        const res = await fetch(`${server}/api/login`, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" }
        })
        const data = await res.json()
        if (res.ok && data?.user) {
          return data.user
        }
        else {
          throw new Error(data.message ? data.message : "something went wrong");
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup'
  },
  callbacks: {
    async jwt({ token, user}) {
      return token
    }
  }
}


export default NextAuth(authOptions);
