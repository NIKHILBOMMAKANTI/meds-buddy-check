import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {Users,Bell,Calendar as CalendarIcon,Mail,AlertTriangle,Check,Clock,Camera, CaptionsOff,} from "lucide-react";
import NotificationSettings from "./NotificationSettings";
import { format, subDays, isToday, isBefore, startOfDay } from "date-fns";
import Nav from "./ui/Nav";
import MedicationForm from "./ui/CaretakerDashboard/MedicationForm";
import MedicationHistory from "./ui/CaretakerDashboard/Medication History";
import { supabase } from "@/SupabaseConnection";
type TakenDate = {
  date: string;
  taken: boolean;
};
const CaretakerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [streakCount,setCurrentStreak] = useState(0);
  const [MissedDays,setMissedDays] = useState(0);
  const [medicatioLogsData, setMedicationLogsData] = useState([]);
  const [patientname, setPatientname] = useState();
  const [takenDays,setTakenDays] = useState(0);
  const [remainingDays,setRemainingDays] = useState();
  const [AdherenceRate,setAdherenceRate] = useState();
  const [takendates, setTakenDates] = useState(new Set());
  const [dailyMedication,setDailyMedication] = useState( {
    name: "Daily Medication Set",
    time: "8:00 AM",
    status: "pending"
  })
  // Mock data for demonstration
  const patientName = patientname;
  const adherenceRate = AdherenceRate;
  const currentStreak = streakCount;
  const missedDoses = MissedDays;
  const takenDoses = takenDays
  const RemainingDays = remainingDays;
 
  // Mock data for taken medications (same as in PatientDashboard)
  const takenDates = new Set([
    "2024-06-10",
    "2024-06-09",
    "2024-06-07",
    "2024-06-06",
    "2024-06-05",
    "2024-06-04",
    "2024-06-02",
    "2024-06-01",
  ]);

  const recentActivity = [
    { date: "2024-06-10", taken: true, time: "8:30 AM", hasPhoto: true },
    { date: "2024-06-09", taken: true, time: "8:15 AM", hasPhoto: false },
    { date: "2024-06-08", taken: false, time: null, hasPhoto: false },
    { date: "2024-06-07", taken: true, time: "8:45 AM", hasPhoto: true },
    { date: "2024-06-06", taken: true, time: "8:20 AM", hasPhoto: false },
  ];

 
  const handleSendReminderEmail = () => {
    console.log("Sending reminder email to patient...");
    // Here you would implement email sending functionality
    alert("Reminder email sent to " + patientName);
  };

  const handleConfigureNotifications = () => {
    setActiveTab("notifications");
  };

  const handleViewCalendar = () => {
    setActiveTab("calendar");
  };

  const patientid = useParams();
  const id = patientid.id;

  useEffect(() => {
    const fetchData = async () => {
      console.log(id);
      const { data, error } = await supabase
        .from("MedicationLogs")
        .select("*")
        .eq("patient_id", id);
      setMedicationLogsData(data);
      const datesTaken = new Set<string>();
      data.map((medLogs) => {
        if (medLogs.taken) {
          return datesTaken.add(format(new Date(medLogs.date), "yyyy-MM-dd"));
        }
      });

      const Patientdata = await supabase.from("Users").select("*").eq("id", id);
      const Patientusername = Patientdata.data[0].username;
      setPatientname(Patientusername);
      setTakenDates(datesTaken);   
      const todaysDate = format(new Date(), "yyyy-MM-dd")
      const todaysPatientLogs = data.filter((patientdata)=>{
        const date = format(new Date(patientdata.date), "yyyy-MM-dd");
        return date === todaysDate
      })
     const Status = (todaysPatientLogs.every((data)=>data.taken == true) && (todaysPatientLogs.length > 0))?'completed':'pending'
     setDailyMedication((prev)=>({...prev,status:Status}))

     const getCurrentStreak = ()=>{
      let streak = 0;
      let currentDate = new Date()
      console.log("Getting From Strak:",datesTaken);
      for(let i=0;i<=30;i++){
        const dateStr = format(currentDate,"yyyy-MM-dd")
        if(datesTaken.has(dateStr)){
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        }else{
          break;
        }
      }
      console.log("Streak",streak)
      setCurrentStreak(streak);
      return streak;
      

    }
    getCurrentStreak();
    const calculateMedicationStats = async ()=> {
      const UsersMedicationData = await supabase.from('Medications').select('*').eq('patient_id',id)
      const patientMedications = UsersMedicationData.data;
      const MedicationsDates = new Set(patientMedications.map((medication)=>medication.start_date));
      const MedicationsEnddates = new Set(patientMedications.map((medication)=>medication.end_date));
      const  SortedDates = [...MedicationsDates].sort((a,b)=>a-b);
      const EndDates = [...MedicationsEnddates].sort((a,b)=> b-a);
      const today = new Date()
      const startDate = new Date(SortedDates[0]);
      const EndDate = new Date(EndDates[0]);
      const msDiff = today.getTime() - startDate.getTime();
      const days = Math.floor(msDiff/(1000 * 60 * 60 * 24))
      const totalTakenDays = [...datesTaken].length
      const totalMissedDays = days - totalTakenDays
      const TotalPrescribedDays = Math.floor((EndDate.getTime() - startDate.getTime())/(1000 * 60 * 60 * 24))
      const pendingMedicationDays = TotalPrescribedDays - totalMissedDays - totalTakenDays
      const AdherenceRate = (totalTakenDays)/(TotalPrescribedDays) * 100;
      setMissedDays(totalMissedDays);
      setTakenDays(totalTakenDays);
      setAdherenceRate(AdherenceRate);
      setRemainingDays(pendingMedicationDays);

    }
    calculateMedicationStats();

    };
    fetchData();
    
  }, []);
  const getDayClassName = (date) => {
    const today = new Date();
    const dateStr = format(date, "yyyy-MM-dd");
    const isCurrentDay = isToday(dateStr);
    const isTaken = takenDates.has(dateStr);
    const isPast = isBefore(date, startOfDay(today));

    let className = "";
    if (isCurrentDay) {
      className += " bg-blue-100 border-blue-300 ";
    }

    if (isTaken) {
      className += " bg-green-100 text-green-800 ";
    } else if (isPast && !isTaken) {
      className += "bg-red-50 text-red-600";
    }
    return className;
  };
  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto p-6">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Caretaker Dashboard</h2>
                <p className="text-white/90 text-lg">
                  Monitoring {patientName}'s medication adherence
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{adherenceRate}%</div>
                <div className="text-white/80">Adherence Rate</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{currentStreak}</div>
                <div className="text-white/80">Current Streak</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{missedDoses}</div>
                <div className="text-white/80">Missed </div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">
                {takenDoses}
                </div>
                <div className="text-white/80">Taken This Week</div>
              </div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="medication">Medication</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Today's Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                      Today's Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{dailyMedication.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {dailyMedication.time}
                        </p>
                      </div>
                      <Badge
                        variant={
                          dailyMedication.status === "pending"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {dailyMedication.status === "pending"
                          ? "Pending"
                          : "Completed"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={handleSendReminderEmail}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Reminder Email
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={handleConfigureNotifications}
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Configure Notifications
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      onClick={handleViewCalendar}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      View Full Calendar
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Adherence Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Adherence Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>{adherenceRate}%</span>
                    </div>
                    <Progress value={adherenceRate} className="h-3" />
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-medium text-green-600">
                          {takenDoses} days
                        </div>
                        <div className="text-muted-foreground">Taken</div>
                      </div>
                      <div>
                        <div className="font-medium text-red-600">{missedDoses} days</div>
                        <div className="text-muted-foreground">Missed</div>
                      </div>
                      <div>
                        <div className="font-medium text-blue-600">{RemainingDays} days</div>
                        <div className="text-muted-foreground">Remaining</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medication" className="space-y-6">
              <div className="grid  gap-6">
                <MedicationForm />
                <Card>
                  <CardHeader>
                    <CardTitle>Medication History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MedicationHistory />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Medication Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              activity.taken ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {activity.taken ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {format(new Date(activity.date), "EEEE, MMMM d")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {activity.taken
                                ? `Taken at ${activity.time}`
                                : "Medication missed"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {activity.hasPhoto && (
                            <Badge variant="outline">
                              <Camera className="w-3 h-3 mr-1" />
                              Photo
                            </Badge>
                          )}
                          <Badge
                            variant={
                              activity.taken ? "secondary" : "destructive"
                            }
                          >
                            {activity.taken ? "Completed" : "Missed"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div> */}
                  {/* <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.taken ? "bg-green-100" : "bg-red-100"}`}>
                            {activity.taken ? (
                              <Check className="w-5 h-5 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {format(new Date(activity.date), "EEEE, MMMM d")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {activity.taken? `Taken at ${activity.time}`: "Medication missed"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {activity.hasPhoto && (
                            <Badge variant="outline">
                              <Camera className="w-3 h-3 mr-1" />
                              Photo
                            </Badge>
                          )}
                          <Badge
                            variant={
                              activity.taken ? "secondary" : "destructive"
                            }
                          >
                            {activity.taken ? "Completed" : "Missed"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div> */}
                  {medicatioLogsData.map((item) => {
                    console.log(item);
                    console.log(takendates);
                    console.log([...takendates]);
                    const relevantSets = [...takendates].filter(
                      (date:string) => date === item.date
                    );
                    console.log(relevantSets);
                    const allTaken = relevantSets.every(
                      (set: TakenDate) => set.taken === true

                    );
                    console.log(allTaken);
                    if (allTaken && relevantSets.length > 0) {
                      return (
                        <div className="card" key={item.date}>
                          <p>Date: {item.date}</p>
                        </div>
                      );
                    }

                    return null;
                  })}
                 
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Medication Calendar Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="w-full"
                        modifiersClassNames={{
                          selected: "bg-blue-600 text-white hover:bg-blue-700",
                        }}
                        components={{
                          DayContent: ({ date }) => {
                            const dateStr = format(date, "yyyy-MM-dd");
                            const isTaken = takendates.has(dateStr);
                            const isPast = isBefore(
                              date,
                              startOfDay(new Date())
                            );
                            const isCurrentDay = isToday(date);

                            return (
                              <div className="relative w-full h-full flex items-center justify-center">
                                <span>{date.getDate()}</span>
                                {isTaken && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                    <Check className="w-2 h-2 text-white" />
                                  </div>
                                )}
                                {!isTaken && isPast && !isCurrentDay && (
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full"></div>
                                )}
                              </div>
                            );
                          },
                        }}
                      />
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Medication taken</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <span>Missed medication</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>Today</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">
                        Details for {format(selectedDate, "MMMM d, yyyy")}
                      </h4>

                      <div className="space-y-4">
                        {takenDates.has(format(selectedDate, "yyyy-MM-dd")) ? (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Check className="w-5 h-5 text-green-600" />
                              <span className="font-medium text-green-800">
                                Medication Taken
                              </span>
                            </div>
                            <p className="text-sm text-green-700">
                              {patientName} successfully took their medication
                              on this day.
                            </p>
                          </div>
                        ) : isBefore(selectedDate, startOfDay(new Date())) ? (
                          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                              <span className="font-medium text-red-800">
                                Medication Missed
                              </span>
                            </div>
                            <p className="text-sm text-red-700">
                              {patientName} did not take their medication on
                              this day.
                            </p>
                          </div>
                        ) : isToday(selectedDate) ? (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-5 h-5 text-blue-600" />
                              <span className="font-medium text-blue-800">
                                Today
                              </span>
                            </div>
                            <p className="text-sm text-blue-700">
                              Monitor {patientName}'s medication status for
                              today.
                            </p>
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                              <CalendarIcon className="w-5 h-5 text-gray-600" />
                              <span className="font-medium text-gray-800">
                                Future Date
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">
                              This date is in the future.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
};

export default CaretakerDashboard;
