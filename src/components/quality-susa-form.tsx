
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
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Loader2, Printer, Download, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import { useRouter } from 'next/navigation';
import AsianPaintsLogo from "./asian-paints-logo";
import { Textarea } from "./ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

const formSchema = z.object({
  locationName: z.string().min(1, "Location is required."),
  department: z.string().min(1, "Department is required."),
  block: z.string().min(1, "Block is required."),
  areaFloor: z.string().min(1, "Area/Floor is required."),
  observerName: z.string().min(1, "Observer Name is required."),
  observerType: z.string().min(1, "Observer Type is required."),
  employeeId: z.string().min(1, "Employee ID is required."),
  designation: z.string().min(1, "Designation is required."),
  employeeDepartment: z.string().min(1, "Employee Department is required."),
  employeeBlock: z.string().min(1, "Employee Block is required."),
  sbtDbtOther: z.string().max(100, "Must be 100 characters or less").optional(),
  observationGoal: z.string().optional(),
  
  dateOfObservation: z.date({ required_error: "A date is required." }),
  timeOfObservation: z.string().min(1, "Time is required."),
  shift: z.string().min(1, "Shift is required."),
  observedType: z.string().min(1, "Observed Type is required."),
  qualityKeyActivity: z.string().min(1, "Quality Key Activity is required."),
  qualityActName: z.string().min(1, "Quality Act Name is required."),
  isActComplied: z.string().min(1, "This field is required."),
  descriptionOfAct: z.string().min(1, "Description is required.").max(4000),
  keyQualityBehaviour: z.string().min(1, "Key Quality Behaviour is required."),
  susaStatus: z.string().min(1, "SUSA Status is required."),
});

type FormValues = z.infer<typeof formSchema>;

const locations = ["Sriperumbudur", "Patancheru", "Khandala", "Rohtak", "Vizag", "Mysuru", "Kasna", "Ankleshwar", "Sripi"];
const departments = ["Production Department", "Quality Department", "Admin Department", "Manufacturing Department", "Quality Assurance Department"];
const blocks = ["Manufacturing block", "RH House", "EH House", "SPB", "WPB", "POLYMER BLOCK", "MAIN QA Block"];
const floors = ["Charge hopper floor", "RH Reactor Floor", "EH Reactor Floor", "SPB Floor", "WPB Floor", "GROUND FLOOR", "Manufacturing Area", "MAIN QA AREA"];
const observers = ["VASANTH R", "Sai", "Manmohan", "Ashish", "Tanmay", "Aniket", "Shriyash", "Lohith M", "ERNET PAUL J", "SAIRAM G"];
const observerTypes = ["APL Employee", "APG", "PPGAP", "APPPG"];
const employeeIds = ["00132461", "P00126717", "P00126718"];
const designations = ["EXECUTIVE I - PLANT ENGINEERING", "Executive I - Production", "Manager - Production"];
const employeeDepartments = ["ENGINEERING", "PRODUCTION", "QUALITY"];
const shifts = ["General Shift", "Shift A", "Shift B", "Shift C", "1st Shift (6:30 - 14:30)"];
const observationGoals = ["1", "2", "3", "4", "5"];
const observedTypes = ["Technician"];
const qualityKeyActivities = ["calibration"];
const qualityActNames = ["Weighing scales are calibrated and status is available"];
const actCompliedOptions = ["Yes", "No"];
const keyQualityBehaviours = ["I will always ensure timely calibration is done following right procedure"];
const susaStatuses = ["Open", "Closed"];

