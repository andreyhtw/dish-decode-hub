import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, TrendingUp, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                ✨ Nutrição Inteligente com IA
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Transforme sua{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                alimentação
              </span>{" "}
              com IA
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-xl">
              Tire uma foto do seu prato, veja os nutrientes em tempo real e receba 
              orientação profissional. Tudo em um só lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-accent text-lg gap-2">
                  Comece Grátis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg">
                Ver Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Camera className="w-5 h-5" />
                  <span className="text-2xl font-bold">98%</span>
                </div>
                <p className="text-sm text-muted-foreground">Precisão IA</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Users className="w-5 h-5" />
                  <span className="text-2xl font-bold">50k+</span>
                </div>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-2xl font-bold">2M+</span>
                </div>
                <p className="text-sm text-muted-foreground">Refeições Analisadas</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image Placeholder */}
          <div className="relative lg:h-[600px] animate-fade-in-delay">
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative h-full flex items-center justify-center">
              <div className="w-full max-w-md aspect-square bg-card rounded-3xl shadow-strong p-8 flex items-center justify-center border border-border">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center">
                    <Camera className="w-16 h-16 text-primary-foreground" />
                  </div>
                  <p className="text-lg font-semibold">Tire uma foto da sua refeição</p>
                  <p className="text-muted-foreground">IA reconhece automaticamente os alimentos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
