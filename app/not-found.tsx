import Header from "@/components/Header";
import Link from "next/link";
import NotFoundaa from "next/image";
import Footer from "@/components/Footer";
export default function NotFound() {
  return (
    <div>
      <Header />

      <div style={{ padding: "100px", textAlign: "center" }}>
        <NotFoundaa
          src="/reportsicon.png"
          alt="SpendShift"
          width={180}
          height={180}
          priority
        />
        <h1>Not found</h1>
        
      </div>
      <Footer />
    </div>
  );
}