export default function QualitySusaForm() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const formRef = React.useRef<HTMLDivElement>(null);
  const qrCodeRef = React.useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [qrCodeValue, setQrCodeValue] = React.useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locationName: "",
      department: "",
      block: "",
      areaFloor: "",
      observerName: "",
      observerType: "",
      employeeId: "",
      designation: "",
      employeeDepartment: "",
      employeeBlock: "",
      sbtDbtOther: "",
      observationGoal: "",
      timeOfObservation: "",
      shift: "",
      observedType: "",
      qualityKeyActivity: "",
      qualityActName: "",
      isActComplied: "",
      descriptionOfAct: "",
      keyQualityBehaviour: "",
      susaStatus: "Open",
    },
  });

  const [bbqReferenceNumber, setBbqReferenceNumber] = React.useState('');
  
  React.useEffect(() => {
    setBbqReferenceNumber(`QUALITYSUSA${format(new Date(), 'yyyyMMddHHmmss')}`);
  }, []);

  React.useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      setBbqReferenceNumber(`QUALITYSUSA${format(new Date(), 'yyyyMMddHHmmss')}`);
    }
  }, [form.formState.isSubmitSuccessful]);


  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const docToSave = {
      ...values,
      bbqReferenceNumber,
      createdAt: serverTimestamp(),
    };
    
    // Simulate a successful submission
    setTimeout(() => {
        toast({
          title: "Success! (Simulated)",
          description: `QUALITY SUSA has been raised with reference ID: ${bbqReferenceNumber}`,
        });
        form.reset();
        setIsSubmitting(false);
    }, 1000);
  }

  const handleGenerateQrCode = () => {
    const values = form.getValues();
    const allValues = { bbqReferenceNumber, ...values };
    setQrCodeValue(JSON.stringify(allValues));
  };

  const handlePrintQrCode = () => {
    window.print();
  };

  const handleDownloadQrCode = async () => {
    const qrElement = qrCodeRef.current;
    if (!qrElement) return;

    try {
      const canvas = await html2canvas(qrElement, { scale: 2, backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `quality-susa-qr-code.png`;
      link.click();
      toast({ title: "Success", description: "QR Code download has started." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "QR Code Download Error",
        description: "An error occurred while generating the QR Code image.",
      });
    }
  };
  
  const sbtDbtOtherValue = form.watch('sbtDbtOther');
  const descriptionOfActValue = form.watch('descriptionOfAct');
  
  return (
    <>
      <Card ref={formRef} className="w-full shadow-2xl" id="quality-susa-form-card">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            {/* The main title is on the page, not in the card */}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>
              <ChevronLeft />
              Back
            </Button>
            <Button variant="outline" onClick={handleGenerateQrCode}>
              <Printer />
              Print QR Code
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Accordion type="multiple" className="w-full" defaultValue={["general-details", "observation-details"]}>
                <AccordionItem value="general-details">
                  <AccordionTrigger className="text-lg font-semibold">General Details</AccordionTrigger>
                  <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <FormItem>
                        <FormLabel>BBQ Reference Number</FormLabel>
                        <FormControl>
                          <Input disabled value={bbqReferenceNumber} />
                        </FormControl>
                        <FormDescription>(Auto Generated)</FormDescription>
                      </FormItem>
                      <FormField
                        control={form.control}
                        name="locationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location Name</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a location" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a department" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {departments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormDescription>Select the Department specifically from the list</FormDescription>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="block"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Block<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a block" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {blocks.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormDescription>Select the Block specifically from the list</FormDescription>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="areaFloor"
                        render={({ field }) => (
                           <FormItem>
                            <FormLabel>Area / Floor<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an area/floor" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {floors.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormDescription>Select the Floor specifically from the list</FormDescription>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="observerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observer Name<span className="text-red-500">*</span></FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an observer" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {observers.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="observerType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observer Type</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select observer type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {observerTypes.map(et => <SelectItem key={et} value={et}>{et}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                           <FormItem>
                            <FormLabel>Employee ID</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an employee ID" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {employeeIds.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="designation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Designation</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a designation" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {designations.map(id => <SelectItem key={id} value={id}>{id}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="employeeDepartment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employee Department</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a department" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {employeeDepartments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="employeeBlock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Employee Block</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a block" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {blocks.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormDescription>Select the block specifically from the list</FormDescription>
                            <FormMessage className="mt-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                          control={form.control}
                          name="sbtDbtOther"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>SBT/DBT/Other</FormLabel>
                                  <FormControl>
                                      <Input placeholder="Enter details" {...field} maxLength={100} />
                                  </FormControl>
                                  <FormDescription>{100 - (sbtDbtOtherValue?.length || 0)} Characters Left</FormDescription>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="observationGoal"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>No. of Observation per month [GOAL]</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                          <SelectTrigger>
                                              <SelectValue placeholder="Select a goal" />
                                          </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                          {observationGoals.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                                      </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="observation-details"  className="border-b-0">
                    <AccordionTrigger className="text-lg font-semibold">Observation Details</AccordionTrigger>
                    <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <FormField
                          control={form.control}
                          name="dateOfObservation"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date of Observation<span className="text-red-500">*</span></FormLabel>
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
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage className="mt-2" />
                            </FormItem>
                          )}
                        />
                         <FormField
                            control={form.control}
                            name="timeOfObservation"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Time of Observation<span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="shift"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shift<span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select shift" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {shifts.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormDescription>Please select the Shift from the drop down list</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="observedType"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Observed Type<span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select observed type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {observedTypes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="qualityKeyActivity"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quality Key Activity<span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select activity" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {qualityKeyActivities.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="qualityActName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quality Act Name<span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select act name" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {qualityActNames.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isActComplied"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Is Act Complied<span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an option" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {actCompliedOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="descriptionOfAct"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description of Act<span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                <Textarea placeholder="Enter description" {...field} maxLength={4000} />
                                </FormControl>
                                <FormDescription>{4000 - (descriptionOfActValue?.length || 0)} Characters Left</FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="keyQualityBehaviour"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Key Quality Behaviour<span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select behaviour" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {keyQualityBehaviours.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="susaStatus"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>SUSA Status<span className="text-red-500">*</span></FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {susaStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </AccordionContent>
                </AccordionItem>
              </Accordion>
              <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 pt-8 px-0">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Clear Form
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Printer />}
                  Submit
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Dialog open={!!qrCodeValue} onOpenChange={(open) => !open && setQrCodeValue(null)}>
        <DialogContent className="sm:max-w-md p-0">
          <div className="bg-primary text-primary-foreground py-2 px-4 flex items-center justify-end gap-2">
            <Button variant="ghost" className="hover:bg-primary/80" onClick={handlePrintQrCode}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="ghost" className="hover:bg-primary/80" onClick={handleDownloadQrCode}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
          <div className="p-6" ref={qrCodeRef}>
            <div className="flex items-center justify-center space-x-4 mb-4">
                <AsianPaintsLogo />
            </div>
            <div className="flex items-center justify-center p-4 bg-white rounded-lg">
              {qrCodeValue && <QRCode value={qrCodeValue} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />}
            </div>
            <p className="text-center mt-4 text-sm text-muted-foreground">
              Scan Using Asian Paints EHS Mobile App
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

    

    