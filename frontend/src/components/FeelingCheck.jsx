import { useState } from "react";
// import { Button } from "./ui/button";

export const FeelingCheck = () => {
  const [isOpen, setIsOpen] = useState(false);

  const feelings = [
    "Energized",
    "Calm",
    "Anxious",
    "Overwhelmed",
    "Hopeful",
    "Tired",
    "Content",
    "Uncertain",
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-accent-pink/20 to-primary-light/20">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            How are you really feeling today?
          </h2>

          <p className="text-xl text-gray-600">
            Your journey to better mental clarity begins with a single thought.
          </p>

          <div className="mt-8">
            <div
              className={`grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-300 ${
                isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              {feelings.map((feeling, index) => (
                <button
                  key={index}
                  variant="outline"
                  className="p-6 text-lg hover:bg-primary hover:text-white transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {feeling}
                </button>
              ))}
            </div>

            {!isOpen && (
              <button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white mt-8"
                onClick={() => setIsOpen(true)}
              >
                Share Your Feelings
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};