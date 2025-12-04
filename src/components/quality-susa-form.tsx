
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
import { ChevronLeft, Loader2, Printer, Download } from "lucide-react";
import { format } from "date-fns";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import { useRouter } from 'next/navigation';
import AsianPaintsLogo from "./asian-paints-logo";
import { useFirestore, useAuth } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
});

type FormValues = z.infer<typeof formSchema>;

const locations = ["Kasna", "Sriperumbudur", "Patancheru", "Khandala", "Rohtak", "Vizag", "Mysuru", "Ankleshwar"];
const departments = ["Production Department", "Quality Department", "Admin Department"];
const blocks = ["Resin House (RH) Block", "EH House", "SPB", "WPB"];
const floors = ["RH Reactor Floor", "EH Reactor Floor", "SPB Floor", "WPB Floor"];
const observers = ["RAVISINGH.", "Sai", "Manmohan", "Ashish", "Tanmay", "Aniket"];
const observerTypes = ["APL Employee", "APG", "PPGAP", "APPPG"];
const employeeIds = ["00133029", "P00126717", "P00126718"];
const designations = ["EXECUTIVE I - PRODUCTION", "Executive II - Production", "Manager - Production"];
const employeeDepartments = ["PRODUCTION", "QUALITY", "ENGINEERING"];


export default function QualitySusaForm() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const auth = useAuth();
  const formRef = React.useRef<HTMLDivElement>(null);
  const qrCodeRef = React.useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [qrCodeValue, setQrCodeValue] = React.useState<string | null>(null);
  
  const [bbqReferenceNumber, setBbqReferenceNumber] = React.useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      locationName: "Kasna",
      department: "Production Department",
      block: "Resin House (RH) Block",
      areaFloor: "RH Reactor Floor",
      observerName: "RAVISINGH.",
      observerType: "APL Employee",
      employeeId: "00133029",
      designation: "EXECUTIVE I - PRODUCTION",
      employeeDepartment: "PRODUCTION",
      employeeBlock: "Resin House (RH) Block",
    },
  });
  
  React.useEffect(() => {
    setBbqReferenceNumber(`QUALITYSUSA${format(new Date(), 'yyyyMMddHHmmss')}`);
  }, []);

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
    
    const newBbqReferenceNumber = `QUALITYSUSA${format(new Date(), 'yyyyMMddHHmmss')}`;
    setBbqReferenceNumber(newBbqReferenceNumber);
    
    const incidentData = {
      ...values,
      bbqReferenceNumber: newBbqReferenceNumber,
      createdAt: serverTimestamp(),
      userId: auth?.currentUser?.uid || 'anonymous',
    };

    try {
        const docRef = collection(firestore, 'quality-susa-incidents');
        await addDoc(docRef, incidentData);
        toast({
          title: "Success!",
          description: `QUALITY SUSA has been raised with reference ID: ${newBbqReferenceNumber}.`,
        });
        form.reset();
        setBbqReferenceNumber(`QUALITYSUSA${format(new Date(), 'yyyyMMddHHmmss')}`);
    } catch (error: any) {
        console.error("Error writing document: ", error);
        toast({
          variant: "destructive",
          title: "Submission Error",
          description: `There was an error submitting the form: ${error.message}`,
        });
    } finally {
        setIsSubmitting(false);
    }
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
              <Accordion type="multiple" className="w-full" defaultValue={["general-details"]}>
                <AccordionItem value="general-details" className="border-b-0">
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 pt-8 px-0">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Clear Form
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : null}
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
