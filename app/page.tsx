import Image from "next/image";
import Logo from "@/images/logo.png"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section>
        <div>
          <Image src={Logo} alt="Logo" height={250}/>
          <Button asChild>
            <Link href='/'>
              Explore
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
