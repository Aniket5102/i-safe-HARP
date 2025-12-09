
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBbsObservations } from "@/lib/data-loader";

const formSchema = z.object({
  observerName: z.string().min(1, "Observer name is required."),
  location: z.string().min(1, "Location is required."),
  observationDate: z.date({ required_error: "A date is required." }),
  taskObserved: z.string().min(1, "Task observed is required."),
  properUseOfPPE: z.enum(["safe", "at-risk", "n/a"]),
  bodyPositioning: z.enum(["safe", "at-risk", "n/a"]),
  toolAndEquipmentHandling: z.enum(["safe", "at-risk", "n/a"]),
  comments: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ObservationDoc {
  id: string;
  data: FormValues;
}

const behaviorCategories = [
  { name: "properUseOfPPE", label: "Proper Use of PPE" },
  { name: "bodyPositioning", label: "Body Positioning" },
  { name: "toolAndEquipmentHandling", label: "Tool and Equipment Handling" },
] as const;

function BbsFormContent() {
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    const [activeTab, setActiveTab] = React.useState(tab || "new");
    const [incidentId, setIncidentId] = React.useState("");
    const [foundIncident, setFoundIncident] = React.useState<ObservationDoc | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [newObservationId, setNewObservationId] = React.useState("");


    const defaultFormValues = {
      observerName: "John Doe",
      location: "Workshop A",
      observationDate: new Date(),
      taskObserved: "Welding, Forklift Operation",
      properUseOfPPE: "n/a" as const,
      bodyPositioning: "n/a" as const,
      toolAndEquipmentHandling: "n/a" as const,
      comments: "",
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultFormValues,
    });

    React.useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        }
    }, [tab]);

    const handleSearch = async () => {
        if (!incidentId) return;
        setIsLoading(true);
        setFoundIncident(null);
        
        const observationData = await getBbsObservations();
        const found = observationData.find((obs: any) => obs.id === incidentId);

        if (found) {
          const formattedData = {
            ...found.data,
            observationDate: parseISO(found.data.observationDate),
          };
          setFoundIncident({id: found.id, data: formattedData as FormValues});
          form.reset(formattedData);
          toast({
            title: "Observation Found",
            description: `Details for observation ID ${incidentId} have been loaded.`,
          });
        } else {
          form.reset(defaultFormValues);
          toast({
            variant: "destructive",
            title: "Not Found",
            description: "No observation found with that ID.",
          });
        }
        setIsLoading(false);
    };

    const handleUpdate = async (values: FormValues) => {
        if (!foundIncident) return;
        setIsLoading(true);

        // This is a mock implementation since we can't write to a file.
        setTimeout(() => {
          toast({ title: "Update Mocked", description: "In a real app, this would update the data." });
          setIsLoading(false);
        }, 1000);
    };

    const handleDelete = async () => {
        if (!foundIncident) return;
        setIsLoading(true);

        // This is a mock implementation.
        setTimeout(() => {
          toast({ title: "Delete Mocked", description: "In a real app, this would delete the data." });
          setFoundIncident(null);
          setIncidentId('');
          form.reset(defaultFormValues);
          setIsLoading(false);
        }, 1000);
    };

    const onNewSubmit = async (values: FormValues) => {
        setIsLoading(true);
        // This is a mock implementation.
        setTimeout(() => {
          const newId = `BBS-${Date.now()}`;
          setNewObservationId(newId);
          setShowSuccess(true);
          setIsLoading(false);
        }, 1000);
    };

    const resetSearch = () => {
        setIncidentId("");
        setFoundIncident(null);
        form.reset(defaultFormValues);
        setShowSuccess(false);
    };

    if (showSuccess) {
      return (
          <Card className="w-full shadow-2xl">
              <CardContent className="flex flex-col items-center justify-center p-10 min-h-[500px] text-center">
                  <CheckCircle className="w-24 h-24 text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Observation Submitted Successfully!</h2>
                  <p className="text-muted-foreground mb-6">A new observation with ID {newObservationId} was created.</p>
                  <div className="flex gap-4">
                      <Button onClick={resetSearch}>Submit Another Observation</Button>
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
            disabled={isLoading || (activeTab === 'modify' && !foundIncident)}
            className="space-y-8"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
                control={form.control}
                name="observerName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Observer Name</FormLabel>
                    <FormControl>
                    <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., Workshop A" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="observationDate"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>Observation Date</FormLabel>
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
                name="taskObserved"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Task Observed</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g., Welding, Forklift Operation" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
            
            <div>
            <h3 className="text-lg font-medium mb-4">Behavior Categories</h3>
            <div className="space-y-6">
                {behaviorCategories.map((category) => (
                <FormField
                    key={category.name}
                    control={form.control}
                    name={category.name}
                    render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>{category.label}</FormLabel>
                        <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="flex items-center space-x-6"
                        >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                                <RadioGroupItem value="safe" />
                            </FormControl>
                            <FormLabel className="font-normal">Safe</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                                <RadioGroupItem value="at-risk" />
                            </FormControl>
                            <FormLabel className="font-normal">At-risk</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                                <RadioGroupItem value="n/a" />
                            </FormControl>
                            <FormLabel className="font-normal">N/A</FormLabel>
                            </FormItem>
                        </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                ))}
            </div>
            </div>

            <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Add any additional comments or observations..."
                        className="resize-none"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </fieldset>
    )

    return (
        <Card className="w-full shadow-2xl">
        <CardHeader>
            <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); resetSearch(); }} className="w-full">
            <div className="flex justify-center mb-6">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                <TabsTrigger value="new">New Observation</TabsTrigger>
                <TabsTrigger value="modify">Modify Observation</TabsTrigger>
                <TabsTrigger value="delete">Delete Incident</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="new" className="text-center">
                <CardTitle className="font-headline text-2xl">Safety Observation Form</CardTitle>
                <CardDescription>
                Fill out the form to record a new safety observation.
                </CardDescription>
            </TabsContent>
            <TabsContent value="modify" className="text-center">
                <CardTitle className="font-headline text-2xl">Modify Safety Observation</CardTitle>
                <CardDescription>
                Enter an incident ID to find and modify an observation.
                </CardDescription>
            </TabsContent>
            <TabsContent value="delete" className="text-center">
                <CardTitle className="font-headline text-2xl">Delete Safety Observation</CardTitle>
                <CardDescription>
                Enter an incident number to find and delete an observation.
                </CardDescription>
            </TabsContent>
            </Tabs>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(activeTab === 'new' ? onNewSubmit : handleUpdate)} className="space-y-8 min-h-[500px]">
                
                {(activeTab === 'modify' || activeTab === 'delete') && (
                <div className="flex items-center gap-2 mb-8 max-w-md mx-auto">
                    <Input
                    placeholder="Enter Incident ID to find..."
                    value={incidentId}
                    onChange={(e) => setIncidentId(e.target.value)}
                    disabled={isLoading}
                    />
                    <Button type="button" onClick={handleSearch} disabled={!incidentId || isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                    Search
                    </Button>
                </div>
                )}
                
                { (activeTab === 'new' || (activeTab === 'modify' && foundIncident)) && currentForm }
                
                {activeTab === 'delete' && !foundIncident && !isLoading && (
                <div className="text-center text-muted-foreground py-10">
                    <p>Please search for an incident to delete.</p>
                </div>
                )}

                {activeTab === 'delete' && foundIncident && (
                    <div className="text-center text-muted-foreground py-10 max-w-md mx-auto">
                        <p>You have found incident <span className="font-semibold">{foundIncident.id}</span>. Are you sure you want to delete it?</p>
                    </div>
                )}
                
                <CardFooter className="flex justify-end p-0 pt-4">
                {activeTab === 'new' && (
                    <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Observation
                    </Button>
                )}
                {activeTab === 'modify' && (
                    <Button type="submit" disabled={isLoading || !foundIncident}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Observation
                    </Button>
                )}
                {activeTab === 'delete' && foundIncident && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isLoading}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Incident
                        </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the
                            observation with ID: <span className="font-semibold">{foundIncident.id}</span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Yes, delete it"}
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


export default function BbsForm() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <BbsFormContent />
        </React.Suspense>
    )
}
