import { Check } from "lucide-react";

const Benefits = () => {
  const benefits = [
    "Personalized emotional support 24/7",
    "Safe space for self-expression",
    "AI-powered insights for better self-awareness",
    "Guided mental wellness exercises",
    "Track your emotional journey over time",
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-accent-blue/20 to-primary-light/20 bg-purple-50">
      <div className="container px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
              alt="Woman experiencing mental wellness"
              className="w-full h-[500px] object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-primary/10 rounded-2xl" />
          </div>

          {/* Benefits Column */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Transform Your Mental Wellness Journey
            </h2>
            <p className="text-xl text-gray-600">
              Experience a revolutionary approach to emotional well-being with
              our AI-powered companion
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-6 w-6 text-primary shrink-0" />
                  <span className="text-gray-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
