import Footer from "@/src/components/footer/Footer";
import Navbar from "@/src/components/navbar/Navbar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen flex flex-col" >
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default layout;
