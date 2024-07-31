import Image from "next/image";
import Logo from "@/images/logo.png"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StoryWriter from "@/components/StoryWriter";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-purple-700 flex flex-col justify-center items-center space-y-5 order-1 lg:-order-1 pb-10">
          <Image src={Logo} alt="Logo" height={250}/>
          <Button asChild>
            <Link href='/stories' className="px-20 bg-purple-800 p-10 text-xl">
              Explore
            </Link>
          </Button>
        </div>
        <StoryWriter/>

      </section>
    </main>
  );
}
