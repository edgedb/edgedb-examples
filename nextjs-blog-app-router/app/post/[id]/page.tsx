import { createClient } from 'edgedb'
import e from '@/dbschema/edgeql-js'
import Link from 'next/link'

const client = createClient()

export default async function Post({ params }: { params: { id: string } }) {
  const post = await e
    .select(e.BlogPost, (post) => ({
      id: true,
      title: true,
      content: true,
      filter_single: e.op(post.id, '=', e.uuid(params.id)),
    }))
    .run(client)

  if (!post) {
    return <div>Post not found</div>
  }

  return (
    <div className="container mx-auto p-4 bg-black text-white">
      <nav>
        <Link
          href="/"
          className="text-blue-500 mb-4 block"
          replace
        >
          Back to list
        </Link>
      </nav>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
