
"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Loader2, Search, Trash2, CheckCircle, Home } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Textarea } from "./ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { saveIncident } from "@/app/actions";
import { getHarpIncidents } from "@/lib/data-loader";

const formSchema = z.object({
  date: z.date({ required_error: "A date is required." }),
  location: z.string().min(1, "Location is required.").max(100),
  department: z.string().min(1, "Department is required.").max(100),
  block: z.string().min(1, "Block is required.").max(100),
  floor: z.string().min(1, "Floor is required.").max(100),
  activity: z.string().min(1, "Activity is required.").max(100),
  carriedOutBy: z.string().min(1, "Carried Out By is required.").max(100),
  employeeType: z.string().min(1, "Employee Type is required.").max(100),
  employeeName: z.string().min(1, "Employee Name is required.").max(100),
  employeeId: z.string().min(1, "Employee ID is required.").max(100),
  designation: z.string().min(1, "Designation is required.").max(100),
  employeeDepartment: z
    .string()
    .min(1, "Employee Department is required.")
    .max(100),
  hazard: z.string().min(1, "Hazard is required.").max(100),
  accident: z.string().min(1, "Accident is required.").max(100),
  risk: z.string().min(1, "Risk is required.").max(100),
  prevention: z.string().min(1, "Prevention is required.").max(100),
  otherObservation: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface IncidentDoc {
  id: string;
  harpId: string;
  [key: string]: any;
}

const locations = ["Patancheru", "Khandala", "Rohtak", "Vizag", "Mysuru", "Kasna", "Ankleshwar", "Sripi"];
const departments = ["Production Department", "Quality Department", "Admin Department"];
const blocks = ["RH House", "EH House", "SPB", "WPB"];
const floors = ["RH Reactor Floor", "EH Reactor Floor", "SPB Floor", "WPB Floor"];
const people = ["Sai", "Manmohan", "Ashish", "Tanmay", "Aniket", "Shriyash"];
const employeeTypes = ["APL Employee", "APG", "PPGAP", "APPPG"];
const employeeIds = ["P00126717", "P00126718"];
const designations = [
    "Executive I - Production",
    "Executive II - Production",
    "Senior Executive - Production",
    "Assistant Manager - Production",
    "Manager - Production",
    "Senior Manager - Production",
    "Executive I - Quality",
    "Executive II - Quality",
    "Senior Executive - Quality",
    "Assistant Manager - Quality",
    "Manager - Quality",
    "Senior Manager - Quality",
    "Associate General Manager - Manufacturing",
    "General Manager - Manufacturing"
];
const employeeDepartments = ["PRODUCTION", "QUALITY"];
const hazards = ["Chemical Hazards", "Chemical Splash", "eyes", "face", "body"];
const risks = ["Medium", "high", "low"];


function HarpFormContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const [activeTab, setActiveTab] = React.useState(tab || "new");
  const [searchId, setSearchId] = React.useState("");
  const [foundIncident, setFoundIncident] = React.useState<IncidentDoc | null>(
    null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [harpId, setHarpId] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);


  const defaultFormValues = {
    date: new Date(),
    location: "Khandala",
    department: "Production Department",
    block: "SPB",
    floor: "SPB Floor",
    activity: "",
    carriedOutBy: "Aniket",
    employeeType: "APL Employee",
    employeeName: "Aniket",
    employeeId: "P00126717",
    designation: "Manager - Production",
    employeeDepartment: "PRODUCTION",
    hazard: "Chemical Hazards",
    accident: "Exposure to chemical while charging",
    risk: "Medium",
    prevention: "",
    otherObservation: "",
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  const generateNewId = React.useCallback(() => {
    setHarpId(`HARP-${Date.now()}`);
  }, []);

  React.useEffect(() => {
    generateNewId();
  }, [generateNewId]);

  React.useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const handleSearch = async () => {
    if (!searchId) return;
    setIsLoading(true);
    setFoundIncident(null);

    const incidentData = await getHarpIncidents();
    const found = incidentData.find(
      (inc: any) => inc.id === searchId || inc.harpid === searchId
    );

    if (found) {
      const formattedData = {
        ...found,
        carriedoutby: found.carriedoutby,
        employeetype: found.employeetype,
        employeename: found.employeename,
        employeeid: found.employeeid,
        employeedepartment: found.employeedepartment,
        otherobservation: found.otherobservation,
        date: parseISO(found.date),
      };
      setFoundIncident(found as IncidentDoc);
      form.reset(formattedData);
      toast({
        title: "Incident Found",
        description: `Details for incident ID ${searchId} have been loaded.`,
      });
    } else {
      form.reset(defaultFormValues);
      toast({
        variant: "destructive",
        title: "Not Found",
        description: "No incident found with that ID.",
      });
    }
    setIsLoading(false);
  };

  const handleUpdate = async (values: FormValues) => {
    if (!foundIncident) return;
    setIsLoading(true);

    toast({ title: "Update Not Implemented", description: "Database update functionality is not yet implemented." });
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!foundIncident) return;
    setIsLoading(true);
    toast({ title: "Delete Not Implemented", description: "Database delete functionality is not yet implemented." });
    setIsLoading(false);
  };

  const onNewSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    const newIncident = {
        id: harpId.toLowerCase().replace(/[^a-z0-9]/g, ""),
        harpId: harpId,
        date: values.date.toISOString(),
        location: values.location,
        department: values.department,
        block: values.block,
        floor: values.floor,
        activity: values.activity,
        carriedOutBy: values.carriedOutBy,
        employeeType: values.employeeType,
        employeeName: values.employeeName,
        employeeId: values.employeeId,
        designation: values.designation,
        employeeDepartment: values.employeeDepartment,
        hazard: values.hazard,
        accident: values.accident,
        risk: values.risk,
        prevention: values.prevention,
        otherObservation: values.otherObservation,
      };

    const result = await saveIncident(
      "harp_incidents",
      newIncident
    );

    if (result.success) {
      setShowSuccess(true);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save incident: ${result.message}`,
      });
    }

    setIsLoading(false);
  };

  const resetSearch = () => {
    setSearchId("");
    setFoundIncident(null);
    form.reset(defaultFormValues);
    generateNewId();
    setShowSuccess(false);
  };
  
  if (showSuccess) {
    return (
        <Card className="w-full shadow-2xl">
            <CardContent className="flex flex-col items-center justify-center p-10 min-h-[500px] text-center">
                <CheckCircle className="w-24 h-24 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Incident Raised Successfully!</h2>
                <p className="text-muted-foreground mb-6">HARP Incident {harpId} has been saved.</p>
                <div className="flex gap-4">
                    <Button onClick={resetSearch}>Raise Another Incident</Button>
                    <Link href="/" passHref>
                        <Button variant="outline"><Home className="mr-2 h-4 w-4" /> Go to Home</Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
  }


  const currentForm = (
    <fieldset
      disabled={isLoading || (activeTab === "modify" && !foundIncident)}
      className="space-y-4"
    >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
        {activeTab === 'new' && (
            <FormItem>
              <FormLabel>HARP ID #</FormLabel>
              <FormControl>
                <Input disabled value={harpId} />
              </FormControl>
              <FormDescription>(Auto Generated)</FormDescription>
            </FormItem>
        )}
        {activeTab !== 'new' && foundIncident && (
            <FormItem>
              <FormLabel>HARP ID #</FormLabel>
              <FormControl>
                <Input disabled value={foundIncident.harpId} />
              </FormControl>
            </FormItem>
        )}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Date<span className="text-red-500">*</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Location<span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Department<span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departments.map((dep) => (
                    <SelectItem key={dep} value={dep}>
                      {dep}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="block"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Block<span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a block" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {blocks.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="floor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Floor<span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a floor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {floors.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="activity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Activity<span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter activity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="carriedOutBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Carried Out By<span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a person" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {people.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="employeeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Employee Type<span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employeeTypes.map((et) => (
                    <SelectItem key={et} value={et}>
                      {et}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="employeeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Employee Name<span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {people.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Employee ID<span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an Employee ID" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employeeIds.map((id) => (
                    <SelectItem key={id} value={id}>
                      {id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Designation<span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a designation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {designations.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="employeeDepartment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Employee Department<span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employeeDepartments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="hazard"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Hazard<span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a hazard" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {hazards.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="accident"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Accident<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                    <Input placeholder="Enter accident details" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="risk"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Risk<span className="text-red-500">*</span></FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a risk level" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {risks.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="prevention"
            render={({ field }) => (
                <FormItem className="md:col-span-3">
                <FormLabel>Prevention<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                    <Textarea placeholder="Describe prevention measures" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="otherObservation"
            render={({ field }) => (
                <FormItem className="md:col-span-3">
                <FormLabel>Other Observation/Support Required</FormLabel>
                <FormControl>
                    <Textarea placeholder="Enter your observations" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
      </div>
    </fieldset>
  );

  return (
    <Card className="w-full shadow-2xl">
      <CardHeader>
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            resetSearch();
          }}
          className="w-full"
        >
          <div className="flex justify-center mb-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="new">New Incident</TabsTrigger>
              <TabsTrigger value="modify">Modify Incident</TabsTrigger>
              <TabsTrigger value="delete">Delete Incident</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="new" className="text-center">
            <CardTitle className="font-headline text-2xl">
              HARP Incident Form
            </CardTitle>
            <CardDescription>
              Fill out the form to record a new HARP incident.
            </CardDescription>
          </TabsContent>
          <TabsContent value="modify" className="text-center">
            <CardTitle className="font-headline text-2xl">
              Modify HARP Incident
            </CardTitle>
            <CardDescription>
              Enter an incident ID to find and modify an incident.
            </CardDescription>
          </TabsContent>
          <TabsContent value="delete" className="text-center">
            <CardTitle className="font-headline text-2xl">
              Delete HARP Incident
            </CardTitle>
            <CardDescription>
              Enter an incident ID to find and delete an incident.
            </CardDescription>
          </TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              activeTab === "new" ? onNewSubmit : handleUpdate
            )}
            className="space-y-8 min-h-[500px]"
          >
            {(activeTab === "modify" || activeTab === "delete") && (
              <div className="flex items-center gap-2 mb-8 max-w-md mx-auto">
                <Input
                  placeholder="Enter Incident ID to find..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={handleSearch}
                  disabled={!searchId || isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                  Search
                </Button>
              </div>
            )}

            {(activeTab === "new" ||
              (activeTab === "modify" && foundIncident)) &&
              currentForm}

            {activeTab === "delete" && !foundIncident && !isLoading && (
              <div className="text-center text-muted-foreground py-10">
                <p>Please search for an incident to delete.</p>
              </div>
            )}

            {activeTab === "delete" && foundIncident && (
              <div className="text-center text-muted-foreground py-10 max-w-md mx-auto">
                <p>
                  You have found incident{" "}
                  <span className="font-semibold">{foundIncident.harpId}</span>.
                  Are you sure you want to delete it?
                </p>
              </div>
            )}

            <CardFooter className="flex justify-end p-0 pt-4">
              {activeTab === "new" && (
                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit Incident
                </Button>
              )}
              {activeTab === "modify" && (
                <Button type="submit" disabled={isLoading || !foundIncident}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Incident
                </Button>
              )}
              {activeTab === "delete" && foundIncident && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isLoading}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Incident
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the incident with ID:{" "}
                        <span className="font-semibold">
                          {foundIncident.harpId}
                        </span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          "Yes, delete it"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function HarpForm() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <HarpFormContent />
        </React.Suspense>
    )
}
