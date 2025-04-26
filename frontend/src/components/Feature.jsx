import { MessageCircle, Heart, Smile } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "Conversational Check-ins",
      description: "Natural, flowing conversations that help you express your feelings freely and openly."
    },
    {
      icon: Heart,
      title: "Empathetic Support",
      description: "Receive personalized, uplifting guidance and emotional insights when you need them most."
    },
    {
      icon: Smile,
      title: "Safe Space",
      description: "No judgment. No pressure. Just a comfortable environment for your emotional wellbeing."
    }
  ];

  return (
    <section className="py-20 bg-white container">
      <div className="container px-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          What you'll experience
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 rounded-2xl bg-gradient-to-b from-white to-accent-blue/10 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};