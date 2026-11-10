import { LandingPage } from "@/components/LandingPage";
import { landingFor } from "@/data/landings";

const landing = landingFor("/energy-auditors")!;

export default function EnergyAuditors() {
  return <LandingPage landing={landing} />;
}
