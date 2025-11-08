import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Flame, Apple, Beef, Wheat, Droplet } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DashboardHomeProps {
  userId: string;
}

interface TodayStats {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goal: number;
}

const DashboardHome = ({ userId }: DashboardHomeProps) => {
  const [stats, setStats] = useState<TodayStats>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    goal: 2000,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayStats();
  }, [userId]);

  const fetchTodayStats = async () => {
    try {
      // Get profile goal
      const { data: profile } = await supabase
        .from("profiles")
        .select("daily_calorie_goal")
        .eq("id", userId)
        .single();

      // Get today's meals
      const today = new Date().toISOString().split("T")[0];
      const { data: meals } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`);

      if (meals) {
        const totals = meals.reduce(
          (acc, meal) => ({
            calories: acc.calories + (meal.calories || 0),
            protein: acc.protein + (parseFloat(meal.protein?.toString() || "0") || 0),
            carbs: acc.carbs + (parseFloat(meal.carbs?.toString() || "0") || 0),
            fat: acc.fat + (parseFloat(meal.fat?.toString() || "0") || 0),
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        setStats({
          ...totals,
          goal: profile?.daily_calorie_goal || 2000,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const calorieProgress = (stats.calories / stats.goal) * 100;

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Bem-vindo de volta! 👋</h2>
        <p className="text-muted-foreground">
          Aqui está um resumo do seu dia
        </p>
      </div>

      {/* Main Calorie Card */}
      <Card className="p-6 bg-gradient-primary text-primary-foreground">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm opacity-90 mb-1">Calorias de Hoje</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{stats.calories}</span>
              <span className="text-lg opacity-90">/ {stats.goal}</span>
            </div>
          </div>
          <Flame className="w-12 h-12 opacity-90" />
        </div>
        <Progress value={calorieProgress} className="h-2 bg-primary-foreground/20" />
        <p className="text-sm mt-2 opacity-90">
          {calorieProgress >= 100
            ? "Meta atingida! 🎉"
            : `Restam ${stats.goal - stats.calories} kcal`}
        </p>
      </Card>

      {/* Macros Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Beef className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Proteínas</p>
              <p className="text-2xl font-bold">{stats.protein.toFixed(1)}g</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Wheat className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Carboidratos</p>
              <p className="text-2xl font-bold">{stats.carbs.toFixed(1)}g</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gorduras</p>
              <p className="text-2xl font-bold">{stats.fat.toFixed(1)}g</p>
            </div>
          </div>
        </Card>
      </div>

      {/* AI Recommendation */}
      <Card className="p-6 border-l-4 border-l-primary">
        <div className="flex items-start gap-3">
          <Apple className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2">Recomendação do Dia</h3>
            <p className="text-muted-foreground">
              {stats.protein < 50
                ? "Você está com baixo consumo de proteína. Que tal adicionar ovos, frango ou peixe na próxima refeição?"
                : stats.calories < stats.goal * 0.5
                ? "Continue assim! Lembre-se de manter suas refeições equilibradas."
                : "Ótimo progresso! Mantenha o foco em alimentos nutritivos."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardHome;
