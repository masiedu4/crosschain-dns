import { Address } from "viem";
import StakePage from "../(components)/Stake";

export default async function Page({
  params,
}: {
  params: { address: string | Address };
}) {
  return <div>
	<StakePage />
  </div>;
}
