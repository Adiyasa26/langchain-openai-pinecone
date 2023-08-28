import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { AIMessage, HumanMessage } from 'langchain/schema';
import { makeChain } from '@/utils/makechain';
import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { question, history } = await req.json();

  console.log('question', question);
  console.log('history', history);

  // only accept post requests
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  if (!question) {
    return NextResponse.json(
      { message: 'No question in the request' },
      { status: 400 },
    );
  }
  // OpenAI recommends replacing newlines with spaces for best results
  const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

  try {
    const index = pinecone.Index(PINECONE_INDEX_NAME);

    /* create vectorstore*/
    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({}),
      {
        pineconeIndex: index,
        textKey: 'text',
        // namespace: PINECONE_NAME_SPACE, //namespace comes from your config folder
      },
    );

    //create chain
    const chain = makeChain(vectorStore);

    const pastMessages = history.map((message: string, i: number) => {
      if (i % 2 === 0) {
        return new HumanMessage(message);
      } else {
        return new AIMessage(message);
      }
    });

    //Ask a question using chat history
    const response = await chain.call({
      question: sanitizedQuestion,
      chat_history: pastMessages,
    });

    console.log('response', response);
    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.log('error', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 },
    );
  }
}
