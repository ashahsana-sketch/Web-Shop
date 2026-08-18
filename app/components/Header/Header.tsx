

// import { useRouter } from "next/navigation";
import Button from "./button";

export default function Header() {
  // const router = useRouter();

  return (
    <main>
      <div className="bg-white m-4 shadow-md p-4 lg:mx-auto">
        <header className="md:flex md:py-5 lg:py-2 lg:p-2 justify-between items-center">
          <div className="flex flex-col justify-center">
            <h1 className="md:text-3xl text-2xl font-bold text-gray-900">
              Inventory Management
            </h1>

            <p className="py-4 text-gray-600 wrap-break">
              Manage and track your global product catalogue across all categories.
            </p>
          </div>

          <Button />
        </header>
      </div>
    </main>
  );
}