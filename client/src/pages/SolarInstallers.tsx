import { LandingPage } from "@/components/LandingPage";
import { landingFor } from "@/data/landings";

const landing = landingFor("/solar-installers")!;

export default function SolarInstallers() {
  return <LandingPage landing={landing} />;
}
