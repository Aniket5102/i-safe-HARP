"use client";

import * as React from "react";
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
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "./ui/textarea";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default function BbsForm() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);

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

  async function onSubmit(values: FormValues) {
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not connect to the database. Please try again later.",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const observationData = {
        ...values,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(firestore, 'bbs-observations'), observationData);
      toast({
        title: "Success!",
        description: `Safety observation has been recorded with ID: ${docRef.id}.`,
      });
      form.reset();
    } catch (error: any) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error.message || "Could not save the observation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const behaviorCategories = [
    { name: "properUseOfPPE", label: "Proper Use of PPE" },
    { name: "bodyPositioning", label: "Body Positioning" },
    { name: "toolAndEquipmentHandling", label: "Tool and Equipment Handling" },
  ] as const;

  return (
    <Card className="w-full shadow-2xl">
      <CardHeader>
        <Tabs defaultValue="new" className="w-full">
            <div className="flex justify-center mb-6">
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="new">New Observation</TabsTrigger>
                    <TabsTrigger value="modify" disabled>Modify Observation</TabsTrigger>
                    <TabsTrigger value="delete" disabled>Delete Incident</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="new">
                <CardTitle className="font-headline text-2xl">Safety Observation Form</CardTitle>
                <CardDescription>
                Fill out the form to record a new safety observation.
                </CardDescription>
            </TabsContent>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
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
                          onSelect={(date) => {
                              if (date) field.onChange(date);
                              setIsDatePickerOpen(false);
                          }}
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
                            defaultValue={field.value}
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
            
            <CardFooter className="flex justify-end p-0 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Observation
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
