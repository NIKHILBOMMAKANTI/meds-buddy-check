import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Image, Camera, Clock } from "lucide-react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { supabase } from "@/SupabaseConnection";
import Swal from "sweetalert2";

interface MedicationTrackerProps {
  date: string;
  isTaken: boolean;
  onMarkTaken: (date: string, imageFile?: File) => void;
  isToday: boolean;
}

const MedicationTracker = ({
  date,
  isTaken,
  onMarkTaken,
  isToday,
}: MedicationTrackerProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [MedicationData, setMedicationData] = useState([]);
  const [MedicationLog, setMedicationLog] = useState([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const patientid = useParams();
  const id = patientid.id;

  useEffect(() => {
    const fetchData = async () => {
      const todaysDate = new Date().toISOString().split("T")[0];
      console.log("TodaysDate",todaysDate);
      const { data, error } = await supabase
        .from("Medications")
        .select("*")
        .eq("patient_id", id).lte("start_date", todaysDate).gte("end_date", todaysDate);;
      setMedicationData(data);
      const medicationLogs = await supabase
        .from("MedicationLogs")
        .select("*")
        .eq("patient_id", id);
      console.log("medication logs", medicationLogs.data);
    };
    fetchData();
  }, []);

  console.log("patined medication", MedicationData);

  const dailyMedication = {
    name: "Daily Medication Set",
    time: "8:00 AM",
    description: "Complete set of daily tablets",
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMarkTaken = async () => {
    try {
      console.log(MedicationData);
      if (!MedicationData || MedicationData.length === 0  ) {
        Swal.fire({
          icon: "warning",
          title: "No Medication Found",
          text: "Please contact your caretaker to update your prescriptions.",
          confirmButtonColor: "rgb(22, 163, 74)",
        });
        return
      }
      const today = new Date().toISOString().split("T")[0];
      const inserts = MedicationData.map((item) => {
        return supabase.from("MedicationLogs").insert({
          medication_id: item.id,
          patient_id: item.patient_id,
          date: today,
          taken: true,
        });
      });
      const results = await Promise.all(inserts);

      results.forEach(({ error }, index) => {
        if (error) {
          Swal.fire({
            icon: "error",
            text: `${error.message}`,
            confirmButtonColor: "rgb(22, 163, 74)",
          });
          return;
        }
      });

      Swal.fire({
        icon: "success",
        title: "Medication Recorded",
        text: "You've successfully marked today's medication as taken.",
        confirmButtonColor: "rgb(22, 163, 74)",
      }).then((result) => {
        if (result.isConfirmed) {
          onMarkTaken(date, selectedImage || undefined);
          setSelectedImage(null);
          setImagePreview(null);
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something Went Wrong",
        text: `${error.message}`,
        confirmButtonColor: "rgb(22, 163, 74)",
      });
    }
  };

  if (isTaken) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8 bg-green-50 rounded-xl border-2 border-green-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Medication Completed!
            </h3>
            <p className="text-green-600">
              Great job! You've taken your medication for{" "}
              {format(new Date(date), "MMMM d, yyyy")}.
            </p>
          </div>
        </div>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-green-800">
                  {dailyMedication.name}
                </h4>
                <p className="text-sm text-green-600">
                  {dailyMedication.description}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Clock className="w-3 h-3 mr-1" />
              {dailyMedication.time}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {MedicationData.map((Medication) => {
          return (
            <Card
              className="hover:shadow-md transition-shadow"
              key={Medication.id}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      <i className="fas fa-pills text-success"></i>
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{Medication.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {Medication.end_date}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {dailyMedication.time}
                </Badge>
              </CardContent>
            </Card>
          );
        })}

        {/* Image Upload Section */}
        <Card className="border-dashed border-2 border-border/50">
          <CardContent className="p-6">
            <div className="text-center">
              <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Add Proof Photo (Optional)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Take a photo of your medication or pill organizer as
                confirmation
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                ref={fileInputRef}
                className="hidden"
              />

              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mb-4"
              >
                <Camera className="w-4 h-4 mr-2" />
                {selectedImage ? "Change Photo" : "Take Photo"}
              </Button>

              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Medication proof"
                    className="max-w-full h-32 object-cover rounded-lg mx-auto border-2 border-border"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Photo selected: {selectedImage?.name}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mark as Taken Button */}
        <Button
          onClick={handleMarkTaken}
          className="w-full py-4 text-lg bg-green-600 hover:bg-green-700 text-white"
          disabled={!isToday}
        >
          <Check className="w-5 h-5 mr-2" />
          {isToday ? "Mark as Taken" : "Cannot mark future dates"}
        </Button>

        {!isToday && (
          <p className="text-center text-sm text-muted-foreground">
            You can only mark today's medication as taken
          </p>
        )}
      </div>
    </>
  );
};

export default MedicationTracker;
