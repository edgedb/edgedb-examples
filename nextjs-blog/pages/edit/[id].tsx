import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import {useState} from 'react';
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
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <textarea
          placeholder="Write something..."
          rows={15}
          className="content-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <button
          onClick={async () => {
            const payload = {title, content};
            const url = `/api/post/${props.post.id}`;
            const resp = await fetch(url, {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(payload),
            });
            const results = await resp.json();
            location.href = `/post/${results.id}`;

            // grab the updated content
            // put those in an object
            // POST that object to an API endpoint
            // that endpoint will update the title and content
            // and set a value for `published`
          }}
        >
          Publish
        </button>
      </div>
      <style jsx>{`
        input,
        textarea {
          width: 100%;
          border: none;
          background-color: none;
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
