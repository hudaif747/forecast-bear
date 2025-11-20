import PureGameDetail from "./GameDetail";

export default async function GamePage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;

  return <PureGameDetail id={id} />;
}
