import { Camera, LineChart, Target, MessageSquare, Award, Zap } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Reconhecimento de IA",
    description: "Tire fotos das refeições e deixe a IA identificar automaticamente os alimentos e calcular nutrientes."
  },
  {
    icon: LineChart,
    title: "Dashboard Inteligente",
    description: "Acompanhe calorias, macros e progresso com gráficos interativos e relatórios detalhados."
  },
  {
    icon: Target,
    title: "Metas Personalizadas",
    description: "Defina objetivos customizados e receba recomendações personalizadas baseadas no seu perfil."
  },
  {
    icon: MessageSquare,
    title: "Chat com Nutricionista",
    description: "Tire dúvidas e receba orientação profissional em tempo real através do chat integrado."
  },
  {
    icon: Award,
    title: "Análise Nutricional Completa",
    description: "Obtenha informações detalhadas sobre proteínas, carboidratos, gorduras e micronutrientes."
  },
  {
    icon: Zap,
    title: "Respostas Instantâneas",
    description: "Análise em segundos com nossa IA de última geração. Sem espera, resultados imediatos."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Funcionalidades{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Poderosas
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Tudo o que você precisa para transformar sua alimentação e alcançar seus objetivos
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-border hover:border-primary/20"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
