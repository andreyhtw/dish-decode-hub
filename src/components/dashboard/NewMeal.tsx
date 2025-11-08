import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Loader2, CheckCircle2 } from "lucide-react";

interface NewMealProps {
  userId: string;
}

const NewMeal = ({ userId }: NewMealProps) => {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem válida",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("meal-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("meal-images").getPublicUrl(fileName);

      setImagePreview(publicUrl);

      // Start AI analysis
      setAnalyzing(true);
      await analyzeMeal(publicUrl);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const analyzeMeal = async (imageUrl: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("analyze-meal", {
        body: { image: imageUrl },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data.analysis);
      toast({
        title: "Análise concluída! ✨",
        description: "Sua refeição foi analisada com sucesso",
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Erro na análise",
        description: error.message || "Não foi possível analisar a imagem",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const saveMeal = async () => {
    if (!result || !imagePreview) return;

    try {
      const { error } = await supabase.from("meals").insert({
        user_id: userId,
        image_url: imagePreview,
        foods: result.foods,
        calories: result.totals.calories,
        protein: result.totals.protein,
        carbs: result.totals.carbs,
        fat: result.totals.fat,
        analysis_result: result,
      });

      if (error) throw error;

      toast({
        title: "Refeição salva!",
        description: "Sua refeição foi adicionada ao histórico",
      });

      // Reset
      setResult(null);
      setImagePreview("");
    } catch (error: any) {
      console.error("Save error:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Analisar Nova Refeição 📸</h2>
        <p className="text-muted-foreground">
          Tire ou envie uma foto da sua refeição para análise automática
        </p>
      </div>

      {/* Upload Area */}
      {!imagePreview && (
        <Card className="p-8 border-2 border-dashed">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Envie uma foto da refeição
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                PNG, JPG ou WEBP até 10MB
              </p>
            </div>
            <label htmlFor="meal-upload">
              <Button
                className="bg-gradient-primary"
                disabled={uploading}
                asChild
              >
                <span>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Escolher Foto
                    </>
                  )}
                </span>
              </Button>
            </label>
            <input
              id="meal-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
              disabled={uploading}
            />
          </div>
        </Card>
      )}

      {/* Image Preview & Analysis */}
      {imagePreview && (
        <div className="space-y-6">
          <Card className="p-6">
            <img
              src={imagePreview}
              alt="Meal"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            
            {analyzing && (
              <div className="text-center py-8">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold">Analisando refeição...</p>
                <p className="text-sm text-muted-foreground">
                  A IA está identificando os alimentos
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">Análise Completa</h3>
                </div>

                {/* Totals */}
                <Card className="p-4 bg-muted/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {result.totals.calories}
                      </p>
                      <p className="text-sm text-muted-foreground">kcal</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{result.totals.protein}g</p>
                      <p className="text-sm text-muted-foreground">Proteínas</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{result.totals.carbs}g</p>
                      <p className="text-sm text-muted-foreground">Carboidratos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{result.totals.fat}g</p>
                      <p className="text-sm text-muted-foreground">Gorduras</p>
                    </div>
                  </div>
                </Card>

                {/* Foods List */}
                <div>
                  <h4 className="font-semibold mb-3">Alimentos Identificados:</h4>
                  <div className="space-y-2">
                    {result.foods.map((food: any, index: number) => (
                      <Card key={index} className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{food.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {food.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-semibold">
                            {food.calories} kcal
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {result.notes && (
                  <Card className="p-4 border-l-4 border-l-primary">
                    <p className="text-sm text-muted-foreground">{result.notes}</p>
                  </Card>
                )}

                <div className="flex gap-3">
                  <Button onClick={saveMeal} className="flex-1 bg-gradient-primary">
                    Salvar Refeição
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setResult(null);
                      setImagePreview("");
                    }}
                  >
                    Nova Análise
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default NewMeal;
