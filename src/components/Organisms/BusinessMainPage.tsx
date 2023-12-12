import { FC } from "react";
import { BusinessSidebarNav } from "./BusinessSidebarNav";

interface BusinessMainPageProps {
  children?: React.ReactNode;
}
export const BusinessMainPage: FC<BusinessMainPageProps> = ({ children }) => {
  return (
    <div
      style={{ scrollbarGutter: "stable" }}
      className="flex flex-col h-[100vh] w-[100vw] overflow-y-auto overlflow-x-hidden p-8 pl-16 sm:pl-28 pr-4 sm:pr-8"
    >
      <BusinessSidebarNav />

      {children}
    </div>
  );
};
