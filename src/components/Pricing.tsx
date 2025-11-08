import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para começar",
    features: [
      "Até 5 análises por mês",
      "Dashboard básico",
      "Cálculo de calorias",
      "Histórico de 7 dias"
    ],
    cta: "Começar Grátis",
    highlighted: false
  },
  {
    name: "Pro",
    price: "R$ 29,90",
    period: "/mês",
    description: "Para usuários dedicados",
    features: [
      "Análises ilimitadas",
      "Dashboard completo",
      "Todos os nutrientes",
      "Metas personalizadas",
      "Relatórios detalhados",
      "Chat com nutricionista",
      "Histórico completo"
    ],
    cta: "Assinar Pro",
    highlighted: true
  },
  {
    name: "Consultório",
    price: "R$ 149,90",
    period: "/mês",
    description: "Para nutricionistas",
    features: [
      "Múltiplos pacientes",
      "Gestão de clientes",
      "Planos alimentares",
      "Relatórios profissionais",
      "Exportar PDF",
      "Chat com pacientes",
      "Dashboard de clientes",
      "Suporte prioritário"
    ],
    cta: "Assinar Consultório",
    highlighted: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Planos e{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Preços
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Escolha o plano ideal para suas necessidades. Cancele quando quiser.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 ${
                plan.highlighted
                  ? "bg-gradient-primary border-2 border-primary shadow-strong scale-105"
                  : "bg-card border border-border shadow-soft"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span className={`text-5xl font-bold ${plan.highlighted ? "text-primary-foreground" : "text-foreground"}`}>
                  {plan.price}
                </span>
                <span className={`text-lg ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>

              <Link to="/auth">
                <Button
                  className={`w-full mb-8 ${
                    plan.highlighted
                      ? "bg-accent hover:bg-accent/90"
                      : "bg-gradient-primary"
                  }`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </Link>

              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`} />
                    <span className={plan.highlighted ? "text-primary-foreground" : "text-foreground"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
