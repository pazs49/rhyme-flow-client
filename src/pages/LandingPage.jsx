import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";

import { Button } from "@/components/ui/button";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

import { FlipWords } from "@/components/ui/flip-words";

import landingPageMovingCardsData from "@/data/landingPageMovingCardsData";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { getInfo } from "@/api/auth";
import { useNavigate } from "react-router";
import Loading from "@/components/Loading";

const LandingPage = () => {
  const { isSuccess, isLoading } = useQuery({
    queryKey: ["goToDashboardWhenLoggedIn"],
    queryFn: getInfo,
  });
  const navigate = useNavigate();
  const [isLoginForm, setIsLoginForm] = useState(true);

  if (isLoading) return <Loading />;

  if (isSuccess) {
    navigate("/dashboard");
  }

  return (
    <>
      <main className="flex flex-col px-10 justify-between h-screen px-4 sm:px-6 md:px-10 py-5">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img className="h-15" src="/logo.png" alt="" />
            <p className="text-2xl font-bold">RhymeFlow</p>
          </div>
          <nav>
            <ul className="flex gap-4">
              <li className="flex items-center">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoginForm(true);
                  }}
                >
                  Login
                </a>
              </li>
              <p className="flex items-center cursor-default">|</p>
              <li>
                <Button
                  onClick={() => setIsLoginForm(false)}
                  variant={"primary"}
                >
                  Register
                </Button>
              </li>
            </ul>
          </nav>
        </header>
        <section className="flex w-full px-10">
          <div className="max-w-lg text-start">
            <h1 className="text-8xl font-bold">Inspire</h1>
            <h1 className="text-8xl font-thin italic ">Your</h1>
            <h1 className="text-green-600 text-8xl font-extrabold underline">
              <FlipWords
                className={"text-green-600 text-8xl font-extrabold underline"}
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
            <p className="pl-2 mt-4">
              From a single thought to a complete verse — our lyric generator
              transforms your ideas into meaningful, original songs.
            </p>
          </div>
          <div className="ml-auto">
            {isLoginForm ? (
              <LoginForm setIsLoginForm={setIsLoginForm} />
            ) : (
              <SignupForm setIsLoginForm={setIsLoginForm} />
            )}
          </div>
        </section>
        <section className="flex justify-center">
          <InfiniteMovingCards
            items={landingPageMovingCardsData}
            speed="slow"
            className={""}
          />
        </section>
      </main>
      <section className="flex items-center justify-center">
        <img
          src="/landing_page_mic.png"
          alt="man"
          className="absolute inset-0 z-[-1] h-full w-full object-contain opacity-20 pointer-events-none"
        />
      </section>
    </>
  );
};
export default LandingPage;
