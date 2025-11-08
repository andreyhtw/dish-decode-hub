import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Target, TrendingDown, TrendingUp, Activity } from "lucide-react";

interface GoalsProps {
  userId: string;
}

const Goals = ({ userId }: GoalsProps) => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState<string>("maintain");
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setWeight(data.weight?.toString() || "");
        setHeight(data.height?.toString() || "");
        setGoal(data.goal || "maintain");
        setDailyCalories(data.daily_calorie_goal || 2000);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const calculateCalories = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (!w || !h) return;

    // Simple BMR calculation (Mifflin-St Jeor)
    // Assuming average male calculation, can be expanded
    let bmr = 10 * w + 6.25 * h - 5 * 30 + 5;

    // Apply activity factor (sedentary)
    bmr = bmr * 1.2;

    // Adjust for goal
    if (goal === "lose_weight") {
      bmr = bmr - 500; // 500 calorie deficit
    } else if (goal === "gain_muscle") {
      bmr = bmr + 300; // 300 calorie surplus
    }

    setDailyCalories(Math.round(bmr));
  };

  const saveGoals = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          weight: parseFloat(weight) || null,
          height: parseFloat(height) || null,
          goal,
          daily_calorie_goal: dailyCalories,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Metas atualizadas!",
        description: "Suas metas foram salvas com sucesso",
      });
    } catch (error: any) {
      console.error("Error saving goals:", error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const goalOptions = [
    {
      value: "lose_weight",
      label: "Emagrecer",
      icon: TrendingDown,
      color: "text-blue-500",
    },
    {
      value: "maintain",
      label: "Manter Peso",
      icon: Activity,
      color: "text-primary",
    },
    {
      value: "gain_muscle",
      label: "Ganhar Massa",
      icon: TrendingUp,
      color: "text-accent",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Suas Metas 🎯</h2>
        <p className="text-muted-foreground">
          Configure seus objetivos e receba recomendações personalizadas
        </p>
      </div>

      {/* Goal Selection */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Qual é o seu objetivo?</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {goalOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setGoal(option.value)}
              className={`p-4 rounded-xl border-2 transition-all ${
                goal === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <option.icon className={`w-8 h-8 mx-auto mb-2 ${option.color}`} />
              <p className="font-medium text-center">{option.label}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Physical Data */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Dados Físicos</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="Ex: 70.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              placeholder="Ex: 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
        </div>

        <Button
          variant="outline"
          onClick={calculateCalories}
          disabled={!weight || !height}
          className="w-full"
        >
          Calcular Meta Calórica
        </Button>
      </Card>

      {/* Calorie Goal */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Meta Calórica Diária</h3>

        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">
              {dailyCalories}
            </div>
            <p className="text-sm text-muted-foreground">kcal por dia</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="calories">Ajustar Manualmente</Label>
          <Input
            id="calories"
            type="number"
            step="50"
            value={dailyCalories}
            onChange={(e) => setDailyCalories(parseInt(e.target.value) || 2000)}
          />
          <p className="text-xs text-muted-foreground">
            {goal === "lose_weight"
              ? "💡 Déficit calórico recomendado: 300-500 kcal"
              : goal === "gain_muscle"
              ? "💡 Superávit calórico recomendado: 200-400 kcal"
              : "💡 Mantenha uma alimentação equilibrada"}
          </p>
        </div>
      </Card>

      <Button
        onClick={saveGoals}
        disabled={loading}
        className="w-full bg-gradient-primary"
        size="lg"
      >
        {loading ? "Salvando..." : "Salvar Metas"}
      </Button>
    </div>
  );
};

export default Goals;
