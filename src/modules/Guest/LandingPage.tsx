import { FC, useEffect } from "react";

interface LandingPageProps {}
const LandingPage: FC<LandingPageProps> = () => {
  useEffect(() => {
    document.title = "Pa'ca - Pronto";
  }, []);

  return <div>Landing Page</div>;
};

export default LandingPage;
