import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MealHistoryProps {
  userId: string;
}

interface Meal {
  id: string;
  image_url: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foods: any;
  created_at: string;
}

const MealHistory = ({ userId }: MealHistoryProps) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMeals();
  }, [userId]);

  const fetchMeals = async () => {
    try {
      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setMeals(data || []);
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (mealId: string) => {
    try {
      const { error } = await supabase.from("meals").delete().eq("id", mealId);

      if (error) throw error;

      setMeals(meals.filter((m) => m.id !== mealId));
      toast({
        title: "Refeição removida",
        description: "A refeição foi excluída do histórico",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando histórico...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Histórico de Refeições 🍽️</h2>
        <p className="text-muted-foreground">
          Veja todas as refeições que você já registrou
        </p>
      </div>

      {meals.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Nenhuma refeição ainda</h3>
          <p className="text-muted-foreground">
            Comece tirando fotos das suas refeições!
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {meals.map((meal) => (
            <Card key={meal.id} className="overflow-hidden">
              <div className="relative h-48">
                {meal.image_url ? (
                  <img
                    src={meal.image_url}
                    alt="Meal"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Sem imagem</p>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteMeal(meal.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(meal.created_at)}
                  </span>
                  <span className="font-bold text-primary">{meal.calories} kcal</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-sm font-medium">{meal.protein}g</p>
                    <p className="text-xs text-muted-foreground">Proteína</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{meal.carbs}g</p>
                    <p className="text-xs text-muted-foreground">Carbs</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{meal.fat}g</p>
                    <p className="text-xs text-muted-foreground">Gordura</p>
                  </div>
                </div>

                {meal.foods && meal.foods.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Alimentos:</p>
                    <p className="text-sm">
                      {meal.foods.map((f: any) => f.name).join(", ")}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealHistory;
