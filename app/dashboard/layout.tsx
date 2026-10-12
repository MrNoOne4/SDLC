import { memo } from 'react';
import SideBar from "@/components/sidebar";
const Layout = () => {
  return (
    <div>
        <SideBar/>
    </div>
  );
};

export default memo(Layout);