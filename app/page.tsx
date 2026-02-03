import Image from "next/image";
import { Button } from "@/components/ui/button";
import SignUpForm from "@/components/SignUoForm";

export default function Home() {
  return (

    <div>
      <SignUpForm />
      <div className="mt-20" >
      {/* <Button>Send</Button> */}
      </div>
    </div>
  )
}
