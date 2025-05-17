// import AppSideBar from "./appSideBar/AppSideBar.js";
import AppSideBar from "./KeyJam/AppSideBar.js";

/*

import ProductsPage from "../ProductsPage/ProductsPage";
import ChordSheetsPage from "../ChordSheetsPage/ChordSheetsPage";
import LessonsPage from "../LessonsPage/LessonsPage";
import SongFoldersPage from "../SongFoldersPage/SongFoldersPage";
~cb-add-import~

~cb-add-services-card~

case "products":
                return <ProductsPage />;
case "chordSheets":
                return <ChordSheetsPage />;
case "lessons":
                return <LessonsPage />;
case "songFolders":
                return <SongFoldersPage />;
~cb-add-thurthy~

*/

const AppLayout = (props) => {
  const { children, activeKey, activeDropdown } = props;

  return (
    <div className="flex min-h-[calc(100vh-5rem)] mt-20 bg-white">
      <AppSideBar activeKey={activeKey} activeDropdown={activeDropdown} />
      <div className="flex-1 ml-2">{children}</div>
    </div>
  );
};

export default AppLayout;
