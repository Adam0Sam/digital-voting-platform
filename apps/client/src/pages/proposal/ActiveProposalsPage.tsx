import { useLoaderData } from 'react-router-dom';

export default function ActiveProposalsPage() {
  const proposals = useLoaderData();
  console.log(proposals);
  return <h1>labas</h1>;
}

export const loader = async () => {
  return { proposals: [] };
};
