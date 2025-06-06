import { useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import { Button } from "@/components/ui/button";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { FlipWords } from "@/components/ui/flip-words";
import landingPageMovingCardsData from "@/data/landingPageMovingCardsData";
import { getInfo } from "@/api/auth";
import Loading from "@/components/Loading";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoginForm, setIsLoginForm] = useState(true);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["info"],
    queryFn: async () => {
      console.log("triggered");
      return await getInfo(localStorage.getItem("token"));
    },
    enabled: !!localStorage.getItem("token"),
  });

  if (isLoading) return <Loading />;
  if (isSuccess) {
    navigate("/dashboard");
    window.location.reload();
  }
  if (isError) {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
  }

  return (
    <>
      <main className="container mx-auto flex flex-col justify-between min-h-screen px-4 py-5">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="flex items-center gap-2">
            <img className="h-12 w-auto" src="/logo.png" alt="Logo" />
            <p className="text-2xl font-bold">RhymeFlow</p>
          </div>
          <nav>
            <ul className="flex gap-4 items-center">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoginForm(true);
                  }}
                  className="text-sm sm:text-base"
                >
                  Login
                </a>
              </li>
              <p className="text-gray-500">|</p>
              <li>
                <Button
                  onClick={() => setIsLoginForm(false)}
                  variant={"primary"}
                  className="text-sm sm:text-base"
                >
                  Register
                </Button>
              </li>
            </ul>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center text-center md:text-left gap-10 mt-10 px-2 sm:px-4">
          <div className="max-w-lg">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold">
              Inspire
            </h1>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-thin italic">
              Your
            </h1>
            <h1 className="text-green-600 text-5xl sm:text-6xl md:text-8xl font-extrabold underline">
              <FlipWords
                className="text-green-600 text-5xl sm:text-6xl md:text-8xl font-extrabold underline"
                words={[
                  "Creativity",
                  "Dreams",
                  "Music",
                  "Soul",
                  "Flow",
                  "Rhythm",
                ]}
              />
            </h1>
            <p className="mt-4 text-sm sm:text-base px-2 md:px-0">
              From a single thought to a complete verse — our lyric generator
              transforms your ideas into meaningful, original songs.
            </p>
          </div>

          <div className="w-full md:max-w-md md:ml-auto md:self-start">
            {isLoginForm ? (
              <LoginForm setIsLoginForm={setIsLoginForm} />
            ) : (
              <SignupForm setIsLoginForm={setIsLoginForm} />
            )}
          </div>
        </section>

        {/* Moving Cards Section */}
        <section className="w-full mt-10 px-2 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <InfiniteMovingCards
              items={landingPageMovingCardsData}
              speed="slow"
              className=""
            />
          </div>
        </section>
      </main>

      {/* Background Image */}
      <section className="flex items-center justify-center">
        <img
          src="/landing_page_mic.png"
          alt="mic"
          className="absolute inset-0 z-[-1] h-full w-full object-contain opacity-20 pointer-events-none max-h-screen"
        />
      </section>
    </>
  );
};

export default LandingPage;
