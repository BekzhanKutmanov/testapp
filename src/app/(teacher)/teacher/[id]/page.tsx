import TestListClient from '@views/TestList'

type Props = {
  params: {
    id: string;
  };
};

export default async function TestlistServer({params: {id}}: Props) {
  return (
      <TestListClient id={id}/>
  );
}
