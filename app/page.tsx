// app/page.tsx
"use client"

// import { useAppSelector, RootState } from "@lib/redux/store";
// import { useEffect, useState } from "react";

// interface ActivePage {
//   page: string;
//   title: string;
// }

export default function Home() {
  // const [isLoginOpen, setIsLoginOpen] = useState(false);
  // const [activePage, setActivePageState] = useState<ActivePage>({ page: 'home', title: '' });
  // const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  // const setActivePage = (page: string, title: string) => {
  //   setActivePageState({ page, title });
  // };

  // useEffect(() => {
  //   console.log("NODE_ENV:", process.env.NODE_ENV);
  // }, []);

  return (
    <div>
      <span>Home page!!!</span>
    </div>
  )
}
