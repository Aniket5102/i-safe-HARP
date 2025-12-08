
"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
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
import { CalendarIcon, Loader2, Search, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "./ui/textarea";
import { useFirestore } from "@/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  Timestamp
} from "firebase/firestore";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

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
    const firestore = useFirestore();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab');

    const [activeTab, setActiveTab] = React.useState(tab || "new");
    const [incidentId, setIncidentId] = React.useState("");
    const [foundIncident, setFoundIncident] = React.useState<ObservationDoc | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        observerName: "John Doe",
        location: "Workshop A",
        observationDate: new Date(),
        taskObserved: "Welding, Forklift Operation",
        properUseOfPPE: "n/a",
        bodyPositioning: "n/a",
        toolAndEquipmentHandling: "n/a",
        comments: "",
        },
    });

    React.useEffect(() => {
        if (tab) {
            setActiveTab(tab);
        }
    }, [tab]);

    const handleSearch = async () => {
        if (!firestore || !incidentId) return;
        setIsLoading(true);
        setFoundIncident(null);
        form.reset();

        try {
        const docRef = doc(firestore, "bbs-observations", incidentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data() as DocumentData;
            if (data.observationDate instanceof Timestamp) {
                data.observationDate = data.observationDate.toDate();
            }
            form.reset(data as FormValues);
            setFoundIncident({ id: docSnap.id, data: data as FormValues });
            toast({ title: "Success", description: "Incident found and loaded." });
        } else {
            toast({
            variant: "destructive",
            title: "Not Found",
            description: "No incident found with that ID.",
            });
        }
        } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message || "An error occurred while searching.",
        });
        } finally {
        setIsLoading(false);
        }
    };

    const handleUpdate = async (values: FormValues) => {
        if (!firestore || !foundIncident) return;
        setIsLoading(true);

        const docRef = doc(firestore, "bbs-observations", foundIncident.id);
        const updatedData = {
          ...values,
          updatedAt: serverTimestamp(),
        };

        updateDoc(docRef, updatedData)
            .then(() => {
                toast({ title: "Success", description: "Incident updated successfully." });
            })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: docRef.path,
                    operation: 'update',
                    requestResourceData: updatedData,
                } satisfies SecurityRuleContext);
                errorEmitter.emit('permission-error', permissionError);
            }).finally(() => {
                setIsLoading(false);
            });
    };

    const handleDelete = async () => {
        if (!firestore || !foundIncident) return;
        setIsLoading(true);

        const docRef = doc(firestore, "bbs-observations", foundIncident.id);
        
        deleteDoc(docRef).then(() => {
            toast({ title: "Success", description: "Incident deleted successfully."});
            setFoundIncident(null);
            setIncidentId('');
            form.reset();
        }).catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: docRef.path,
                operation: 'delete',
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    const onNewSubmit = async (values: FormValues) => {
        if (!firestore) return;
        setIsLoading(true);

        const observationData = {
            ...values,
            createdAt: serverTimestamp(),
        };
        
        const obsCollection = collection(firestore, 'bbs-observations');

        addDoc(obsCollection, observationData)
            .then(docRef => {
                toast({
                    title: "Success!",
                    description: `Safety observation has been recorded with ID: ${docRef.id}.`,
                });
                form.reset();
            })
            .catch(async (serverError) => {
                 const permissionError = new FirestorePermissionError({
                    path: obsCollection.path,
                    operation: 'create',
                    requestResourceData: observationData,
                } satisfies SecurityRuleContext);
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const resetSearch = () => {
        setIncidentId("");
        setFoundIncident(null);
        form.reset({
        observerName: "John Doe",
        location: "Workshop A",
        observationDate: new Date(),
        taskObserved: "Welding, Forklift Operation",
        properUseOfPPE: "n/a",
        bodyPositioning: "n/a",
        toolAndEquipmentHandling: "n/a",
        comments: "",
        });
    };
    
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
                
                { (activeTab === 'new' || activeTab === 'modify') && currentForm }
                
                {activeTab === 'delete' && !foundIncident && !isLoading && (
                <div className="text-center text-muted-foreground py-10">
                    <p>Please search for an incident to delete.</p>
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

    