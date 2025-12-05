
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
import { CalendarIcon, ChevronLeft, FileDown, Loader2, Printer, Download, X, Upload } from "lucide-react";
import { format } from "date-fns";
import QRCode from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Textarea } from "./ui/textarea";
import { useFirestore, useUser } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from 'next/navigation';
import AsianPaintsLogo from "./asian-paints-logo";
import { Calendar } from "@/components/ui/calendar";

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
  employeeDepartment: z.string().min(1, "Employee Department is required.").max(100),
  hazard: z.string().min(1, "Hazard is required.").max(100),
  accident: z.string().min(1, "Accident is required.").max(100),
  risk: z.string().min(1, "Risk is required.").max(100),
  prevention: z.string().min(1, "Prevention is required.").max(100),
  otherObservation: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof formSchema>;

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

export default function QualitySusaForm() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const router = useRouter();
  const formRef = React.useRef<HTMLDivElement>(null);
  const qrCodeRef = React.useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [qrCodeValue, setQrCodeValue] = React.useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [susaId, setSusaId] = React.useState('');
  const [bbqReferenceNumber, setBbqReferenceNumber] = React.useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  });

  const generateNewIds = React.useCallback(() => {
    const timestamp = Date.now();
    setSusaId(`SUSA-${timestamp}`);
    setBbqReferenceNumber(`BBQ-${timestamp}`);
  }, []);

  React.useEffect(() => {
    generateNewIds();
  }, [generateNewIds]);

  React.useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
      generateNewIds();
    }
  }, [form.formState.isSubmitSuccessful, form, generateNewIds]);


  async function onSubmit(values: FormValues) {
    if (!firestore) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not connect to the database. Please try again.",
      });
      return;
    }
     if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to submit an incident.',
      });
      return;
    }

    setIsSubmitting(true);
    
    const incidentData = {
      ...values,
      susaId: susaId,
      bbqReferenceNumber: bbqReferenceNumber,
      createdAt: serverTimestamp(),
      userId: user.uid,
    };
    
    try {
      await addDoc(collection(firestore, 'quality-susa-incidents'), incidentData);
      toast({
          title: "Success!",
          description: `Quality SUSA Incident has been raised with incident ID: ${susaId}.`,
      });
      form.reset();
    } catch (error: any) {
      console.error("Error submitting incident:", error);
      toast({
          variant: "destructive",
          title: "Submission Error",
          description: error.message || "Could not save the incident. Please try again.",
      });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleGenerateQrCode = () => {
    const values = form.getValues();
    const allValues = { ...values, susaId, bbqReferenceNumber };
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
      link.download = `susa-qr-code.png`;
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


  const handleExportPdf = async () => {
    const formElement = formRef.current;
    if (!formElement) return;

    try {
      const canvas = await html2canvas(formElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`quality-susa-incident.pdf`);
      toast({ title: "Success", description: "PDF export has started." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "PDF Export Error",
        description: "An error occurred while generating the PDF.",
      });
    }
  };
  
  return (
    <>
      <Card ref={formRef} className="w-full shadow-2xl" id="susa-form-card">
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Quality SUSA Details</CardTitle>
            <CardDescription>
              Fill in the form to record a new Quality SUSA entry.
            </CardDescription>
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
            <Button variant="outline" onClick={handleExportPdf}>
              <FileDown />
              Export as PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Accordion type="multiple" className="w-full" defaultValue={["general-details", "susa-details", "other-details"]} >
                <AccordionItem value="general-details">
                  <AccordionTrigger className="text-lg font-semibold">General Details</AccordionTrigger>
                  <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <FormItem>
                        <FormLabel>SUSA ID #</FormLabel>
                        <FormControl>
                            <Input disabled value={susaId} />
                        </FormControl>
                        <FormDescription>(Auto Generated)</FormDescription>
                    </FormItem>
                    <FormItem>
                        <FormLabel>BBQ Reference Number</FormLabel>
                        <FormControl>
                            <Input disabled value={bbqReferenceNumber} placeholder="Will be generated on submit" />
                        </FormControl>
                        <FormDescription>(Auto Generated)</FormDescription>
                    </FormItem>
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date<span className="text-red-500">*</span></FormLabel>
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
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location<span className="text-red-500">*</span></FormLabel>
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
                          <FormMessage />
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
                          <FormMessage />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="floor"
                      render={({ field }) => (
                         <FormItem>
                          <FormLabel>Floor<span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                              <SelectTrigger>
                                  <SelectValue placeholder="Select a floor" />
                              </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                              {floors.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
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
                          <FormLabel>Activity<span className="text-red-500">*</span></FormLabel>
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
                          <FormLabel>Carried Out By<span className="text-red-500">*</span></FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                              <SelectTrigger>
                                  <SelectValue placeholder="Select a person" />
                              </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                              {people.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
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
                          <FormLabel>Employee Type<span className="text-red-500">*</span></FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                              <SelectTrigger>
                                  <SelectValue placeholder="Select employee type" />
                              </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                              {employeeTypes.map(et => <SelectItem key={et} value={et}>{et}</SelectItem>)}
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
                          <FormLabel>Employee Name<span className="text-red-500">*</span></FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                              <SelectTrigger>
                                  <SelectValue placeholder="Select an employee" />
                              </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                              {people.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
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
                          <FormLabel>Employee ID<span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                              <SelectTrigger>
                                  <SelectValue placeholder="Select an Employee ID" />
                              </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                              {employeeIds.map(id => <SelectItem key={id} value={id}>{id}</SelectItem>)}
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
                          <FormLabel>Designation<span className="text-red-500">*</span></FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                              <SelectTrigger>
                                  <SelectValue placeholder="Select a designation" />
                              </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                              {designations.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
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
                          <FormLabel>Employee Department<span className="text-red-500">*</span></FormLabel>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="susa-details">
                  <AccordionTrigger className="text-lg font-semibold">SUSA Details</AccordionTrigger>
                   <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    
                      <FormField
                        control={form.control}
                        name="hazard"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hazard<span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <FormItem className="md:col-span-2">
                            <FormLabel>Prevention<span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe prevention measures" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="other-details" className="border-b-0">
                  <AccordionTrigger className="text-lg font-semibold">Other Details</AccordionTrigger>
                  <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                     
                      <FormField
                        control={form.control}
                        name="otherObservation"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Other Observation/Support Required</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Enter your observations" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormItem>
                        <FormLabel>Upload Attachment(s) If Any</FormLabel>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file-susa" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <FormControl>
                                    <input id="dropzone-file-susa" type="file" className="hidden" />
                                </FormControl>
                            </label>
                        </div> 
                        <FormMessage />
                      </FormItem>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 pt-8 px-0">
                {!user && (
                    <p className="text-sm text-destructive">
                    Please sign in to raise an incident.
                    </p>
                )}
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Clear Form
                </Button>
                <Button type="submit" disabled={isSubmitting || !user}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Printer />}
                  Raise Quality SUSA Incident
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

    
    