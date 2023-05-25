import bcrypt from 'bcrypt';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

import prisma from '@/lib/prisma';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = await prisma.user.findFirst({
          where: {
            username: credentials?.username
          }
        });

        const isAuthenticated =
          user && credentials?.password && (await bcrypt.compare(credentials.password, user.password));

        if (isAuthenticated) {
          return user;
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/en/login'
  },
  session: {
    maxAge: 86400
  }
});

export { handler as GET, handler as POST };
