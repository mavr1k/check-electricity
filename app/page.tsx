import clsx from 'clsx';

type Data = {
  ErrCode?: string;
  error?: string;
  msg?: string;
  GAOmessage?: {
    message: string;
  }[];
};

const getMessage = async () => {
  if (!process.env.DATA_URL) {
    throw new Error('DATA_URL is not defined');
  }
  const url = process.env.DATA_URL;
  const response = await fetch(url);
  const data: Data = await response.json();

  const error = data.ErrCode || data.error;
  if (error) {
    console.error('error', data);
    return { ok: false, message: data.msg };
  }

  const { GAOmessage: messages } = data;
  if (!messages || messages.length === 0) {
    console.error('no data', data);
    return { message: 'нет данных', ok: false };
  }

  return { message: messages[0].message, ok: true };
};

export default async function Home() {
  const { message, ok } = await getMessage();

  return (
    <main className="flex min-h-screen flex-col items-center px-10 py-24 md:px-24">
      <h1 className="text-4xl font-bold pb-12">шо у пыжесов со светом</h1>
      <p className={clsx('text-lg', { 'text-red-500': !ok })}>{message}</p>
    </main>
  );
}
