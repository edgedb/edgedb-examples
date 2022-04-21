import type {InferGetServerSidePropsType, NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

import {createClient} from 'edgedb';
import e from '../dbschema/edgeql-js';

export const client = createClient();

export async function getServerSideProps() {
  const query = e.select(e.BlogPost, (post) => ({
    id: true,
    title: true,
    content: true,
    publishedAtStr: e.cast(e.str, post.publishedAt),
  }));

  const posts = await query.run(client);

  return {
    props: {
      posts,
    },
  };
}

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>My Blog</title>
        <meta name="description" content="It's an awesome blog" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>My Blog</h1>
        <br />

        <button
          onClick={async () => {
            const resp = await fetch('/api/post', {
              method: 'POST',
            });
            const result: {id: string} = await resp.json();
            console.log(result);
            location.href = `/edit/${result.id}`;
          }}
        >
          + New post
        </button>
        <div
          style={{width: '100%', maxWidth: '600px', margin: '50px auto 0 auto'}}
        >
          {props.posts.map((post) => (
            <div
              key={post.title}
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <p>{post.title}</p>
              {post.publishedAtStr ? (
                <Link href={`/post/${post.id}`} passHref>
                  <button>👁 View</button>
                </Link>
              ) : (
                <Link href={`/edit/${post.id}`} passHref>
                  <button>🪶 Edit</button>
                </Link>
              )}
            </div>
          ))}
        </div>
      </main>
      <style jsx>{`
        button {
          color: white;
          border: none;
          padding: 4px 8px;
          cursor: pointer;
          border-radius: 4px;
          background-color: #303effdd;
        }
        button:hover {
          background-color: #303effff;
        }
      `}</style>
    </div>
  );
};

export default Home;
