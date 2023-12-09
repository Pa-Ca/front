import { FC } from "react";
import { BusinessSidebarNav } from "./BusinessSidebarNav";

interface BusinessMainPageProps {
  children?: React.ReactNode;
}
export const BusinessMainPage: FC<BusinessMainPageProps> = ({ children }) => {
  return (
    <div className="flex min-h-[100vh] min-w-[97vw] overflow-hidden pl-20">
      <BusinessSidebarNav />

      {children}
    </div>
  );
};
