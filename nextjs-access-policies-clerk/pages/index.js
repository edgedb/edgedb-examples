import styles from "/styles/Home.module.css";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { withServerSideAuth } from "@clerk/nextjs/ssr";
import React from "react";
import Link from "next/link";
import { client } from "../client";
import e from "../dbschema/edgeql-js";

export const getServerSideProps = withServerSideAuth(
  async ({ req }) => {
    const { userId } = req.auth;
    if (!userId) {
      return { redirect: { destination: "/sign-up?redirect_url=" + resolvedUrl } };
    }

    // set global variables with .withGlobals
    // this returns a new client instance
    // that shares a connection pool with the original
    const scopedClient = client.withGlobals({
      current_user: userId,
    });

    // upsert user
    const upsertUser = e
      .insert(e.User, {
        clerk_id: userId,
      })
      .unlessConflict((u) => ({
        on: u.clerk_id,
        else: u,
      }));

    // select properties from upserted user
    const dbUser = await e
      .select(upsertUser, () => ({
        id: true,
        clerk_id: true,
        posts: { title: true },
      }))
      .run(scopedClient);

    // add posts to user if none exists
    if (dbUser.posts.length === 0) {
      const titles = e.set("My first sample post", "Another post! Wow!");
      await e
        .for(titles, (title) => {
          return e.insert(e.BlogPost, {
            title,
            author: e.select(e.User, (u) => ({
              filter: e.op(u.id, "=", e.uuid(dbUser.id)),
            })),
          });
        })
        .run(scopedClient);
    }

    const posts = await e
      .select(e.BlogPost, () => ({
        id: true,
        title: true,
        author: { clerk_id: true },
      }))
      .run(scopedClient);

    return { props: { posts } };
  },
  { loadUser: true }
);

const Home = (props) => (
  <div className={styles.container}>
    <main className={styles.main}>
      <h1 className={styles.title}>Welcome to your new app</h1>
      <SignedIn>
        <p className={styles.description}>You have successfully signed in</p>
      </SignedIn>

      <SignedIn>
        <br />
        <br />
        <h2>Your blog posts</h2>
        <p>
          Loaded from EdgeDB using{" "}
          <a href={"https://www.edgedb.com/docs/datamodel/access_policies"}>object-level security</a>
        </p>
        <pre>
          <code className="language-js">{JSON.stringify(props.posts, null, 2)}</code>
        </pre>
      </SignedIn>
      <SignedOut>
        <p className={styles.description}>Sign up for an account to get started</p>
      </SignedOut>
    </main>
    <footer className={styles.footer}>
      Powered by{" "}
      <a
        href="https://clerk.dev?utm_source=github&utm_medium=starter_repos&utm_campaign=nextjs_starter"
        target="_blank"
        rel="noopener"
      >
        <img src="/clerk.svg" alt="Clerk" className={styles.logo} />
      </a>
      +
      <a href="https://nextjs.org/" target="_blank" rel="noopener">
        <img src="/nextjs.svg" alt="Next.js" className={styles.logo} />
      </a>
    </footer>
  </div>
);

export default Home;
