import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import {useState} from 'react';
import ReactMarkdown from 'react-markdown';
import {client} from '..';
import e from '../../dbschema/edgeql-js';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.query.id! as string;
  const query = e.select(e.BlogPost, (post) => ({
    id: true,
    title: true,
    content: true,
    filter: e.op(post.id, '=', e.uuid(id)),
  }));

  const post = await query.run(client);

  return {
    props: {
      post: post!,
    },
  };
}

const EditPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const [title, setTitle] = useState(props.post.title);
  const [content, setContent] = useState(props.post.content);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '600px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '200px',
      }}
    >
      <div style={{padding: '10px 0px;'}}>
        <h1 className="title-input">{props.post.title}</h1>
      </div>
      <div>
        <ReactMarkdown className="markdown">{props.post.content}</ReactMarkdown>
      </div>
      <style jsx global>{`
        .markdown img {
          width: 200px;
        }
      `}</style>
      <style jsx>{`
        h1 {
          margin: 0;
        }

        .title-input {
          font-size: 18pt;
        }
        .content-input {
          font-size: 14pt;
          flex: 1;
        }
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

export default EditPage;
