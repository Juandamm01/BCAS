import HomeClient from "@/components/landing/HomeClient";
import { getPlans } from "@/backend/actions/plans";
import { PlanItem } from "@/components/landing/Plans";

export default async function Home() {
  const initialPlans = (await getPlans()) as PlanItem[];
  return <HomeClient initialPlans={initialPlans} />;
}
