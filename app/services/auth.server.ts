import { GitHubStrategy } from "remix-auth-github";
import { GoogleStrategy } from 'remix-auth-google'
import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { prisma } from "./prisma.server";
import { User } from '@prisma/client'

const createUser = async (profile:any) => {

  const user = await prisma.user.findUnique({
    where: { email: profile.emails[0].value },
  });

  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        email: profile.emails[0].value,
        name: profile._json.name,
        image: profile._json.avatar_url,
        accounts: {
          create: {
            provider: profile.provider,
            type: 'OAUTH',
          },
        },
      },
      include: {
        accounts: true,
      },
    });
    return newUser;
  }

  const existingAccount = await prisma.account.findFirst({
    where: {
      userId: user.id,
      provider: profile.provider,  
    },
  });

  if (existingAccount) {
    return await prisma.user.update({
      where: { id: user.id },
      data: {},
      include: {
        accounts: true,
      },
    });
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      accounts: {
        create: {
          provider: profile.provider,
          type: 'OAUTH',
        },
      },
    },
    include: {
      accounts: true,
    },
  });

  return updatedUser;
}

let gitHubStrategy = new GitHubStrategy(
  {
    clientId: process.env.github_clientId as string,
    clientSecret: process.env.github_clientSecret as string,
    redirectURI: "https://url.cordmarston.com/auth/github/callback",
  },
  async ({ profile }) => {
    let user = await createUser(profile);
    return user;
  }
);

let googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.google_clientId as string,
    clientSecret: process.env.google_clientSecret as string,
    callbackURL: 'https://url.cordmarston.com/auth/google/callback',
  },
  async ({ profile }) => {
    let user = await createUser(profile);
    return user;
  }
)


export let authenticator = new Authenticator<User>(sessionStorage, {
  throwOnError: true
});

authenticator.use(gitHubStrategy);
authenticator.use(googleStrategy);